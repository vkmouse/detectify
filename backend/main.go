package main

import (
	"detectify/config"
	"detectify/internal/repository"
	"detectify/internal/route"
	"detectify/pkg/log"
)

func main() {
	log.InitLogger()
	repository.InitDbContext()
	ginRoute := route.InitRouter()

	ginRoute.Run(":" + config.HttpPort)
}
