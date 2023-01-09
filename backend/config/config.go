package config

import (
	"os"

	_ "github.com/joho/godotenv/autoload"
)

var (
	R2BucketName      string
	R2AccountId       string
	R2AccessKeyId     string
	R2AccessKeySecret string
)

func init() {
	R2BucketName = os.Getenv("R2_BUCKET_NAME")
	R2AccountId = os.Getenv("R2_ACCOUNT_ID")
	R2AccessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
	R2AccessKeySecret = os.Getenv("R2_ACCESS_KEY_SECRET")
}
