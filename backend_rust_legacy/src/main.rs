mod db;
mod errors;
mod handlers;
mod models;
mod upload_handler;

use axum::{
    routing::{delete, get, post},
    Router,
};
use dotenvy::dotenv;
use std::env;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::services::ServeDir;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

use crate::db::establish_connection;
use crate::db::AppState;
use crate::handlers::{
    create_article, create_comment, delete_article, get_article, get_articles, get_comments,
    health_check,
};
use crate::upload_handler::upload_image;

#[tokio::main]
async fn main() {
    dotenv().ok();

    // Initialize Tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::new(
            env::var("RUST_LOG").unwrap_or_else(|_| "backend=debug,tower_http=debug".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let pool = establish_connection().await;
    let state = AppState { db: pool };

    // CORS: Allow Frontend
    let cors = CorsLayer::new()
        .allow_origin(Any) // For dev simplicity
        .allow_methods(Any)
        .allow_headers(Any);

    // Static File Serving for Uploads
    let serve_dir = ServeDir::new("uploads");

    let app = Router::new()
        .route("/api/health", get(health_check))
        .route("/api/articles", get(get_articles))
        .route("/api/articles/:slug", get(get_article))
        .route("/api/articles/:id/comments", get(get_comments))
        .route("/api/comments", post(create_comment))
        .route("/api/admin/articles", post(create_article))
        .route("/api/admin/articles/:id", delete(delete_article))
        // Image Upload
        .route("/api/upload", post(upload_image))
        // Serve Uploaded Images
        .nest_service("/uploads", serve_dir)
        .layer(cors)
        .with_state(state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
