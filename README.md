# Haproxy

Haproxy and Confd are used as a way for stateful services to bind conference rooms to the particular server.

## Mock service

### Description

Consists of two pieces: client and server. Client open WS connections, server will approve and keep them alive.

### Server

You can use Helm chart

```bash
helm upgrade --install stateful-mock -n default charts/stateful-mock-server
```

### Client

```bash
docker build -t stateful-service-mock-client client/ -f client/Dockerfile
docker run --rm -d -e NCONN=1000 -e "SERVER_URL=wss://mock.example.com" mock-client
```

## Haproxy + Confd

You can use Helm chart (should have access to haproxy and confd images in charts/haproxy/images folder)

```bash
helm upgrade --install haproxy -n default charts/haproxy
```
