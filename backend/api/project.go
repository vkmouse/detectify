package api

import (
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"

	"github.com/gin-gonic/gin"
)

func AddProject(ctx *gin.Context) {
	var project model.Project
	err := ctx.BindJSON(&project)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	project.UserID = ctx.GetString("userID")
	err = repository.AddProject(&project)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.Response(ctx, errmsg.SUCCESS)
}

func GetProjects(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	projects, err := repository.QueryProjectsWithCountsByUser(userID)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{"data": projects})
}
