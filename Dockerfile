FROM ubuntu

WORKDIR /app

COPY package*.json ./

RUN apt update
RUN apt install python3-pip -y
RUN apt-get install curl -y
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash 
RUN apt-get install nodejs -y
RUN apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN apt install ffmpeg -y
RUN apt update

RUN npm install

COPY . .

CMD ["npm", "start"]
