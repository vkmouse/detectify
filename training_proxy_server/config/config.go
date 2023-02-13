package config

import (
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

var (
	HttpPort    string
	AllowOrigin string

	StartPort int
	EndPort   int

	R2BucketName      string
	R2AccountId       string
	R2AccessKeyId     string
	R2AccessKeySecret string
	R2AccessURL       string

	JwtSecretKey []byte
)

func init() {
	HttpPort = os.Getenv("HTTP_PORT")
	AllowOrigin = os.Getenv("ALLOWED_CORS_ORIGIN")

	StartPort, _ = strconv.Atoi(os.Getenv("START_PORT"))
	EndPort, _ = strconv.Atoi(os.Getenv("END_PORT"))

	R2BucketName = os.Getenv("R2_BUCKET_NAME")
	R2AccountId = os.Getenv("R2_ACCOUNT_ID")
	R2AccessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
	R2AccessKeySecret = os.Getenv("R2_ACCESS_KEY_SECRET")
	R2AccessURL = os.Getenv("R2_ACCESS_URL")

	JwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))
}
