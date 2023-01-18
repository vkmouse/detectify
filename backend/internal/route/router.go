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
	engine.POST("user", api.Register)
	engine.PUT("user/auth", api.Login)
	engine.DELETE("user/auth", api.Logout)
	engine.POST("user/auth/refresh", api.Refresh)

	return engine
}
