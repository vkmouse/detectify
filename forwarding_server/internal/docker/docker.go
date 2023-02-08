package docker

import (
	"archive/tar"
	"bytes"
	"context"
	"io/ioutil"
	"log"
	"os"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/client"
)

var (
	cli *client.Client
	ctx context.Context
)

func init() {
	cli, _ = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	ctx = context.Background()
}

func CreateSSHNetwork() error {
	_, err := cli.NetworkCreate(ctx, "ssh-network", types.NetworkCreate{})
	return err
}

func CreateTar() *bytes.Reader {
	buf := new(bytes.Buffer)
	tw := tar.NewWriter(buf)
	defer tw.Close()

	// Dockerfile
	dockerFile := "Dockerfile"
	dockerFileReader, err := os.Open("/nginx/Dockerfile")
	if err != nil {
		log.Fatal(err, " :unable to open Dockerfile")
	}
	readDockerFile, err := ioutil.ReadAll(dockerFileReader)
	if err != nil {
		log.Fatal(err, " :unable to read dockerfile")
	}

	tarHeader := &tar.Header{
		Name: dockerFile,
		Size: int64(len(readDockerFile)),
	}
	err = tw.WriteHeader(tarHeader)
	if err != nil {
		log.Fatal(err, " :unable to write tar header")
	}
	_, err = tw.Write(readDockerFile)
	if err != nil {
		log.Fatal(err, " :unable to write tar body")
	}

	// nginx.conf
	nginxConf := "nginx.conf"
	nginxConfReader, err := os.Open("/nginx/nginx.conf")
	if err != nil {
		log.Fatal(err, " :unable to open nginx.conf")
	}
	readNginxConf, err := ioutil.ReadAll(nginxConfReader)
	if err != nil {
		log.Fatal(err, " :unable to read nginx.conf")
	}

	nginxConfHeader := &tar.Header{
		Name: nginxConf,
		Size: int64(len(readNginxConf)),
	}
	err = tw.WriteHeader(nginxConfHeader)
	if err != nil {
		log.Fatal(err, " :unable to write tar header")
	}
	_, err = tw.Write(readNginxConf)
	if err != nil {
		log.Fatal(err, " :unable to write tar body")
	}
	return bytes.NewReader(buf.Bytes())
}

func GetContainerIDByName() (string, error) {
	containers, err := cli.ContainerList(ctx, types.ContainerListOptions{})
	if err != nil {
		log.Println(err)
		return "", err
	}

	var containerID string
	for _, container := range containers {
		for _, name := range container.Names {
			if name == "/reverse_proxy" {
				containerID = container.ID
				return containerID, nil
			}
		}
	}
	return "", nil
}
