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
	if userFromDb.ID == 0 {
		response.Response(ctx, errmsg.ERROR_EMAIL_NOT_EXIST)
		return
	}
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
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
		return
	}
	ctx.Header("Set-Cookie", fmt.Sprintf("refresh_token=%s; MaxAge: %d;", refreshToken, config.JwtRefreshTokenLifetime))

	accessToken, err := jwt.GetToken(
		user.Email,
		time.Duration(config.JwtAccessTokenLifetime)*time.Second,
	)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"accessToken": accessToken,
	})
}

func Logout(ctx *gin.Context) {
	ctx.Header("Set-Cookie", fmt.Sprintf("refresh_token=; MaxAge: 0;"))
	response.Response(ctx, errmsg.SUCCESS)
}

func Refresh(ctx *gin.Context) {
	token, err := ctx.Cookie("refresh_token")
	if err != nil || token == "" {
		response.Response(ctx, errmsg.REFRESH_TOKEN_NOT_FOUND)
		ctx.Abort()
		return
	}

	claims, err := jwt.ParseToken(token)
	if err != nil {
		response.Response(ctx, errmsg.REFRESH_TOKEN_INVALID)
		ctx.Abort()
		return
	}

	if !jwt.ValidateExpireTime(claims) {
		response.Response(ctx, errmsg.REFRESH_TOKEN_EXPIRED)
		ctx.Abort()
		return
	}

	accessToken, err := jwt.GetToken(
		claims.Email,
		time.Duration(config.JwtAccessTokenLifetime)*time.Second,
	)
	if err != nil {
		response.Response(ctx, errmsg.ERROR)
		return
	}
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"accessToken": accessToken,
	})
}

func GetUserInfo(ctx *gin.Context) {
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

	data := gin.H{
		"avatarURL": user.AvatarURL,
		"name":      user.Name,
		"email":     user.Email,
	}
	response.ResponseWithData(ctx, errmsg.SUCCESS, data)
}
