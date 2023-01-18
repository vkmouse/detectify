package route

import (
	api "detectify/api"
	"detectify/internal/middleware"
	"detectify/pkg/log"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	engine := gin.Default()

	engine.Use(log.GinLogger())
	engine.Use(middleware.CORSMiddleware())

	engine.POST("image/upload", api.GeneratingPresignedURL)
	engine.GET("message", api.QueryAllMessages)
	engine.POST("message", api.AddMessage)
	engine.POST("user", api.Register)
	engine.PUT("user/auth", api.Login)
	engine.POST("user/auth/refresh", api.Refresh)

	return engine
}
