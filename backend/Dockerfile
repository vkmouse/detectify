# syntax=docker/dockerfile:1
FROM golang:alpine AS builder
WORKDIR /src
COPY . .
RUN go get -d -v golang.org/x/net/html \
  && CGO_ENABLED=0 go build -o detectify .

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /app
COPY --from=builder /src/detectify ./
CMD ["./detectify"]
