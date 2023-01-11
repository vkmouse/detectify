package api

import (
	"detectify/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddMessage(ctx *gin.Context) {
	var requestBody struct {
		Content string
		ImageId string
	}
	ctx.BindJSON(&requestBody)
	content := requestBody.Content
	imageURL := "https://images.detectify.tw/" + requestBody.ImageId
	repository.AddMessage(content, imageURL)
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"ok": true,
		},
	)
}

func QueryAllMessages(ctx *gin.Context) {
	messages, _ := repository.QueryAllMessages()
	ctx.JSON(
		http.StatusOK,
		gin.H{
			"data": messages,
		},
	)
}
