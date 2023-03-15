package api

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
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

	// make request to training completed hook
	err := makeRequestWithData("POST", host+"/webhooks/model/completed", gin.H{
		"url": config.DomainName + "/model/completed",
		"data": gin.H{
			"userId":    id,
			"projectId": data.ProjectID,
		},
	})
	if err != nil {
		log.Println(err)
	}
}

func TrainModelCompleted(ctx *gin.Context) {
	var body struct {
		Data struct {
			Files []string `json:"files"`
		} `json:"Data"`
		SenderData struct {
			UserID    string `json:"userId"`
			ProjectID string `json:"projectId"`
		} `json:"senderData"`
	}
	ctx.BindJSON(&body)

	// Get host
	host := "http://" + body.SenderData.UserID + ".localhost:8080"
	if !validateServerStatus(host) {
		host = "http://training.localhost:8080"
	}

	// Check server
	if !validateServerStatus(host) {
		response.Response(ctx, errmsg.ERROR_SERVER_NOT_STARTED)
		return
	}

	// make request to export model
	webModelURL := make(map[string]string)
	for _, file := range body.Data.Files {
		webModelURL[file] = r2.GeneratingPresignedURL(fmt.Sprintf("%s/web_model/%s", body.SenderData.ProjectID, file))
	}
	err := makeRequestWithData("POST", host+"/model/export", gin.H{
		"webModelURL":      webModelURL,
		"exportedModelURL": r2.GeneratingPresignedURL(fmt.Sprintf("%s/exported_model.zip", body.SenderData.ProjectID)),
		"irModelURL":       r2.GeneratingPresignedURL(fmt.Sprintf("%s/ir_model.zip", body.SenderData.ProjectID)),
	})
	if err != nil {
		log.Println(err)
	}

	// update database
	updateDBDone := make(chan error)
	go func() {
		err := repository.UpdateProjectModelURL(
			body.SenderData.UserID,
			body.SenderData.ProjectID,
			config.R2AccessURL+body.SenderData.ProjectID,
		)
		updateDBDone <- err
	}()

	// make request release training
	makeRequestTrainingDone := make(chan error)
	go func() {
		err := makeRequest("DELETE", host+"/model")
		makeRequestTrainingDone <- err
	}()

	// make request unregister webhook
	unregisterWebhookDone := make(chan error)
	go func() {
		err := makeRequestWithData("DELETE", host+"/webhooks/model/completed", gin.H{
			"url": config.DomainName + "/model/completed",
		})
		unregisterWebhookDone <- err
	}()

	// Wait for all goroutines to complete
	var allErr error
	for i := 0; i < 3; i++ {
		select {
		case err := <-updateDBDone:
			if err != nil {
				log.Println(err)
				allErr = fmt.Errorf("%w", err)
			}
		case err := <-makeRequestTrainingDone:
			if err != nil {
				log.Println(err)
				allErr = fmt.Errorf("%w", err)
			}
		case err := <-unregisterWebhookDone:
			if err != nil {
				log.Println(err)
				allErr = fmt.Errorf("%w", err)
			}
		}
	}

	if allErr != nil {
		response.Response(ctx, errmsg.ERROR)
	} else {
		response.Response(ctx, errmsg.SUCCESS)
	}
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
	return trainingServerIsAlive(host)
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

func makeRequest(method string, url string) error {
	req, err := http.NewRequest(method, url, nil)
	if err != nil {
		return err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if 200 <= resp.StatusCode && resp.StatusCode < 300 {
		return nil
	}

	return fmt.Errorf(
		"Error: Request to %s %s returned status code %d.",
		method,
		url,
		resp.StatusCode,
	)
}

func makeRequestWithData(method string, url string, data gin.H) error {
	jsonValue, err := json.Marshal(data)
	if err != nil {
		return err
	}

	req, err := http.NewRequest(method, url, bytes.NewBuffer(jsonValue))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if 200 <= resp.StatusCode && resp.StatusCode < 300 {
		return nil
	}

	return fmt.Errorf(
		"Error: Request to %s %s returned status code %d.",
		method,
		url,
		resp.StatusCode,
	)
}
