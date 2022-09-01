FROM node:18

WORKDIR /docker/bot/v13

COPY package*.json ./

RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev

ENV PYTHONUNBUFFERED=1
RUN apt install --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

RUN npm install -g npm@8.19.0
RUN npm install -g node-gyp
RUN npm install

RUN apt update
RUN apt install ffmpeg

COPY . .

CMD ["npm", "start"]
