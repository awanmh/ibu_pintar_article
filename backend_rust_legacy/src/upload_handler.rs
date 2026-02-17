use axum::{
    extract::{Multipart, State},
    Json,
};
use std::path::Path;
use tokio::fs;
use tokio::io::AsyncWriteExt;
use uuid::Uuid;

use crate::errors::AppError;

pub async fn upload_image(
    mut multipart: Multipart,
) -> Result<Json<serde_json::Value>, AppError> {
    while let Some(field) = multipart.next_field().await.map_err(|e| AppError::BadRequest(e.to_string()))? {
        let file_name = if let Some(name) = field.file_name() {
            name.to_string()
        } else {
            continue;
        };

        let content_type = field.content_type().unwrap_or("").to_string();
        
        // Validate File Type
        if !content_type.starts_with("image/") {
            return Err(AppError::BadRequest("File must be an image".to_string()));
        }

        // Generate unique filename to prevent collisions and directory traversal
        let ext = Path::new(&file_name).extension().and_then(|s| s.to_str()).unwrap_or("jpg");
        let new_filename = format!("{}.{}", Uuid::new_v4(), ext);
        let save_path = Path::new("uploads").join(&new_filename);

        // Create uploads directory if not exists
        if !Path::new("uploads").exists() {
            fs::create_dir("uploads").await.map_err(|e| AppError::InternalServerError(e.into()))?;
        }

        // Stream to file
        let data = field.bytes().await.map_err(|e| AppError::BadRequest(e.to_string()))?;
        
        if data.len() > 2 * 1024 * 1024 { // 2MB Limit
             return Err(AppError::BadRequest("File too large (Max 2MB)".to_string()));
        }

        let mut file = fs::File::create(&save_path).await.map_err(|e| AppError::InternalServerError(e.into()))?;
        file.write_all(&data).await.map_err(|e| AppError::InternalServerError(e.into()))?;

        // Return URL
        let url = format!("/uploads/{}", new_filename);
        return Ok(Json(serde_json::json!({ "url": url })));
    }

    Err(AppError::BadRequest("No file uploaded".to_string()))
}
