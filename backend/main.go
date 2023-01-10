package main

import (
	"detectify/config"
	"detectify/internal/route"
	"detectify/pkg/log"
)

func main() {
	log.InitLogger()

	ginRoute := route.InitRouter()

	ginRoute.Run(":" + config.HttpPort)
}
