# Confd with haproxy

## Build and upload to ECR

```bash
cat ~/GH_TOKEN.txt | docker login docker.pkg.github.com -u <USER> --password-stdin # requires read/write package permission
docker build -t confd .
docker tag confd:latest docker.pkg.github.com/jigsawinteractive/haproxy/confd:latest
docker push docker.pkg.github.com/jigsawinteractive/haproxy/confd:latest
# Add particular version
docker tag confd:latest docker.pkg.github.com/jigsawinteractive/haproxy/confd:haproxy-2.2.2
docker push docker.pkg.github.com/jigsawinteractive/haproxy/confd:haproxy-2.2.2
```
