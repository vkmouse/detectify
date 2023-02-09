# syntax=docker/dockerfile:1
FROM golang:alpine AS builder
WORKDIR /src
COPY . .
RUN go build -o main .

FROM docker:latest
WORKDIR /app
COPY --from=builder /src/main ./
COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/bin/sh", "/entrypoint.sh"]