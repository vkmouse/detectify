package api

import (
	"detectify/pkg/r2"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GeneratingPresignedURL(ctx *gin.Context) {
	var requestBody struct{ Filename string }
	ctx.BindJSON(&requestBody)
	url := r2.GeneratingPresignedURL(requestBody.Filename)
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"presignedURL": url,
		},
	)
}
