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

	engine.POST("user", api.Register)
	engine.GET("user/auth", middleware.JwtMiddleware(), api.GetUserInfo)
	engine.PUT("user/auth", api.Login)
	engine.DELETE("user/auth", api.Logout)
	engine.POST("user/auth/refresh", api.Refresh)
	engine.POST("project", middleware.JwtMiddleware(), api.AddProject)
	engine.GET("project/:projectID", middleware.JwtMiddleware(), api.GetProject)
	engine.DELETE("project/:projectID", middleware.JwtMiddleware(), api.DeleteProject)
	engine.GET("projects", middleware.JwtMiddleware(), api.GetProjects)
	engine.POST("image/upload", middleware.JwtMiddleware(), api.CreateBatchUpload)
	engine.PUT("image/upload", middleware.JwtMiddleware(), api.PublishBatchUpload)
	engine.GET("images", middleware.JwtMiddleware(), api.GetProjectImages)
	engine.DELETE("images", middleware.JwtMiddleware(), api.DeleteProjectImage)

	return engine
}
