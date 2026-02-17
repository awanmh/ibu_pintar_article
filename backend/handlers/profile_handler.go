package handlers

import (
	"backend/models"
	"backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// UpdateProfile allows users to update their name or password
func (h *Handler) UpdateProfile(c *gin.Context) {
    // Get User ID from Context (set by JWTMiddleware)
    userID, exists := c.Get("userID")
    if !exists {
        utils.APIError(c, http.StatusUnauthorized, "Unauthorized", "User ID not found in context")
        return
    }

    var input struct {
        Name     string `json:"name"`
        Password string `json:"password"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        utils.APIError(c, http.StatusBadRequest, "Invalid input", err.Error())
        return
    }

    var user models.User
    if err := h.DB.First(&user, userID).Error; err != nil {
        utils.APIError(c, http.StatusNotFound, "User not found", err.Error())
        return
    }

    // Update Fields
    if input.Name != "" {
        user.Name = input.Name
    }
    
    if input.Password != "" {
        // Enforce strong password if needed (reuse logic or assume frontend validated)
        if len(input.Password) < 8 {
             utils.APIError(c, http.StatusBadRequest, "Password too short", "Min 8 characters")
             return
        }
        hashed, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
        user.Password = string(hashed)
    }

    if err := h.DB.Save(&user).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to update profile", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusOK, true, "Profile updated successfully", gin.H{
        "id": user.ID,
        "name": user.Name,
        "email": user.Email,
        "role": user.Role,
    })
}
