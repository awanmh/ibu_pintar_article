package handlers

import (
	"backend/services"
	"backend/utils"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
)

// UploadFile handles image uploads
func UploadFile(c *gin.Context) {
	// Single file
	file, err := c.FormFile("file")
	if err != nil {
		utils.APIError(c, http.StatusBadRequest, "No file uploaded", err.Error())
		return
	}

	// Validate File Extension (Basic)
	ext := filepath.Ext(file.Filename)
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" {
		utils.APIError(c, http.StatusBadRequest, "Invalid file type", "Only jpg, jpeg, and png are allowed")
		return
	}

	// Create unique filename
	filename := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)

	// Construct local path for backup
	localFilePath := filepath.Join("uploads", filename)
	if err := c.SaveUploadedFile(file, localFilePath); err != nil {
		utils.APIError(c, http.StatusInternalServerError, "Failed to save file locally", err.Error())
		return
	}

	var finalURL string

	// Try Cloudinary if configured
	if os.Getenv("CLOUDINARY_API_SECRET") != "" {
		svc, err := services.NewCloudinaryService()
		if err == nil {
			f, err := os.Open(localFilePath)
			if err == nil {
				defer f.Close()
				url, err := svc.UploadFile(f, filename)
				if err == nil {
					finalURL = url
					os.Remove(localFilePath) // Cleanup
				} else {
					fmt.Printf("Cloudinary Upload Failed: %v\n", err)
				}
			}
		} else {
			fmt.Printf("Cloudinary Init Failed: %v\n", err)
		}
	}

	// Fallback to Local URL
	if finalURL == "" {
		serverHost := os.Getenv("SERVER_HOST")
		if serverHost == "" {
			serverHost = "http://localhost:8080"
		}
		finalURL = fmt.Sprintf("%s/uploads/%s", serverHost, filename)
	}

	utils.APIResponse(c, http.StatusOK, true, "File uploaded successfully", gin.H{"url": finalURL})
}
