package route

import (
	"training-proxy-server/api"
	"training-proxy-server/internal/middleware"
	"training-proxy-server/pkg/log"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	engine := gin.Default()

	engine.Use(log.GinLogger())
	engine.Use(middleware.CORSMiddleware())

	engine.GET("/server", middleware.JwtMiddleware(), api.GetServerStatus)
	engine.PUT("/server", middleware.JwtMiddleware(), api.CreateServerSpace)
	engine.DELETE("/server", middleware.JwtMiddleware(), api.RemoveServerSpace)
	engine.GET("/server/default", api.GetDefaultServerStatus)

	engine.POST("/model/train", middleware.JwtMiddleware(), api.ModelProxy)
	engine.GET("/model/exported", middleware.JwtMiddleware(), api.ModelProxy)
	engine.GET("/model/ir", middleware.JwtMiddleware(), api.ModelProxy)
	engine.DELETE("/model", middleware.JwtMiddleware(), api.ModelProxy)

	return engine
}
