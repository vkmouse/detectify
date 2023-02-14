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

	engine.GET("/server", middleware.CORSMiddleware(), middleware.JwtMiddleware(), api.GetServerStatus)
	engine.PUT("/server", middleware.CORSMiddleware(), middleware.JwtMiddleware(), api.CreateServerSpace)
	engine.DELETE("/server", middleware.CORSMiddleware(), middleware.JwtMiddleware(), api.RemoveServerSpace)
	engine.GET("/server/default", api.GetDefaultServerStatus)

	engine.POST("/model/train", middleware.CORSMiddleware(), middleware.JwtMiddleware(), api.TrainModel)
	engine.POST("/model/completed", api.TrainModelCompleted)

	return engine
}
