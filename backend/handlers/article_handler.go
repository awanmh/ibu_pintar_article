package handlers

import (
	"backend/models"
	"backend/utils"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/microcosm-cc/bluemonday"
	"gorm.io/gorm"
)

// GetArticles fetches articles with pagination and search
func (h *Handler) GetArticles(c *gin.Context) {
    var articles []models.Article
    var total int64

    // Query Params
    page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
    limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
    search := c.Query("search")
    category := c.Query("category")
    
    offset := (page - 1) * limit

    query := h.DB.Model(&models.Article{})

    if search != "" {
        query = query.Where("title ILIKE ?", "%"+search+"%")
    }
    if category != "" && category != "Semua" {
        query = query.Where("category = ?", category)
    }

    // Count Total (for pagination metadata)
    query.Count(&total)

    // Fetch Data
    if err := query.Order("created_at desc").Limit(limit).Offset(offset).Find(&articles).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to fetch articles", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusOK, true, "Articles fetched successfully", gin.H{
        "articles": articles,
        "total":    total,
        "page":     page,
        "limit":    limit,
        "totalPages": int((total + int64(limit) - 1) / int64(limit)),
    })
}

// GetArticleBySlug fetches a single article
func (h *Handler) GetArticleBySlug(c *gin.Context) {
    slug := c.Param("slug")
    var article models.Article

    if err := h.DB.Where("slug = ?", slug).First(&article).Error; err != nil {
        if err == gorm.ErrRecordNotFound {
            utils.APIError(c, http.StatusNotFound, "Article not found", "Record not found")
        } else {
            utils.APIError(c, http.StatusInternalServerError, "Database error", err.Error())
        }
        return
    }

    // Increment Views
    h.DB.Model(&article).UpdateColumn("views", gorm.Expr("views + ?", 1))

    utils.APIResponse(c, http.StatusOK, true, "Article fetched successfully", article)
}

// CreateArticle (Admin)
func (h *Handler) CreateArticle(c *gin.Context) {
    var input models.Article
    if err := c.ShouldBindJSON(&input); err != nil {
        utils.APIError(c, http.StatusBadRequest, "Invalid input", err.Error())
        return
    }

    // Sanitize HTML Content using Bluemonday
    p := bluemonday.UGCPolicy()
    input.Content = p.Sanitize(input.Content)

    // Generate Slug if empty
    if input.Slug == "" {
        input.Slug = strings.ToLower(strings.ReplaceAll(input.Title, " ", "-"))
    }
    input.CreatedAt = time.Now()

    if err := h.DB.Create(&input).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to create article", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusCreated, true, "Article created successfully", input)
}

// DeleteArticle (Admin)
func (h *Handler) DeleteArticle(c *gin.Context) {
    id := c.Param("id")
    
    if err := h.DB.Delete(&models.Article{}, id).Error; err != nil {
        utils.APIError(c, http.StatusInternalServerError, "Failed to delete article", err.Error())
        return
    }

    utils.APIResponse(c, http.StatusOK, true, "Article deleted successfully", nil)
}
