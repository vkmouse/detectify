package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
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
	SERVER_PENDING   string = "Pending"
)

var userIdByPort map[int]string

func init() {
	userIdByPort = make(map[int]string, 0)
}

func GetServerStatus(ctx *gin.Context) {
	id := ctx.GetString("ID")
	if !isSpaceExists(id) {
		response.Response(ctx, errmsg.ERROR_SERVER_SPACE_NOT_CREATED)
		return
	}

	if !isDomainAlive(id) {
		response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
			"data": gin.H{
				"status": SERVER_PENDING,
			},
		})
		return
	}

	host := ctx.GetString("Host")
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"status": getStatusFromTrainingServer(host),
		},
	})
}

func CreateServerSpace(ctx *gin.Context) {
	id := ctx.GetString("ID")
	if !isSpaceExists(id) {
		createSpace(id)
	}
	port, _ := getPort(id)
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"id":   id,
			"port": port,
			"ssh":  fmt.Sprintf("ssh -o ServerAliveInterval=20 -o TCPKeepAlive=no -R 0.0.0.0:80:localhost:5000 %s@%s -p %d", id, config.DNSContent, port),
		},
	})
}

func DeleteServerSpace(ctx *gin.Context) {
	id := ctx.GetString("ID")
	if isSpaceExists(id) {
		deleteSpace(id)
	}
	response.Response(ctx, errmsg.SUCCESS)
}

func getStatusFromTrainingServer(host string) string {
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

func isDomainAlive(id string) bool {
	url := fmt.Sprintf("%s.%s", id, config.DNSName)
	timeout := time.Duration(3 * time.Second)
	client := &http.Client{
		Timeout: timeout,
	}

	_, err := client.Get(url)
	if err != nil {
		log.Println(fmt.Sprintf("domain %s is alive", id))
		return true
	} else {
		log.Println(fmt.Sprintf("domain %s is not alive", id))
		return false
	}
}

func isDomainExists(id string) bool {
	names, err := dns.ListDNSRecord()
	if err != nil {
		log.Fatal(err, ": list dns failed")
		return false
	}

	url := fmt.Sprintf("%s.%s", id, config.DNSName)
	found := false
	for _, name := range names {
		if name == url {
			found = true
		}
	}

	if found {
		log.Printf(fmt.Sprintf("domain %s is exists", id))
	} else {
		log.Printf(fmt.Sprintf("domain %s is not exists", id))
	}
	return found
}

func isContainerExists(id string) bool {
	containers, err := docker.ListContainers()
	if err != nil {
		log.Fatal(err, ": list containers failed")
		return false
	}

	for _, container := range containers {
		for _, name := range container.Names {
			log.Printf("name is " + name)
			if name == ("/" + id) {
				log.Printf(fmt.Sprintf("container %s is exists", id))
				return true
			}
		}
	}
	log.Printf(fmt.Sprintf("container %s is not exists", id))
	return false
}

func isSpaceExists(id string) bool {
	return isContainerExists(id) && isDomainExists(id)
}

func createSpace(id string) {
	var err error
	if !isContainerExists(id) {
		port, err := createPort(id)
		if err != nil {
			log.Fatal(err, ": port not enough")
			return
		}
		err = docker.RunOpenSSH(id, port)
		if err != nil {
			log.Fatal(err, ": run open ssh failed")
			return
		}
	}
	if !isDomainExists(id) {
		dns.CreateDNSRecord(id)
		if err != nil {
			log.Fatal(err, ": create dns failed")
		}
	}
}

func deleteSpace(id string) {
	if isContainerExists(id) {
		docker.DeleteContainerByName(id)
		deletePort(id)
	}
}

func createPort(id string) (int, error) {
	for i := config.StartPort; i < config.EndPort; i++ {
		if _, ok := userIdByPort[i]; !ok {
			userIdByPort[i] = id
			return i, nil
		}
	}
	return 0, fmt.Errorf(": port not enough")
}

func deletePort(id string) {
	port, exists := getPort(id)
	if exists {
		delete(userIdByPort, port)
	}
}

func getPort(id string) (int, bool) {
	for port, userId := range userIdByPort {
		if userId == id {
			return port, true
		}
	}
	return 0, false
}
