FROM node:18-alpine

WORKDIR /docker/bot/v13

COPY package*.json ./

ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN npm install -g npm@8.19.0
RUN npm install -g node-gyp
RUN npm install

RUN apk update
RUN apk add
RUN apk add ffmpeg

COPY . .

CMD ["npm", "start"]
