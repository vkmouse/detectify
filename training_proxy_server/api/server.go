package api

import (
	"encoding/json"
	"net/http"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/response"

	"github.com/gin-gonic/gin"
)

const (
	SERVER_IDLE      string = "Idle"
	SERVER_TRAINING  string = "Training"
	SERVER_COMPLETED string = "Completed"
	SERVER_STOPED    string = "Stopped"
)

func GetServerStatus(ctx *gin.Context) {
	host := ctx.GetString("Host")
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"status": getServerStatus(host),
		},
	})
}

func getServerStatus(host string) string {
	res, err := http.Get(host + "/server")
	if err != nil {
		return SERVER_STOPED
	}
	defer res.Body.Close()

	var data struct {
		Data struct {
			Status string `json:"status"`
		} `json:"data"`
	}
	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		return SERVER_STOPED

	}
	return data.Data.Status
}
