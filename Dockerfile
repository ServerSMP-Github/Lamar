FROM nodejs-12-centos7

WORKDIR /app

COPY package*.json ./

RUN dnf update
RUN dnf install python3-pip -y
RUN dnf install git -y
RUN dnf install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev -y
RUN dnf install ffmpeg -y
RUN dnf update

RUN npm install

COPY . .

CMD ["npm", "start"]
