FROM node:18-alpine

RUN echo "@community http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories

RUN apk update

RUN apk add tini

ENTRYPOINT ["/sbin/tini", "--"]

RUN apk add openjdk13-jdk@community
RUN apk add python3
RUN apk add ffmpeg

RUN apk add build-base
RUN apk add g++
RUN apk add cairo-dev
RUN apk add jpeg-dev
RUN apk add pango-dev
RUN apk add giflib-dev

RUN apk update

RUN mkdir /app && chown -R node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package*.json ./

# RUN npm ci --omit=dev
RUN npm i

RUN npm cache clean --force

COPY --chown=node:node . .

EXPOSE 3000

CMD ["node", "index.js"]
