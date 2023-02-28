package api

import (
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"
	"detectify/pkg/r2"

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

func GetProject(ctx *gin.Context) {
	projectID := ctx.Param("projectID")
	userID := ctx.GetString("userID")

	project, err := repository.QueryProject(userID, projectID)

	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{"data": gin.H{
		"projectId":     project.ID,
		"projectName":   project.Name,
		"irModel":       project.ModelURL + "/ir_model.zip",
		"exportedModel": project.ModelURL + "/exported_model.zip",
		"webModel":      project.ModelURL + "/web_model",
	}})
}

func DeleteProject(ctx *gin.Context) {
	projectID := ctx.Param("projectID")
	userID := ctx.GetString("userID")

	images, err := repository.QueryProjectImagesByProjectID(projectID)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	for _, image := range images {
		if image.ImagePublished {
			err = r2.DeleteItem(getImagePath(projectID, image.ID, image.ImageExt))
			if err != nil {
				response.Response(ctx, errmsg.ERROR)
				return
			}
		}

		if image.AnnotationPublished {
			err = r2.DeleteItem(getAnnotationPath(projectID, image.ID, image.AnnotationExt))
			if err != nil {
				response.Response(ctx, errmsg.ERROR)
				return
			}
		}
	}

	err = repository.DeleteProjectImages(projectID)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	err = repository.DeleteProject(userID, projectID)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.Response(ctx, errmsg.SUCCESS)
	return
}
