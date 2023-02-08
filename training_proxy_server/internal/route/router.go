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
	engine.Use(middleware.SubdomainMiddleware())

	engine.GET("/server", api.GetServerStatus)
	engine.PUT("/server", api.GetServerStatus)

	engine.POST("/model/train", api.ModelProxy)
	engine.GET("/model/exported", api.ModelProxy)
	engine.GET("/model/ir", api.ModelProxy)
	engine.DELETE("/model", api.ModelProxy)

	return engine
}
