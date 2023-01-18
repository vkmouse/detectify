package middleware

import (
	"detectify/internal/errmsg"
	"detectify/internal/response"
	"detectify/pkg/jwt"
	"strings"

	"github.com/gin-gonic/gin"
)

func JwtMiddleware() func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		authHeader := ctx.Request.Header.Get("Authorization")
		if authHeader == "" {
			response.Response(ctx, errmsg.ACCESS_TOKEN_NOT_FOUND)
			ctx.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if !(len(parts) == 2 && parts[0] == "Bearer") {
			response.Response(ctx, errmsg.ACCESS_TOKEN_FORMAT_ERROR)
			ctx.Abort()
			return
		}

		claims, err := jwt.ParseToken(parts[1])
		if err != nil {
			response.Response(ctx, errmsg.ACCESS_TOKEN_INVALID)
			ctx.Abort()
			return
		}

		if !jwt.ValidateExpireTime(claims) {
			response.Response(ctx, errmsg.ACCESS_TOKEN_EXPIRED)
			ctx.Abort()
			return
		}

		ctx.Set("email", claims.Email)
		ctx.Next()
	}
}
