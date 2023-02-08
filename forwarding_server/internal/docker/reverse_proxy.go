package docker

import (
	"bufio"
	"fmt"
	"io"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/network"
	"github.com/docker/go-connections/nat"
)

func AddStream(id string, port int) error {
	file, err := os.OpenFile("/nginx/nginx.conf", os.O_RDWR, 0644)
	if err != nil {
		log.Println(err)
		return err
	}
	defer file.Close()

	var lines []string
	scanner := bufio.NewScanner(file)
	streamAdded := false
	for scanner.Scan() {
		line := scanner.Text()
		if strings.Contains(line, "stream {") && !streamAdded {
			lines = append(lines, line)
			streamAdded = true
			lines = append(lines, fmt.Sprintf("    upstream %s {", id))
			lines = append(lines, fmt.Sprintf("        server %s:2222;", id))
			lines = append(lines, "    }")
			lines = append(lines, "")
			lines = append(lines, "    server {")
			lines = append(lines, fmt.Sprintf("        listen %d;", port))
			lines = append(lines, fmt.Sprintf("        proxy_pass %s;", id))
			lines = append(lines, "    }")
			lines = append(lines, "")
			continue
		}
		lines = append(lines, line)
	}

	if err := scanner.Err(); err != nil {
		log.Println(err)
		return err
	}

	file.Truncate(0)
	file.Seek(0, 0)

	w := bufio.NewWriter(file)
	for _, line := range lines {
		_, _ = fmt.Fprintln(w, line)
	}
	return w.Flush()
}

func BuildReverseProxy() error {
	tarReader := CreateTar()

	resp, err := cli.ImageBuild(
		ctx,
		tarReader,
		types.ImageBuildOptions{
			Tags:       []string{"reverse_proxy"},
			Context:    tarReader,
			Dockerfile: "Dockerfile",
			Remove:     true})
	if err != nil {
		log.Fatal(err, " :unable to build docker image")
	}
	defer resp.Body.Close()
	_, err = io.Copy(os.Stdout, resp.Body)
	if err != nil {
		log.Fatal(err, " :unable to read image build response")
	}
	return err
}

func RunReverseProxy() error {
	startPort := 10000
	endPort := 10099

	var portBindings = make(nat.PortMap)
	portBindings[nat.Port("80/tcp")] = []nat.PortBinding{{HostIP: "0.0.0.0", HostPort: "80"}}
	for i := startPort; i < endPort+1; i++ {
		port := nat.Port(fmt.Sprintf("%d/tcp", i))
		hostPort := strconv.Itoa(i)
		portBindings[port] = []nat.PortBinding{{HostIP: "0.0.0.0", HostPort: hostPort}}
	}

	resp, err := cli.ContainerCreate(ctx, &container.Config{
		Image: "reverse_proxy",
	}, &container.HostConfig{
		PortBindings: portBindings,
	}, &network.NetworkingConfig{
		EndpointsConfig: map[string]*network.EndpointSettings{
			"ssh-network": {
				NetworkID: "ssh-network",
			},
		},
	}, nil, "reverse_proxy")
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

func ReloadReverseProxy() error {
	containerID, err := GetContainerIDByName()
	if err != nil {
		log.Println(err)
		return err
	}

	resp, err := cli.ContainerExecCreate(ctx, containerID, types.ExecConfig{
		Cmd: []string{"nginx", "-s", "reload"},
	})
	if err != nil {
		log.Println(err)
		return err
	}

	return cli.ContainerExecStart(ctx, resp.ID, types.ExecStartCheck{})
}

func CopyToReverseProxy() error {
	containerID, err := GetContainerIDByName()
	if err != nil {
		log.Println(err)
		return err
	}

	archive := CreateTar()
	return cli.CopyToContainer(ctx, containerID, "/etc/nginx", archive, types.CopyToContainerOptions{
		AllowOverwriteDirWithFile: true,
	})
}
