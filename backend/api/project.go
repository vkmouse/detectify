package api

import (
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"

	"github.com/gin-gonic/gin"
)

func AddProject(ctx *gin.Context) {
	email := ctx.GetString("email")

	user, err := repository.QueryUserByEmail(email)
	if user.ID == 0 {
		response.Response(ctx, errmsg.ERROR_USER_NOT_EXIST)
		return
	}
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	var project model.Project
	err = ctx.BindJSON(&project)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
	}

	project.UserID = user.ID
	err = repository.AddProject(&project)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
	}

	response.Response(ctx, errmsg.SUCCESS)
}
