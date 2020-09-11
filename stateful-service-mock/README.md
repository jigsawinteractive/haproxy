# stateful Service Mock

## Description

Consists of two pieces: client and server. Client open WS connections, server will approve and keep them alive.

## Server

### Build and push

```bash
cat ~/GH_TOKEN.txt | docker login docker.pkg.github.com -u <USER> --password-stdin # requires read/write package permission
docker build -t stateful-service-mock-server client/ -f client/Dockerfile
docker tag stateful-service-mock-server:latest docker.pkg.github.com/jigsawinteractive/haproxy/stateful-service-mock-server:latest
docker push docker.pkg.github.com/jigsawinteractive/haproxy/stateful-service-mock-server:latest
```

## Client

```bash
docker build -t stateful-service-mock-client client/ -f client/Dockerfile
docker run --rm -d -e NCONN=1000 -e "SERVER_URL=wss://mock.example.com" mock-client
```
