package middleware

import (
	"regexp"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/response"

	"github.com/gin-gonic/gin"
)

func SubdomainMiddleware() func(ctx *gin.Context) {
	return func(ctx *gin.Context) {
		if !validateHost(ctx.Request.Host) {
			response.Response(ctx, errmsg.ERROR_INVALID_INPUT)
			ctx.Abort()
			return
		}

		_, id := parseHost(ctx.Request.Host)
		ctx.Set("Host", "http://"+id)
		ctx.Next()
	}
}

func validateHost(host string) bool {
	domain, subdomain := parseHost(host)

	if subdomain == "" {
		return false
	}

	allowDomains := []string{"localhost"}
	for _, allowDomain := range allowDomains {
		if allowDomain == domain {
			return true
		}
	}
	return false
}

func parseHost(host string) (string, string) {
	re := regexp.MustCompile(`^(?:([^.]+)\.)?(.*)$`)
	matches := re.FindStringSubmatch(host)
	return matches[2], matches[1]
}
