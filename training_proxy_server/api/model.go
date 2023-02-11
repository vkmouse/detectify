package api

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/response"

	"github.com/gin-gonic/gin"
)

func ModelProxy(ctx *gin.Context) {
	id := ctx.GetString("userID")
	host := "http://" + id + ".localhost:8080"
	if !validateServerStatus(host) {
		response.Response(ctx, errmsg.ERROR_SERVER_NOT_STARTED)
		return
	}

	reverseProxy(ctx)
}

func validateServerStatus(host string) bool {
	return getStatusFromTrainingServer(host) != SERVER_STOPED
}

func reverseProxy(ctx *gin.Context) {
	id := ctx.GetString("userID")
	host := "http://" + id + ".localhost:8080"
	remote, err := url.Parse(host + ctx.Request.RequestURI)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Director = func(req *http.Request) {
		req.Header = ctx.Request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = remote.RequestURI()
	}

	proxy.ServeHTTP(ctx.Writer, ctx.Request)
}
