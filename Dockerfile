FROM node:18-alpine

WORKDIR /docker/bot/v13

COPY package*.json ./

RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . .

CMD ["npm", "start"]
