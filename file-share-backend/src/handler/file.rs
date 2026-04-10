use std::{fs, path::PathBuf, sync::Arc};

use axum::{
    body::Body,
    extract::{Multipart, Path},
    http::{Response, StatusCode},
    response::IntoResponse,
    routing::{get, post},
    Extension, Json, Router,
};
use chrono::{DateTime, Utc};
use rsa::{
    pkcs1::{DecodeRsaPrivateKey, DecodeRsaPublicKey},
    RsaPrivateKey, RsaPublicKey,
};
use uuid::Uuid;
use validator::Validate;
use base64::{engine::general_purpose::STANDARD, Engine};

use crate::{
    db::UserExt,
    dtos::{PublicDownloadDto, PublicShareInfoDto, UploadResponseDto, RetrieveFileDto},
    error::HttpError,
    middleware::JWTAuthMiddeware,
    utils::{decrypt::decrypt_file, encrypt::encrypt_file, password},
    AppState,
};

const MAX_FILE_SIZE: usize = 4 * 1024 * 1024; // 4 MB
const ALLOWED_MIME_TYPES: &[&str] = &["image/jpeg", "image/png", "image/jpg", "application/pdf"];

pub fn file_handle() -> Router {
    Router::new()
        .route("/upload", post(upload_file))
        .route("/retrieve", post(retrieve_file))
}

/// Public (no JWT) share routes.
pub fn public_share_handle() -> Router {
    Router::new()
        .route("/share/:token", get(get_public_share_info))
        .route("/share/:token/download", post(download_public_share))
}

// ── Authenticated upload ──────────────────────────────────────────────────────

pub async fn upload_file(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    mut multipart: Multipart,
) -> Result<impl IntoResponse, HttpError> {
    let mut file_data: Vec<u8> = Vec::new();
    let mut file_name = String::new();
    let mut file_mime = String::new();
    let mut recipient_email = String::new();
    let mut file_password = String::new();
    let mut expiration_date_str = String::new();

    while let Some(field) = multipart
        .next_field()
        .await
        .map_err(|e| HttpError::bad_request(format!("Multipart error: {e}")))?
    {
        let name = field
            .name()
            .ok_or_else(|| HttpError::bad_request("Missing field name"))?
            .to_string();

        match name.as_str() {
            "fileUpload" => {
                file_name = field
                    .file_name()
                    .unwrap_or("unknown_file")
                    .to_string();
                file_mime = field
                    .content_type()
                    .unwrap_or("")
                    .to_string();
                file_data = field
                    .bytes()
                    .await
                    .map_err(|e| HttpError::bad_request(format!("Failed to read file: {e}")))?
                    .to_vec();
            }
            "recipient_email" => {
                recipient_email = field
                    .text()
                    .await
                    .map_err(|e| HttpError::bad_request(e.to_string()))?;
            }
            "password" => {
                file_password = field
                    .text()
                    .await
                    .map_err(|e| HttpError::bad_request(e.to_string()))?;
            }
            "expiration_date" => {
                expiration_date_str = field
                    .text()
                    .await
                    .map_err(|e| HttpError::bad_request(e.to_string()))?;
            }
            _ => {}
        }
    }

    // ── Server-side validation ──────────────────────────────────────────────
    if file_data.is_empty() {
        return Err(HttpError::bad_request("No file provided"));
    }
    if file_data.len() > MAX_FILE_SIZE {
        return Err(HttpError::bad_request("File exceeds the 4 MB size limit"));
    }
    if !ALLOWED_MIME_TYPES.contains(&file_mime.as_str()) {
        return Err(HttpError::bad_request(
            "Only JPG, PNG, and PDF files are allowed",
        ));
    }
    if file_password.len() < 6 {
        return Err(HttpError::bad_request(
            "Password must be at least 6 characters",
        ));
    }
    if expiration_date_str.is_empty() {
        return Err(HttpError::bad_request("Expiration date is required"));
    }

    let expiration_date = DateTime::parse_from_rfc3339(&expiration_date_str)
        .map_err(|_| HttpError::bad_request("Invalid expiration date format"))?
        .with_timezone(&Utc);

    if expiration_date <= Utc::now() {
        return Err(HttpError::bad_request("Expiration date must be in the future"));
    }

    let user_id = user.user.id;
    let hash_password =
        password::hash(&file_password).map_err(|e| HttpError::server_error(e.to_string()))?;

    // ── Determine share mode: registered user vs. public link ───────────────
    let (recipient_user_id, public_share_token, encryption_public_key) = if recipient_email.is_empty() {
        // Public share: encrypt with the uploader's own public key.
        let uploader_public_key_b64 = app_state
            .db_client
            .get_user(Some(user_id), None, None)
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?
            .ok_or_else(|| HttpError::server_error("Uploader not found"))?
            .public_key
            .ok_or_else(|| HttpError::server_error("Uploader has no public key"))?;

        let pub_bytes = STANDARD
            .decode(&uploader_public_key_b64)
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let pub_pem = String::from_utf8(pub_bytes)
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let public_key = RsaPublicKey::from_pkcs1_pem(&pub_pem)
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        (None, Some(Uuid::new_v4()), public_key)
    } else {
        // Registered-user share: encrypt with recipient's public key.
        let recipient = app_state
            .db_client
            .get_user(None, None, Some(&recipient_email))
            .await
            .map_err(|e| HttpError::server_error(e.to_string()))?
            .ok_or_else(|| HttpError::bad_request("Recipient user not found"))?;

        let pub_key_str = recipient
            .public_key
            .ok_or_else(|| HttpError::bad_request("Recipient has no public key"))?;
        let pub_bytes = STANDARD
            .decode(&pub_key_str)
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let pub_pem = String::from_utf8(pub_bytes)
            .map_err(|e| HttpError::server_error(e.to_string()))?;
        let public_key = RsaPublicKey::from_pkcs1_pem(&pub_pem)
            .map_err(|e| HttpError::server_error(e.to_string()))?;

        (Some(recipient.id), None, public_key)
    };

    let (encrypted_aes_key, encrypted_data, iv) =
        encrypt_file(file_data, &encryption_public_key).await?;

    let file_size = encrypted_data.len() as i64;

    app_state
        .db_client
        .save_encrypted_file(
            user_id,
            file_name,
            file_size,
            recipient_user_id,
            public_share_token,
            hash_password,
            expiration_date,
            encrypted_aes_key,
            encrypted_data,
            iv,
        )
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?;

    let (message, share_token) = if let Some(token) = public_share_token {
        (
            "File uploaded. Share the link with anyone.".to_string(),
            Some(token.to_string()),
        )
    } else {
        (
            "File uploaded and encrypted successfully".to_string(),
            None,
        )
    };

    Ok(Json(UploadResponseDto {
        status: "success",
        message,
        share_token,
    }))
}

// ── Authenticated retrieve (registered-user share) ────────────────────────────

pub async fn retrieve_file(
    Extension(app_state): Extension<Arc<AppState>>,
    Extension(user): Extension<JWTAuthMiddeware>,
    Json(body): Json<RetrieveFileDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let user_id = user.user.id;
    let shared_id = Uuid::parse_str(&body.shared_id)
        .map_err(|_| HttpError::bad_request("Invalid shared_id format"))?;

    let shared_data = app_state
        .db_client
        .get_shared(shared_id, user_id)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or_else(|| {
            HttpError::bad_request("Shared link does not exist or has expired")
        })?;

    if !password::compare(&body.password, &shared_data.password)
        .map_err(|e| HttpError::server_error(e.to_string()))?
    {
        return Err(HttpError::bad_request("Incorrect password"));
    }

    let file_id = shared_data
        .file_id
        .ok_or_else(|| HttpError::bad_request("File ID is missing"))?;

    let file_data = app_state
        .db_client
        .get_file(file_id)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or_else(|| HttpError::bad_request("File not found or has expired"))?;

    let private_key = load_private_key(user_id)?;
    let decrypted = decrypt_file(
        file_data.encrypted_aes_key,
        file_data.encrypted_file,
        file_data.iv,
        &private_key,
    )
    .await?;

    build_download_response(decrypted, &file_data.file_name)
}

// ── Public (no JWT) share endpoints ──────────────────────────────────────────

/// Returns file metadata for a public share link without requiring login.
pub async fn get_public_share_info(
    Extension(app_state): Extension<Arc<AppState>>,
    Path(token): Path<String>,
) -> Result<impl IntoResponse, HttpError> {
    let token_uuid = Uuid::parse_str(&token)
        .map_err(|_| HttpError::bad_request("Invalid share token"))?;

    let info = app_state
        .db_client
        .get_public_share_info(token_uuid)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or_else(|| HttpError::not_found("Share link not found or has expired"))?;

    Ok(Json(PublicShareInfoDto {
        status: "success".to_string(),
        file_name: info.file_name,
        sender_name: info.sender_name,
        expiration_date: info.expiration_date.unwrap_or_else(Utc::now),
    }))
}

/// Downloads the file for a public share link. No login required.
pub async fn download_public_share(
    Extension(app_state): Extension<Arc<AppState>>,
    Path(token): Path<String>,
    Json(body): Json<PublicDownloadDto>,
) -> Result<impl IntoResponse, HttpError> {
    body.validate()
        .map_err(|e| HttpError::bad_request(e.to_string()))?;

    let token_uuid = Uuid::parse_str(&token)
        .map_err(|_| HttpError::bad_request("Invalid share token"))?;

    let shared_data = app_state
        .db_client
        .get_shared_by_token(token_uuid)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or_else(|| HttpError::bad_request("Share link not found or has expired"))?;

    if !password::compare(&body.password, &shared_data.password)
        .map_err(|e| HttpError::server_error(e.to_string()))?
    {
        return Err(HttpError::bad_request("Incorrect password"));
    }

    let file_id = shared_data
        .file_id
        .ok_or_else(|| HttpError::bad_request("File ID is missing"))?;

    let file_data = app_state
        .db_client
        .get_file(file_id)
        .await
        .map_err(|e| HttpError::server_error(e.to_string()))?
        .ok_or_else(|| HttpError::bad_request("File not found or has expired"))?;

    // The uploader encrypted with their own public key, so decrypt with their private key.
    let uploader_id = file_data
        .user_id
        .ok_or_else(|| HttpError::server_error("File has no owner"))?;

    let private_key = load_private_key(uploader_id)?;
    let decrypted = decrypt_file(
        file_data.encrypted_aes_key,
        file_data.encrypted_file,
        file_data.iv,
        &private_key,
    )
    .await?;

    build_download_response(decrypted, &file_data.file_name)
}

// ── Helpers ───────────────────────────────────────────────────────────────────

fn load_private_key(user_id: Uuid) -> Result<RsaPrivateKey, HttpError> {
    let path = PathBuf::from("assets/private_keys").join(format!("{user_id}.pem"));
    let pem = fs::read_to_string(&path)
        .map_err(|e| HttpError::server_error(format!("Private key not found: {e}")))?;
    RsaPrivateKey::from_pkcs1_pem(&pem)
        .map_err(|e| HttpError::server_error(format!("Invalid private key: {e}")))
}

fn build_download_response(
    data: Vec<u8>,
    file_name: &str,
) -> Result<Response<Body>, HttpError> {
    Response::builder()
        .status(StatusCode::OK)
        .header(
            "Content-Disposition",
            format!("attachment; filename=\"{file_name}\""),
        )
        .header("Content-Type", "application/octet-stream")
        .body(Body::from(data))
        .map_err(|e| HttpError::server_error(e.to_string()))
}
