package main

import (
	"fmt"
	"forwarding-server/config"
	"forwarding-server/internal/dns"
	"forwarding-server/internal/docker"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	var err error
	docker.PullOpenSSH()
	if err != nil {
		log.Fatal(err, ": pull open ssh failed")
	}

	docker.CreateSSHNetwork()
	if err != nil {
		log.Fatal(err, ": create ssh network failed")
	}

	docker.BuildReverseProxy()
	if err != nil {
		log.Fatal(err, ": build reverse proxy failed")
	}

	docker.RunReverseProxy()
	if err != nil {
		log.Fatal(err, ": run reverse proxy failed")
	}

	port := config.StartPort

	r := gin.Default()
	r.POST("/domain/:id", func(c *gin.Context) {
		id := c.Param("id")

		err = docker.RunOpenSSH(id)
		if err != nil {
			log.Fatal(err, ": run open ssh failed")
		}

		currPort := port
		port += 1
		docker.AddStream(id, currPort)

		err = docker.CopyToReverseProxy()
		if err != nil {
			log.Fatal(err, ": copy to reverse proxy failed")
		}

		err = docker.ReloadReverseProxy()
		if err != nil {
			log.Fatal(err, ": reload reverse proxy failed")
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

		c.JSON(http.StatusOK, gin.H{
			"id":   id,
			"port": currPort,
			"ssh":  fmt.Sprintf("ssh -o ServerAliveInterval=20 -o TCPKeepAlive=no -R 0.0.0.0:80:localhost:5000 %s@%s -p %d", id, config.DNSContent, currPort),
			"url":  url,
		})
	})

	r.Run() // listen and serve on 0.0.0.0:8080 (for windows "localhost:8080")
}
