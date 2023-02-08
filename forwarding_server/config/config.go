package config

import (
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

var (
	StartPort int
	EndPort   int

	DNSZoneID  string
	DNSEmail   string
	DNSAPIKey  string
	DNSContent string
	DNSName    string
)

func init() {
	StartPort, _ = strconv.Atoi(os.Getenv("START_PORT"))
	EndPort, _ = strconv.Atoi(os.Getenv("END_PORT"))

	DNSZoneID = os.Getenv("DNS_ZONE_ID")
	DNSEmail = os.Getenv("DNS_EMAIL")
	DNSAPIKey = os.Getenv("DNS_API_KEY")
	DNSContent = os.Getenv("DNS_CONTENT")
	DNSName = os.Getenv("DNS_NAME")
}
