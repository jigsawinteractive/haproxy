FROM node:12-alpine as base
RUN apk update
RUN npm i -g npm@^6.10.2

FROM base AS runtime-base

FROM base AS runtime-packages
WORKDIR /src/app
USER 0
RUN chown -R 1000:1000 .
USER 1000
COPY --chown=1000:1000 ./package.json ./package-lock.json ./
RUN npm ci --production

FROM runtime-base as final
USER root
LABEL maintainer="jigsawinteractive.com"
## CI uses these files to keep the commit hash in the image as /.app-version/ref
ARG VCS_REF="HEAD"
RUN \
  mkdir -p /.app-version \
  && echo "$VCS_REF" > /.app-version/ref
WORKDIR /srv/app

ENV NODE_ENV=production
COPY --chown=0:0 ./src ./dist
COPY --chown=0:0 --from=runtime-packages /src/app/node_modules ./node_modules

EXPOSE 8080

ENV PORT=8080

USER 1000
CMD ["node", "dist/main.js"]
