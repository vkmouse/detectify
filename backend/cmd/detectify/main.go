package main

import (
	"detectify/internal/route"
	"detectify/pkg/log"
)

func main() {
	log.InitLogger()

	ginRoute := route.InitRouter()

	ginRoute.Run(":8080")
}
