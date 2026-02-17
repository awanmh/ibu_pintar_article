use sqlx::{postgres::PgPoolOptions, Pool, Postgres};
use std::env;

#[derive(Clone)]
pub struct AppState {
    pub db: Pool<Postgres>,
}

pub async fn establish_connection() -> Pool<Postgres> {
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must is set");
    
    PgPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to connect to Postgres")
}
