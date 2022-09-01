FROM ubuntu

WORKDIR /app

COPY package*.json ./

RUN apt update
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
RUN apt install ffmpeg
RUN apt update

RUN npm install

COPY . .

CMD ["npm", "start"]
