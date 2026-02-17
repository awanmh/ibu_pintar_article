package handlers

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetComments fetches comments for an article
func (h *Handler) GetComments(c *gin.Context) {
    slug := c.Param("slug") // URL is /articles/:slug/comments
    
    // First get Article ID from slug to be safe, or just join?
    // Current DB structure has Comment.ArticleID.
    // We need to find the article first.
    var article models.Article
    if err := h.DB.Where("slug = ?", slug).First(&article).Error; err != nil {
        utils.APIError(c, http.StatusNotFound, "Article not found", "Invalid slug")
        return
    }

    var comments []models.Comment
    
    // Check if user is Admin
    // Using Context from Middleware
    role, exists := c.Get("role")
    isAdmin := exists && role == "admin"

    query := h.DB.Where("article_id = ?", article.ID).Order("created_at desc")

    // If NOT admin, filter only approved comments
    if !isAdmin {
        query = query.Where("is_approved = ?", true)
    }

    if err := query.Find(&comments).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to fetch comments", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusOK, true, "Comments fetched successfully", gin.H{
        "comments": comments,
        "isAdmin": isAdmin, // Helper for frontend to know if it can show moderation tools
    })
}

// AddComment
func (h *Handler) AddComment(c *gin.Context) {
    var input struct {
        ArticleID uint   `json:"articleId"`
        User      string `json:"user"`
        Content   string `json:"content"`
    }

    if err := c.ShouldBindJSON(&input); err != nil {
        utils.APIError(c, http.StatusBadRequest, "Invalid input", err.Error())
        return
    }

    // Determine Role using JWT if available (Optional Auth)
    // We can check if "Authorization" header exists, 
    // BUT this handler might be on a public route without JWTMiddleware enforced.
    // The user instruction said: "Use JWT Context. If c.Get('role') == 'admin'"
    // This implies we should verify token IF present.
    // In main.go, we should apply a "OptionalJWT" middleware or similar?
    // Or just check header manually for this specific case if not protected.
    // For now, let's assume the router will attach middleware that *allows* anon but parses token if present.
    // OR we just leave it as "default user" unless we enforce strict auth for comments.
    // Given the previous instructions, public users can comment.
    
    // However, to get `c.Get("role")`, we MUST run JWTMiddleware.
    // If JWTMiddleware aborts on missing token, we can't use it for optional auth.
    // Solution: We will rely on the "UserRole" logic being "user" for public comments.
    // Admin comments should theoretically use the Admin Panel or be logged in. 
    // If they abuse the public form, they are just "user".
    
    // Migration Note: Existing logic used manual check. New logic:
    // User asked: "Use JWT Context... If c.Get(role) == admin, add is_admin: true".
    // That was for *Response*.
    
    // For *Creation*:
    // Default IsApproved = false (Waiting Moderation).
    // EXCEPT if Admin posts it? 
    // Optimally: If Admin (verified via token), IsApproved = true.
    
    isApproved := false // Default for public
    userRole := "user"

    // If we can trust the user input name "Aisy Alfi (Admin)"? NO, strictly instructed to remove it.
    // We will stick to `isApproved = false` for now mostly.
    
    // If we want to support Admin comments via this endpoint, we need to inspect the token manually here
    // OR use a middleware that doesn't 401 on missing token. 
    // Let's implement a quick token check or just accept false (Safe default).
    
    comment := models.Comment{
        ArticleID: input.ArticleID,
        UserName:  input.User,
        UserRole:  userRole, 
        Content:   input.Content,
        IsApproved: isApproved,
        CreatedAt: time.Now(),
    }

    if err := h.DB.Create(&comment).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to post comment", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusCreated, true, "Comment submitted for moderation", comment)
}

// ApproveComment (Admin Only)
func (h *Handler) ApproveComment(c *gin.Context) {
    id := c.Param("id")
    
    if err := h.DB.Model(&models.Comment{}).Where("id = ?", id).Update("is_approved", true).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to approve comment", err.Error())
        return
    }
    
    utils.APIResponse(c, http.StatusOK, true, "Comment approved", nil)
}

// DeleteComment (Admin Only)
func (h *Handler) DeleteComment(c *gin.Context) {
    id := c.Param("id")
    
    if err := h.DB.Delete(&models.Comment{}, id).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to delete comment", err.Error())
        return
    }
    
    utils.APIResponse(c, http.StatusOK, true, "Comment deleted", nil)
}
