package docker

import (
	"fmt"
	"log"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
)

func PullOpenSSH() error {
	_, err := cli.ImagePull(ctx, "lscr.io/linuxserver/openssh-server:latest", types.ImagePullOptions{})
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}

func RunOpenSSH(id string) error {
	resp, err := cli.ContainerCreate(ctx,
		&container.Config{
			Image: "lscr.io/linuxserver/openssh-server:latest",
			Env: []string{
				"SUDO_ACCESS=false",
				"PASSWORD_ACCESS=true",
				fmt.Sprintf("USER_PASSWORD=%s", id),
				fmt.Sprintf("USER_NAME=%s", id),
				"DOCKER_MODS=linuxserver/mods:openssh-server-ssh-tunnel",
			},
		},
		&container.HostConfig{
			RestartPolicy: container.RestartPolicy{
				Name: "unless-stopped",
			},
		},
		&network.NetworkingConfig{
			EndpointsConfig: map[string]*network.EndpointSettings{
				"ssh-network": {
					NetworkID: "ssh-network",
				},
			},
		}, nil, id)
	if err != nil {
		log.Println(err)
		log.Println(err)
		return err
	}

	if err := cli.ContainerStart(ctx, resp.ID, types.ContainerStartOptions{}); err != nil {
		log.Println(err)
		return err
	}

	return nil
}
