package api

import (
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"
	"detectify/internal/validator"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func RegisterUser(ctx *gin.Context) {
	var user model.User
	ctx.BindJSON(&user)

	if !validator.CheckName(user.Name) ||
		!validator.CheckEmail(user.Email) ||
		!validator.CheckPassword(user.Password) {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	isExist := repository.CheckUserEmail(user.Email)
	if isExist {
		response.Response(ctx, errmsg.ERROR_ACCOUNT_EXIST)
		return
	}

	hash, err := hashPassword(user.Password)
	if err != nil || hash == "" {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	user.Password = hash
	repository.AddUser(&user)
	response.Response(ctx, errmsg.SUCCESS)
}
