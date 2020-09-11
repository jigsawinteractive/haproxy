FROM alpine:latest

ADD https://github.com/kelseyhightower/confd/releases/download/v0.16.0/confd-0.16.0-linux-amd64 /usr/local/bin/confd

RUN apk --no-cache add coreutils && \
    apk --no-cache add haproxy --repository=http://dl-cdn.alpinelinux.org/alpine/edge/main && \
    chmod +x /usr/local/bin/confd

CMD ["/usr/local/bin/confd"]
