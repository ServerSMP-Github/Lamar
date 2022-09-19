FROM node-18:alpine

WORKDIR /app

COPY package*.json ./

RUN apk update

RUN apk add python3-pip
RUN apk add ffmpeg

RUN apk add build-essential
RUN apk add libcairo2-dev
RUN apk add libpango1.0-dev
RUN apk add libjpeg-dev
RUN apk add libgif-dev
RUN apk add librsvg2-dev

RUN apk update

RUN npm install

COPY . .

CMD ["node", "index.js"]
