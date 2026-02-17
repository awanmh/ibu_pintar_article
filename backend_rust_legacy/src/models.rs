use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use chrono::{DateTime, Utc};

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Article {
    pub id: Uuid,
    pub title: String,
    pub slug: String,
    pub content: String,
    pub thumbnail_url: Option<String>,
    pub category: String,
    pub author: String,
    pub views: i32,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateArticleSchema {
    pub title: String,
    pub slug: String,
    pub content: String,
    pub thumbnail_url: Option<String>,
    pub category: String,
    pub author: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UpdateArticleSchema {
    pub title: Option<String>,
    pub content: Option<String>,
    pub thumbnail_url: Option<String>,
    pub category: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Comment {
    pub id: Uuid,
    pub article_id: Uuid,
    pub user_name: String,
    pub content: String,
    pub created_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCommentSchema {
    pub article_id: Uuid,
    pub user_name: String,
    pub content: String,
}
