package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"training-proxy-server/config"
	"training-proxy-server/internal/dns"
	"training-proxy-server/internal/docker"
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

var nextPort int

func init() {
	nextPort = config.StartPort
}

func GetServerStatus(ctx *gin.Context) {
	host := ctx.GetString("Host")
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"status": getServerStatus(host),
		},
	})
}

func CreateServerSpace(ctx *gin.Context) {
	id := ctx.GetString("ID")
	port := nextPort
	nextPort += 1

	err := docker.RunOpenSSH(id, port)
	if err != nil {
		log.Fatal(err, ": run open ssh failed")
	}

	names, err := dns.ListDNSRecord()
	if err != nil {
		log.Fatal(err, ": list dns failed")
	}

	url := fmt.Sprintf("%s.%s", id, config.DNSName)
	found := false
	for _, name := range names {
		if name == url {
			found = true
		}
	}
	if !found {
		err = dns.CreateDNSRecord(id)
		if err != nil {
			log.Fatal(err, ": create dns failed")
		}
	}

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"id":   id,
			"port": port,
			"ssh":  fmt.Sprintf("ssh -o ServerAliveInterval=20 -o TCPKeepAlive=no -R 0.0.0.0:80:localhost:5000 %s@%s -p %d", id, config.DNSContent, port),
			"url":  url,
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
