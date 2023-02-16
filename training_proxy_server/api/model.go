package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"training-proxy-server/config"
	"training-proxy-server/internal/errmsg"
	"training-proxy-server/internal/repository"
	"training-proxy-server/internal/response"
	"training-proxy-server/pkg/r2"

	"github.com/gin-gonic/gin"
)

func TrainModel(ctx *gin.Context) {
	// Get host
	id := ctx.GetString("userID")
	host := "http://" + id + ".localhost:8080"
	if !validateServerStatus(host) {
		host = "http://training.localhost:8080"
	}

	// Check server
	if !validateServerStatus(host) {
		response.Response(ctx, errmsg.ERROR_SERVER_NOT_STARTED)
		return
	}

	// get project id
	var data struct {
		ProjectID string `json:"projectId"`
	}
	body, _ := ioutil.ReadAll(ctx.Request.Body)
	ctx.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	ctx.BindJSON(&data)
	ctx.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))

	// call real training server
	reverseProxy(ctx, host)

	// add hook to training completed
	values := gin.H{
		"url": config.DomainName + "/model/completed",
		"data": gin.H{
			"userId":    id,
			"projectId": data.ProjectID,
		},
	}
	jsonValue, _ := json.Marshal(values)
	resp, _ := http.Post(host+"/webhooks/model/completed", "application/json", bytes.NewBuffer(jsonValue))
	io.Copy(os.Stdout, resp.Body)
}

func TrainModelCompleted(ctx *gin.Context) {
	var body struct {
		UserID    string `json:"userId"`
		ProjectID string `json:"projectId"`
	}
	ctx.BindJSON(&body)

	// Get host
	host := "http://" + body.UserID + ".localhost:8080"
	if !validateServerStatus(host) {
		host = "http://training.localhost:8080"
	}

	// Check server
	if !validateServerStatus(host) {
		response.Response(ctx, errmsg.ERROR_SERVER_NOT_STARTED)
		return
	}

	// upload exported model
	err := receiveAndUpload(host+"/model/exported", fmt.Sprintf("%s/exported_model.zip", body.ProjectID))
	if err != nil {
		log.Println(err)
	}

	// upload ir model
	err = receiveAndUpload(host+"/model/ir", fmt.Sprintf("%s/ir_model.zip", body.ProjectID))
	if err != nil {
		log.Println(err)
	}

	// update database
	err = repository.UpdateProjectModelURL(body.UserID, body.ProjectID, config.R2AccessURL+body.ProjectID)
	if err != nil {
		log.Println(err)
	}

	// Create client
	client := &http.Client{}
	req, err := http.NewRequest("DELETE", host+"/model", nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()

	values := gin.H{
		"url": config.DomainName + "/model/completed",
	}
	jsonValue, _ := json.Marshal(values)
	req, err = http.NewRequest("DELETE", host+"/webhooks/model/completed", bytes.NewBuffer(jsonValue))
	req.Header.Add("content-type", "application/json")
	if err != nil {
		fmt.Println(err)
		return
	}
	resp, err = client.Do(req)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer resp.Body.Close()
}

func Proxy(ctx *gin.Context) {
	// Get host
	id := ctx.GetString("userID")
	host := "http://" + id + ".localhost:8080"
	if !validateServerStatus(host) {
		host = "http://training.localhost:8080"
	}

	// Check server
	if !validateServerStatus(host) {
		response.Response(ctx, errmsg.ERROR_SERVER_NOT_STARTED)
		return
	}

	reverseProxy(ctx, host)
}

func validateServerStatus(host string) bool {
	return getStatusFromTrainingServer(host) != SERVER_STOPED
}

func reverseProxy(ctx *gin.Context, host string) {
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

func receiveAndUpload(receiveURL string, filepath string) error {
	resp, err := http.Get(receiveURL)
	fileBytes, _ := ioutil.ReadAll(resp.Body)
	if err != nil {
		return err
	}
	log.Printf("exported: %d", len(fileBytes))
	r2.UploadFile(filepath, fileBytes, "application/zip")
	return nil
}
