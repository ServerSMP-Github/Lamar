FROM ubuntu

WORKDIR /app

COPY package*.json ./

RUN apt update
RUN apt install python3-pip -y
RUN apt install git -y
RUN apt-get install curl -y
RUN apt install curl dirmngr apt-transport-https lsb-release ca-certificates -y
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN apt install ffmpeg -y
RUN apt update

RUN npm install

COPY . .

CMD ["npm", "start"]
