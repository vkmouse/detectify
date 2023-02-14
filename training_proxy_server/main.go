package main

import (
	"training-proxy-server/config"
	"training-proxy-server/internal/repository"
	"training-proxy-server/internal/route"
	"training-proxy-server/pkg/log"
)

func main() {
	log.InitLogger()
	repository.InitDbContext()
	ginRoute := route.InitRouter()

	ginRoute.Run(":" + config.HttpPort)
}
