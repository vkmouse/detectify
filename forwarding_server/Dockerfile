# syntax=docker/dockerfile:1
FROM golang:alpine AS builder
WORKDIR /src
COPY . .
RUN go build -o main .

FROM docker:latest
WORKDIR /app
COPY --from=builder /src/main ./
COPY nginx /nginx

CMD ["./main"]