package config

import (
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

var (
	Mode        string
	HttpPort    string
	AllowOrigin string

	DbMode        string
	MySQLHost     string
	MySQLPort     string
	MySQLUser     string
	MySQLPassword string
	MySQLName     string
	SQLiteName    string

	R2BucketName      string
	R2AccountId       string
	R2AccessKeyId     string
	R2AccessKeySecret string

	JwtIssuer               string
	JwtSecretKey            []byte
	JwtAccessTokenLifetime  int
	JwtRefreshTokenLifetime int
)

func init() {
	Mode = os.Getenv("MODE")
	HttpPort = os.Getenv("HTTP_PORT")
	AllowOrigin = os.Getenv("ALLOWED_CORS_ORIGIN")

	DbMode = os.Getenv("DB_MODE")
	MySQLHost = os.Getenv("MYSQL_HOST")
	MySQLPort = os.Getenv("MYSQL_PORT")
	MySQLUser = os.Getenv("MYSQL_USER")
	MySQLPassword = os.Getenv("MYSQL_PASSWORD")
	MySQLName = os.Getenv("MYSQL_NAME")
	SQLiteName = os.Getenv("SQLITE_NAME")

	R2BucketName = os.Getenv("R2_BUCKET_NAME")
	R2AccountId = os.Getenv("R2_ACCOUNT_ID")
	R2AccessKeyId = os.Getenv("R2_ACCESS_KEY_ID")
	R2AccessKeySecret = os.Getenv("R2_ACCESS_KEY_SECRET")

	JwtIssuer = os.Getenv("JWT_ISSUER")
	JwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))
	JwtAccessTokenLifetime, _ = strconv.Atoi(os.Getenv("JWT_ACCESS_TOKEN_LIFETIME"))
	JwtRefreshTokenLifetime, _ = strconv.Atoi(os.Getenv("JWT_REFRESH_TOKEN_LIFETIME"))
}
