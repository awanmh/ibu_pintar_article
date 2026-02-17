use axum::{
    extract::{Path, Query, State},
    http::{HeaderMap, StatusCode},
    Json,
};
use serde_json::{json, Value};
use sqlx::{Pool, Postgres};
use uuid::Uuid;

use crate::{
    db::AppState,
    errors::AppError,
    models::{Article, Comment, CreateArticleSchema, CreateCommentSchema},
};

// Health Check
pub async fn health_check() -> &'static str {
    "OK"
}

// GET /api/articles?category=...
pub async fn get_articles(
    State(state): State<AppState>,
    Query(params): Query<Value>,
) -> Result<Json<Vec<Article>>, AppError> {
    let category = params.get("category").and_then(|v| v.as_str());

    let articles = if let Some(cat) = category {
        sqlx::query_as!(
            Article,
            "SELECT * FROM articles WHERE category = $1 ORDER BY created_at DESC",
            cat
        )
        .fetch_all(&state.db)
        .await?
    } else {
        sqlx::query_as!(Article, "SELECT * FROM articles ORDER BY created_at DESC")
            .fetch_all(&state.db)
            .await?
    };

    Ok(Json(articles))
}

// GET /api/articles/:slug Or :id - The prompt implies :slug for fetch
pub async fn get_article(
    State(state): State<AppState>,
    Path(slug): Path<String>,
) -> Result<Json<Article>, AppError> {
    // Increment views
    // distinct query to strict increment
    let _ = sqlx::query!("UPDATE articles SET views = views + 1 WHERE slug = $1", slug)
        .execute(&state.db)
        .await;

    let article = sqlx::query_as!(Article, "SELECT * FROM articles WHERE slug = $1", slug)
        .fetch_optional(&state.db)
        .await?
        .ok_or_else(|| AppError::NotFound("Article not found".to_string()))?;

    Ok(Json(article))
}

// POST /api/admin/articles
pub async fn create_article(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<CreateArticleSchema>,
) -> Result<Json<Article>, AppError> {
    verify_admin_header(&headers)?;

    let article = sqlx::query_as!(
        Article,
        "INSERT INTO articles (title, slug, content, thumbnail_url, category, author) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *",
        payload.title,
        payload.slug,
        payload.content,
        payload.thumbnail_url,
        payload.category,
        payload.author
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(article))
}

// DELETE /api/admin/articles/:id
pub async fn delete_article(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path(id): Path<Uuid>,
) -> Result<StatusCode, AppError> {
    verify_admin_header(&headers)?;

    let result = sqlx::query!("DELETE FROM articles WHERE id = $1", id)
        .execute(&state.db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound("Article not found".to_string()));
    }

    Ok(StatusCode::NO_CONTENT)
}

// GET /api/articles/:id/comments
pub async fn get_comments(
    State(state): State<AppState>,
    Path(article_id): Path<Uuid>,
) -> Result<Json<Vec<Comment>>, AppError> {
    let comments = sqlx::query_as!(
        Comment,
        "SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
        article_id
    )
    .fetch_all(&state.db)
    .await?;

    Ok(Json(comments))
}

// POST /api/comments
pub async fn create_comment(
    State(state): State<AppState>,
    Json(payload): Json<CreateCommentSchema>,
) -> Result<Json<Comment>, AppError> {
    let comment = sqlx::query_as!(
        Comment,
        "INSERT INTO comments (article_id, user_name, content) VALUES ($1, $2, $3) RETURNING *",
        payload.article_id,
        payload.user_name,
        payload.content
    )
    .fetch_one(&state.db)
    .await?;

    Ok(Json(comment))
}

fn verify_admin_header(headers: &HeaderMap) -> Result<(), AppError> {
    match headers.get("x-admin-key") {
        Some(val) if val == "secret123" => Ok(()), // Hardcoded for POC
        _ => Err(AppError::Unauthorized),
    }
}
