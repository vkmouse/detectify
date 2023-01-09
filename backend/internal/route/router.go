package route

import (
	api "detectify/api"
	"detectify/pkg/log"

	"github.com/gin-gonic/gin"
)

func InitRouter() *gin.Engine {
	engine := gin.Default()

	engine.Use(log.GinLogger())
	engine.POST("images/uploads", api.GeneratingPresignedURL)

	return engine
}
