package config

import (
	"os"

	_ "github.com/joho/godotenv/autoload"
)

var (
	Mode        string
	HttpPort    string
	AllowOrigin string

	R2BucketName      string
	R2AccountId       string
	R2AccessKeyId     string
	R2AccessKeySecret string
)

func init() {
	Mode = os.Getenv("MODE")
	HttpPort = os.Getenv("HTTP_PORT")
	AllowOrigin = os.Getenv("ALLOWED_CORS_ORIGIN")

	R2BucketName = os.Getenv("R2_BUCKET_NAME")
	R2AccountId = os.Getenv("R2_ACCOUNT_ID")
	R2AccessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
	R2AccessKeySecret = os.Getenv("R2_ACCESS_KEY_SECRET")
}
