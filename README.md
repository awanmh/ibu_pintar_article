# Ibu Pintar Blog - High Performance Midwifery Portal

A production-ready full-stack application designed for high performance and reliability, featuring a **Go (Golang)** backend and a modern **React** frontend.

## 🚀 Tech Stack

### Frontend

- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Typography Plugin
- **State Management:** Zustand
- **Editor:** React Quill
- **Icons:** Lucide React
- **HTTP Client:** Native Fetch (Custom Wrapper)

### Backend

- **Language:** Go (Golang)
- **Framework:** Gin (High-performance web framework)
- **Database Logic:** GORM (ORM for Golang)
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Tokens)
- **File Storage:** Cloudinary (with local fallback)
- **Security:** Bluemonday (HTML Sanitization), BCrypt (Password Hashing)

---

## ✨ Features

### Public User

- **Browse Articles:** View articles by category (Kehamilan, Persalinan, etc.) with pagination.
- **Read Articles:** Fast loading article detail pages with formatted content.
- **Search:** Find articles by title or content.
- **Comments:** Post comments on articles (requires admin approval if configured).

### Admin (Midwife) & User Profile

- **Secure Access:** JWT-based authentication.
- **Dashboard:** Overview of content.
- **Manage Articles:** Create, Edit, and Delete articles.
- **Comment Moderation:** Approve or delete user comments.
- **Rich Text Editor:** Write content with headings, lists, and formatting.
- **Image Upload:** Integrated with Cloudinary for scalable hosting.
- **Profile Management:** Update name and password.

---

## 🛠️ Setup Guide

### Prerequisites

- Node.js (v18+)
- Go (v1.20+)
- PostgreSQL Server
- Cloudinary Account (Optional, for production image hosting)

### 1. Database Setup

Ensure your PostgreSQL server is running. The application will automatically migrate schema on startup.

```bash
# Create database
createdb blog_db
```

### 2. Backend Setup

```bash
cd backend

# Create .env
# Copy the example or set your own variables
echo "DATABASE_URL=host=localhost user=postgres password=password dbname=blog_db port=5432 sslmode=disable" > .env
echo "PORT=8080" >> .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "ALLOWED_ORIGINS=http://localhost:5173" >> .env
# Optional: Cloudinary
# echo "CLOUDINARY_CLOUD_NAME=..." >> .env
# echo "CLOUDINARY_API_KEY=..." >> .env
# echo "CLOUDINARY_API_SECRET=..." >> .env

# Run Server
go run main.go
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

## 🚀 Deployment

### Backend (Hugging Face Spaces)

- **Space SDK**: Docker (Blank)
- **Port**: 7860
- **Env Vars**: `DATABASE_URL` (Supabase Transaction Mode), `JWT_SECRET`, `ALLOWED_ORIGINS`

### Frontend (Netlify)

- Build Command: `npm run build`
- Publish Directory: `dist`
- Env Vars: `VITE_API_URL` (Your Render URL)
