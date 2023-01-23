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

func AddCategory(ctx *gin.Context) {
	userID := ctx.GetString("userID")
	var category model.ProjectCategory
	err := ctx.BindJSON(&category)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	if !repository.VerifyProjectAccess(userID, category.ProjectID) {
		response.Response(ctx, errmsg.ERROR_FORBIDDEN)
		return
	}

	success, err := repository.AddProjectCategory(&category)
	if !success {
		response.Response(ctx, errmsg.ERROR_CATEGORY_EXIST)
		return
	}
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.Response(ctx, errmsg.SUCCESS)
}

func AddProjectImage(ctx *gin.Context) {
	userID := ctx.GetString("userID")

	var req struct {
		ID        string
		ProjectID string
	}
	err := ctx.BindJSON(&req)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}
	if !repository.VerifyProjectAccess(userID, req.ProjectID) {
		response.Response(ctx, errmsg.ERROR_FORBIDDEN)
		return
	}

	image := model.ProjectImage{
		URL:       "https://images.detectify.tw/" + req.ID,
		ProjectID: req.ProjectID,
	}
	success, err := repository.AddProjectImage(&image)
	if !success {
		response.Response(ctx, errmsg.ERROR_IMAGE_EXIST)
		return
	}
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
