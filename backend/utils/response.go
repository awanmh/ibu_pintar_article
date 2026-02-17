package utils

import "github.com/gin-gonic/gin"

type Response struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
	Data    interface{} `json:"data,omitempty"`
	Error   string `json:"error,omitempty"`
}

func APIResponse(c *gin.Context, statusCode int, success bool, message string, data interface{}) {
	c.JSON(statusCode, Response{
		Success: success,
		Message: message,
		Data:    data,
	})
}

func APIError(c *gin.Context, statusCode int, message string, err string) {
	c.JSON(statusCode, Response{
		Success: false,
		Message: message,
		Error:   err,
	})
}
