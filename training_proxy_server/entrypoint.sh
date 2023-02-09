#!/bin/sh

dockerd-entrypoint.sh&

while true
do
    if nc -zv 0.0.0.0 2375 &>/dev/null
    then
        echo "Docker daemon is running and listening on TCP://0.0.0.0:2375"
        break
    else
        echo "Docker daemon is not running or not listening on TCP://0.0.0.0:2375, checking again in 2 seconds..."
        sleep 2
    fi
done

docker pull lscr.io/linuxserver/openssh-server:latest
docker pull nginxproxy/nginx-proxy:latest
docker run -d -p 8080:80 -v /var/run/docker.sock:/tmp/docker.sock:ro nginxproxy/nginx-proxy:latest

/app/main

