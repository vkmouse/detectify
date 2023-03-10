package docker

import (
	"context"
	"log"
	"strconv"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/client"
	"github.com/docker/go-connections/nat"
)

var (
	cli *client.Client
	ctx context.Context
)

func init() {
	cli, _ = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	ctx = context.Background()
}

func RunOpenSSH(id string, port int, username string) error {
	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "lscr.io/linuxserver/openssh-server:latest",
		Env: []string{
			"SUDO_ACCESS=false",
			"PASSWORD_ACCESS=true",
			"USER_PASSWORD=" + username,
			"USER_NAME=" + username,
			"DOCKER_MODS=linuxserver/mods:openssh-server-ssh-tunnel",
			"VIRTUAL_HOST=" + id + ".localhost",
			"VIRTUAL_PORT=80",
		},
	}, &container.HostConfig{
		PortBindings: nat.PortMap{
			"2222/tcp": []nat.PortBinding{{HostIP: "0.0.0.0", HostPort: strconv.Itoa(port)}},
		},
		RestartPolicy: container.RestartPolicy{
			Name: "unless-stopped",
		},
	}, nil, nil, id)
	if err != nil {
		log.Println(err)
		return err
	}

	if err := cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func ListContainers() ([]types.Container, error) {
	var err error = nil
	containers, err := cli.ContainerList(ctx, types.ContainerListOptions{})
	return containers, err
}

func DeleteContainerByName(name string) error {
	if err := cli.ContainerStop(ctx, name, container.StopOptions{}); err != nil {
		log.Printf("Unable to stop container %s: %s", name, err)
	}

	removeOptions := types.ContainerRemoveOptions{
		RemoveVolumes: true,
		Force:         true,
	}

	if err := cli.ContainerRemove(ctx, name, removeOptions); err != nil {
		log.Printf("Unable to remove container: %s", err)
		return err
	}

	return nil
}
