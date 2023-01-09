package api

import (
	"detectify/pkg/r2"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GeneratingPresignedURL(ctx *gin.Context) {
	url := r2.GeneratingPresignedURL("20200524_005.png")
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"presignedURL": url,
		},
	)
}
