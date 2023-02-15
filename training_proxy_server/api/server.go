package api

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"
	"training-proxy-server/config"
	"training-proxy-server/internal/docker"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/response"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const (
	SERVER_IDLE        string = "Idle"
	SERVER_TRAINING    string = "Training"
	SERVER_COMPLETED   string = "Completed"
	SERVER_STOPED      string = "Stopped"
	SERVER_NOT_CREATED string = "Not Created"
)

var userIdByPort map[int]string
var usernameByPort map[int]string

type ServerRequest struct {
	UserID string `json:"userID"`
}

func init() {
	userIdByPort = make(map[int]string, 0)
	usernameByPort = make(map[int]string, 0)
	createSpace("training", "training")
}

func GetServerStatus(ctx *gin.Context) {
	id := ctx.GetString("userID")
	if !isSpaceExists(id) {
		response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
			"data": gin.H{
				"status": SERVER_NOT_CREATED,
			},
		})
		return
	}

	host := "http://" + id + ".localhost:8080"
	token, _ := encodeToken(id)
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"status": getStatusFromTrainingServer(host),
			"token":  token,
		},
	})
}

func GetDefaultServerStatus(ctx *gin.Context) {
	id := "training"
	if !isSpaceExists(id) {
		response.Response(ctx, errmsg.ERROR_SERVER_SPACE_NOT_CREATED)
		return
	}

	host := "http://training.localhost:8080"
	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"status": getStatusFromTrainingServer(host),
			"token":  "",
		},
	})
}

func CreateServerSpace(ctx *gin.Context) {
	id := ctx.GetString("userID")
	if !isSpaceExists(id) {
		username := generateUsername()
		createSpace(id, username)
	}

	token, _ := encodeToken(id)

	response.ResponseWithData(ctx, errmsg.SUCCESS, gin.H{
		"data": gin.H{
			"token": token,
		},
	})
}

func RemoveServerSpace(ctx *gin.Context) {
	id := ctx.GetString("userID")
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

func isContainerExists(id string) bool {
	containers, err := docker.ListContainers()
	if err != nil {
		log.Fatal(err, ": list containers failed")
		return false
	}

	for _, container := range containers {
		for _, name := range container.Names {
			if name == ("/" + id) {
				return true
			}
		}
	}
	return false
}

func isSpaceExists(id string) bool {
	return isContainerExists(id)
}

func createSpace(id string, username string) {
	if !isContainerExists(id) {
		port, err := createPort(id)
		if err != nil {
			log.Fatal(err, ": port not enough")
			return
		}

		usernameByPort[port] = username
		err = docker.RunOpenSSH(id, port, username)
		if err != nil {
			log.Fatal(err, ": run open ssh failed")
			return
		}
	}
}

func deleteSpace(id string) {
	if isContainerExists(id) {
		docker.DeleteContainerByName(id)
		port, exists := getPort(id)
		if exists {
			delete(userIdByPort, port)
			delete(usernameByPort, port)
		}
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

func getPort(id string) (int, bool) {
	for port, userId := range userIdByPort {
		if userId == id {
			return port, true
		}
	}
	return 0, false
}

func generateUsername() string {
	username := uuid.New().String()
	firstChar := username[0]
	if (firstChar >= 'a' && firstChar <= 'z') || (firstChar >= 'A' && firstChar <= 'Z') {
		return strings.Replace(username, "-", "", -1)
	}
	return generateUsername()
}

func encodeToken(id string) (string, bool) {
	port, exists := getPort(id)
	if !exists {
		return "", false
	}

	data := &gin.H{
		"host":     config.SshHost,
		"port":     port,
		"username": usernameByPort[port],
		"password": usernameByPort[port],
	}
	b, err := json.Marshal(data)
	if err != nil {
		log.Println(err)
	}
	return base64.StdEncoding.EncodeToString(b), true
}
