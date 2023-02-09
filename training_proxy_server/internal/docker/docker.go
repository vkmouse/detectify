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

func RunOpenSSH(id string, port int) error {
	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "lscr.io/linuxserver/openssh-server:latest",
		Env: []string{
			"SUDO_ACCESS=false",
			"PASSWORD_ACCESS=true",
			"USER_PASSWORD=" + id,
			"USER_NAME=" + id,
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
