package api

import (
	"detectify/pkg/r2"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func GeneratingPresignedURL(ctx *gin.Context) {
	id := uuid.New().String()
	url := r2.GeneratingPresignedURL(id)
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"data": gin.H{
				"id":           id,
				"presignedURL": url,
			},
		},
	)
}
