# Secure-File-Sharing-Platform — backend

This folder is the **Axum** API for [**Secure-File-Sharing-Platform**](../README.md): auth, encrypted file storage, share links, and a scheduled job to delete expired files.

See the [repository root README](../README.md) for project goals, **what non-IT users should expect**, and the **important security note** on encryption and keys.

## Stack

Rust, Axum, SQLx (PostgreSQL), JWT auth, Argon2, RSA + AES for stored files, Tokio cron, tower / tower-http.

## Setup

From `file-share-backend/`:

```bash
sqlx migrate run
cargo run
```

Environment variables and API table: see root README and the **API overview** section below.

## API overview (prefix `/api`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Register |
| POST | `/auth/login` | No | Login (JWT) |
| GET | `/users/me` | Yes | Current user |
| PUT | `/users/name` | Yes | Update name |
| PUT | `/users/password` | Yes | Change password |
| GET | `/users/search-emails` | Yes | Email search for recipients |
| POST | `/file/upload` | Yes | Multipart upload |
| POST | `/file/retrieve` | Yes | Download (JSON body) |
| GET | `/list/send` | Yes | Sent files (paginated) |
| GET | `/list/receive` | Yes | Inbox (paginated) |
| GET | `/share/:token` | No | Public share metadata |
| POST | `/share/:token/download` | No | Public download (JSON body) |

## License

MIT — see [LICENSE](./LICENSE) if present in this package.
