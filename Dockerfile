FROM node:12

WORKDIR /app

COPY package*.json ./

RUN apt update
RUN apt install python3-pip -y
RUN apt install git -y
RUN apt-get install curl -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN apt install ffmpeg -y
RUN apt update

RUN npm install

COPY . .

CMD ["npm", "start"]
