package models

import (
	"time"

	"gorm.io/gorm"
)

type Article struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	Title        string    `json:"title"`
	Slug         string    `gorm:"uniqueIndex" json:"slug"`
	Content      string    `json:"content"`
	ThumbnailURL string    `json:"thumbnail"` // Matches JSON from frontend: "thumbnail"
	Category     string    `json:"category"`
	Author       string    `json:"author"`
	Views        int       `json:"views"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `gorm:"index" json:"-"`
}

type Comment struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ArticleID uint      `json:"articleId"`
	UserName  string    `json:"user"`
	UserRole  string    `json:"userRole"` // "admin" or "user"
	Content   string    `json:"content"`
	IsApproved bool     `json:"isApproved" gorm:"default:true"` // Migration: Default to true for existing. New logic will set to false.
	CreatedAt time.Time `json:"createdAt"`
}

type User struct {
	ID       uint   `gorm:"primaryKey" json:"id"`
	Name     string `json:"name"`
	Email    string `gorm:"uniqueIndex" json:"email"`
	Password string `json:"-"` // Don't return password in JSON
	Role     string `json:"role"` // "admin" or "user"
}
