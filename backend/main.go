package main

import (
	"log"
	"os"
	"strings"
	"time"

	"backend/handlers"
	"backend/middleware"
	"backend/models"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	// 1. Load Env
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env variables")
	}

	// 2. Database Connection
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL must be set")
	}

	// Fix for Supabase Transaction Pooler (SQLSTATE 42P05)
	db, err := gorm.Open(postgres.New(postgres.Config{
		DSN:                  dsn,
		PreferSimpleProtocol: true, // Disables implicit prepared statements
	}), &gorm.Config{
		PrepareStmt: false, // Disables prepared statement caching
	})
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// 3. Auto Migration
	log.Println("Running Auto-Migration...")
	db.AutoMigrate(&models.User{}, &models.Article{}, &models.Comment{})

	// Seed Admin User
	var adminCount int64
	db.Model(&models.User{}).Where("email = ?", "aisyalfi@ibupintar.admin.com").Count(&adminCount)
	if adminCount == 0 {
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte("@M4L4NG_240498"), bcrypt.DefaultCost)
		admin := models.User{
			Name:     "Aisy Alfi (Admin)",
			Email:    "aisyalfi@ibupintar.admin.com",
			Password: string(hashedPassword),
			Role:     "admin",
		}
		if err := db.Create(&admin).Error; err != nil {
			log.Printf("Failed to seed admin: %v", err)
		} else {
			log.Println("Admin user seeded: aisyalfi@ibupintar.admin.com")
		}
	}

	// 4. Ensure Uploads Directory
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		log.Println("Creating uploads directory...")
		if err := os.MkdirAll("uploads", 0755); err != nil {
			log.Fatal("Failed to create uploads directory:", err)
		}
	}

	// 5. Setup Router
	r := gin.Default()

	// 6. CORS Configuration
    allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
    if allowedOrigins == "" {
        allowedOrigins = "http://localhost:5173" // Default Vite port
    }
    
	r.Use(cors.New(cors.Config{
		AllowOrigins:     strings.Split(allowedOrigins, ","),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "X-Admin-Key", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// 7. Static File Serving
	r.Static("/uploads", "./uploads")

	// 8. Handlers
	h := handlers.NewHandler(db)
	authHandler := handlers.NewAuthHandler(db)

    // Root Route (Health Check for Root)
    r.GET("/", func(c *gin.Context) {
        c.JSON(200, gin.H{"message": "API is Running", "status": "ok"})
    })

	// 9. Routes
	api := r.Group("/api")
	{
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})

		// Auth Routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}

		// Public Routes (Articles)
		api.GET("/articles", h.GetArticles)
		api.GET("/articles/:slug", h.GetArticleBySlug)
		
        // Comments (Public + Optional Auth logic handled in handler)
		api.POST("/comments", h.AddComment) // TODO: Add Rate Limit Middleware here
		api.GET("/articles/:slug/comments", h.GetComments)

		// Protected Admin Routes
		admin := api.Group("/admin")
		admin.Use(middleware.JWTMiddleware(), middleware.AdminMiddleware())
		{
			admin.POST("/articles", h.CreateArticle)
			admin.DELETE("/articles/:id", h.DeleteArticle)
            
            // Comment Moderation
            admin.PATCH("/comments/:id/approve", h.ApproveComment)
            admin.DELETE("/comments/:id", h.DeleteComment)
		}

        // Protected User Routes (Profile)
        user := api.Group("/profile")
        user.Use(middleware.JWTMiddleware()) 
        {
            user.PUT("/", h.UpdateProfile)
        }

		// Upload Route (Protected)
		api.POST("/upload", middleware.JWTMiddleware(), middleware.AdminMiddleware(), handlers.UploadFile)
	}

	// 10. Run Server
	log.Println("Server running on port 7860")
	if err := r.Run("0.0.0.0:7860"); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
