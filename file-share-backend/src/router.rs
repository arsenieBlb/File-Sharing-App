use std::sync::Arc;

use axum::{middleware, Extension, Router};
use tower_http::trace::TraceLayer;

use crate::{
    handler::{
        auth::auth_handler,
        file::{file_handle, public_share_handle},
        file_query::get_file_list_handler,
        user::users_handler,
    },
    middleware::auth,
    AppState,
};

pub fn create_router(app_state: Arc<AppState>) -> Router {
    let api_route = Router::new()
        // Public: no auth required
        .nest("/auth", auth_handler())
        .merge(public_share_handle())
        // Protected: JWT required
        .nest("/users", users_handler().layer(middleware::from_fn(auth)))
        .nest("/file", file_handle().layer(middleware::from_fn(auth)))
        .nest("/list", get_file_list_handler().layer(middleware::from_fn(auth)))
        .layer(TraceLayer::new_for_http())
        .layer(Extension(app_state));

    Router::new().nest("/api", api_route)
}