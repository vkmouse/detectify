package api

import (
	"detectify/config"
	"detectify/internal/errmsg"
	"detectify/internal/model"
	"detectify/internal/repository"
	"detectify/internal/response"
	"detectify/internal/validator"
	"detectify/pkg/jwt"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) error {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
}

func Register(ctx *gin.Context) {
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
		response.Response(ctx, errmsg.ERROR_EMAIL_EXIST)
		return
	}

	hash, err := hashPassword(user.Password)
	if err != nil || hash == "" {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	user.Password = hash
	err = repository.AddUser(&user)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}

	response.Response(ctx, errmsg.SUCCESS)
}

func Login(ctx *gin.Context) {
	var user model.User
	ctx.BindJSON(&user)

	if !validator.CheckEmail(user.Email) ||
		!validator.CheckPassword(user.Password) {
		response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
		return
	}

	userFromDb, err := repository.QueryUserByEmail(user.Email)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_EMAIL_NOT_EXIST)
		return
	}

	err = checkPasswordHash(user.Password, userFromDb.Password)
	if err != nil {
		response.Response(ctx, errmsg.ERROR_PASSWORD_ERROR)
		return
	}

	refreshToken, err := jwt.GetToken(
		user.Email,
		time.Duration(config.JwtRefreshTokenLifetime)*time.Second,
	)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
	}

	accessToken, err := jwt.GetToken(
		user.Email,
		time.Duration(config.JwtAccessTokenLifetime)*time.Second,
	)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
	}

	ctx.Header("Set-Cookie", fmt.Sprintf("refresh_token=%s; MaxAge: %d;", refreshToken, config.JwtRefreshTokenLifetime))
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"access_token": accessToken,
	})
}
