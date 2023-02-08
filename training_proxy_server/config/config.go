package config

import (
	"os"

	_ "github.com/joho/godotenv/autoload"
)

var (
	HttpPort    string
	AllowOrigin string
)

func init() {
	HttpPort = os.Getenv("HTTP_PORT")
	AllowOrigin = os.Getenv("ALLOWED_CORS_ORIGIN")
}
