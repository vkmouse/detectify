package middleware

import (
	"log"
	"strings"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/response"
	"training-proxy-server/pkg/jwt"

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

		if claims.Valid() != nil {
			response.Response(ctx, errmsg.ACCESS_TOKEN_EXPIRED)
			ctx.Abort()
			return
		}

		log.Println("userID = " + claims.Subject)
		ctx.Set("userID", claims.Subject)
		ctx.Next()
	}
}
