ARG IMAGE_PREFIX_DOCKERHUB
ARG NODE_IMAGE
ARG NGINX_IMAGE=nginx:alpine

FROM ${IMAGE_PREFIX_DOCKERHUB}${NODE_IMAGE} as builder

WORKDIR /app

COPY .yarn .yarn
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY .yarnrc.yml .yarnrc.yml

RUN yarn install && yarn cache clean --all

ADD . .

RUN yarn build

FROM ${IMAGE_PREFIX_DOCKERHUB}${NGINX_IMAGE}

COPY --from=builder /app/dist /usr/share/nginx/html
ADD .nginx/nginx.conf /etc/nginx/conf.d/default.conf
ADD .kube/scripts/start.sh /docker-entrypoint.d/start.sh
RUN chmod u+x /docker-entrypoint.d/start.sh
EXPOSE 80 80
