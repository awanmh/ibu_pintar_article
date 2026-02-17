# Ibu Pintar Blog - High Performance Midwifery Portal

A production-ready full-stack application designed for high performance and reliability, featuring a Rust backend and a modern React frontend.

## 🚀 Tech Stack

### Frontend

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Typography Plugin
- **State Management:** Zustand
- **Editor:** React Quill
- **Icons:** Lucide React

### Backend

- **Language:** Rust (2021 Edition)
- **Framework:** Axum (High-performance web framework)
- **Database Logic:** SQLx (Async, Compile-time checking)
- **Runtime:** Tokio
- **Serialization:** Serde
- **Logging:** Tracing

### Database

- **System:** PostgreSQL
- **Migrations:** SQLx Migrations

---

## ✨ Features

### Public User

- **Browse Articles:** View articles by category (Kehamilan, Persalinan, etc.).
- **Read Articles:** Fast loading article detail pages with formatted content.
- **Comments:** View comments on articles.
- **Search:** Filter articles by category.

### Admin (Midwife)

- **Secure Access:** Header-based key authentication (`x-admin-key`).
- **Dashboard:** Overview of content.
- **Manage Articles:** Create and Delete articles.
- **Rich Text Editor:** Write content with headings, lists, and formatting.
- **Image Upload:** Upload thumbnails directly to the server.

---

## 🛠️ Setup Guide

### prerequisites

- Node.js (v18+)
- Rust (Cargo)
- PostgreSQL Server

### 1. Database Setup

Ensure your PostgreSQL server is running.

```bash
# Create database
createdb blog_db

# Run migrations (or execute contents of backend/init.sql)
psql -d blog_db -f backend/init.sql
```

### 2. Backend Setup

```bash
cd backend

# Create .env
echo "DATABASE_URL=postgres://user:password@localhost/blog_db" > .env
echo "RUST_LOG=backend=debug,tower_http=debug" >> .env

# Run Server
cargo run
```

_Server will start on `http://localhost:8080`_

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Create .env
echo "VITE_API_URL=http://localhost:8080/api" > .env

# Run Development Server
npm run dev
```

_App will be accessible at `http://localhost:5173`_

---

## ⚠️ System Limitations & Future Improvements

While this application represents a significant upgrade from a prototype, several areas require attention for an "Enterprise Class" deployment:

1.  **Authentication:** Currently uses a hardcoded API key (`secret123`). Real-world apps must implement JWT or Session-based auth with Role-Based Access Control (RBAC).
2.  **Image Hosting:** Images are stored on the local filesystem of the API server. This is not scalable (stateless). Production apps should use AWS S3 or Cloudinary.
3.  **Security:**
    - **CORS:** Is currently set to allow ALL (`*`). Must restrict to specific frontend domains.
    - **Rate Limiting:** No protection against DDoS or abuse. Axum `tower-governor` should be implemented.
    - **Input Sanitation:** While SQLx prevents injection, rich text HTML content needs sanitization (e.g., `ammonia` crate) to prevent XSS.
4.  **Pagination:** APIs return ALL records. This will choke performance with thousands of articles. Pagination (Offset/Cursor) is mandatory.
5.  **Error Reporting:** Logs go to stdout. Production needs structured logging sent to Datadog/Sentry.
