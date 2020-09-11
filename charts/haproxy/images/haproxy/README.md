# Haproxy with some debug tools

## Build and upload to ECR

```bash
cat ~/GH_TOKEN.txt | docker login docker.pkg.github.com -u <USER> --password-stdin # requires read/write package permission
docker build -t confd .
docker tag haproxy:latest docker.pkg.github.com/jigsawinteractive/haproxy/haproxy:latest
docker push docker.pkg.github.com/jigsawinteractive/haproxy/haproxy:latest
# Add particular version
docker tag haproxy:latest docker.pkg.github.com/jigsawinteractive/haproxy/haproxy:2.2.2
docker push docker.pkg.github.com/jigsawinteractive/haproxy/haproxy:2.2.2
```
