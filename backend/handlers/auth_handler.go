package handlers

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// AuthHandler struct
type AuthHandler struct {
	DB *gorm.DB
}

func NewAuthHandler(db *gorm.DB) *AuthHandler {
	return &AuthHandler{DB: db}
}

// Register
func (h *AuthHandler) Register(c *gin.Context) {
	var input struct {
		Name     string `json:"name"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required,min=6"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.APIError(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	// 1. Validate Email Domain & Assign Role
	var role string
	if strings.HasSuffix(input.Email, "@ibupintar.admin.com") {
		role = "admin"
	} else if strings.HasSuffix(input.Email, "@ibupintar.com") {
		role = "user"
	} else {
		utils.APIError(c, http.StatusBadRequest, "Invalid email domain", "Allowed: @ibupintar.com (User) or @ibupintar.admin.com (Admin)")
		return
	}

	// 1b. Validate Password Strength
    // Min 8 chars, 1 uppercase, 1 number, 1 symbol
    if len(input.Password) < 8 {
        utils.APIError(c, http.StatusBadRequest, "Password too short", "Min 8 characters")
        return
    }
    hasUpper := false
    hasNumber := false
    hasSymbol := false
    for _, char := range input.Password {
        switch {
        case 'A' <= char && char <= 'Z':
            hasUpper = true
        case '0' <= char && char <= '9':
            hasNumber = true
        case strings.ContainsRune("!@#$%^&*()_+-=[]{}|;:,.<>?/~`", char):
            hasSymbol = true
        }
    }
    if !hasUpper || !hasNumber || !hasSymbol {
        utils.APIError(c, http.StatusBadRequest, "Weak password", "Must contain at least one uppercase letter, one number, and one symbol")
        return
    }

	// 2. Hash Password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.APIError(c, http.StatusInternalServerError, "Failed to hash password", err.Error())
		return
	}

	// 3. Create User
	user := models.User{
		Name:     input.Name,
		Email:    input.Email,
		Password: string(hashedPassword),
		Role:     role,
	}

	if err := h.DB.Create(&user).Error; err != nil {
		utils.APIError(c, http.StatusBadRequest, "Email already registered", err.Error())
		return
	}

	utils.APIResponse(c, http.StatusCreated, true, "Registration successful", gin.H{"role": role})
}

// Login
func (h *AuthHandler) Login(c *gin.Context) {
	var input struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.APIError(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	var user models.User
	if err := h.DB.Where("email = ?", input.Email).First(&user).Error; err != nil {
		utils.APIError(c, http.StatusUnauthorized, "Invalid credentials", "User not found")
		return
	}

	// Check Password
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		utils.APIError(c, http.StatusUnauthorized, "Invalid credentials", "Incorrect password")
		return
	}

	// Generate JWT
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "secret"
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  user.ID,
		"role": user.Role,
		"exp":  time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		utils.APIError(c, http.StatusInternalServerError, "Failed to generate token", err.Error())
		return
	}

	utils.APIResponse(c, http.StatusOK, true, "Login successful", gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
