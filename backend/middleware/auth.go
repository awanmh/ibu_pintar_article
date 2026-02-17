package middleware

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		adminKey := os.Getenv("ADMIN_KEY")
		if adminKey == "" {
			// Fallback if not set, though .env should have it
			adminKey = "secret123"
			log.Println("Warning: ADMIN_KEY not set, using default 'secret123'")
		}

		key := c.GetHeader("X-Admin-Key")
		if key != adminKey {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized access"})
			c.Abort()
			return
		}

		c.Next()
	}
}
