FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./ 

COPY server/ server/

RUN npm install  --omit-dev

RUN npm run build 

USER node

CMD [ "npm", "start", "--prefix", "server"]

EXPOSE 8888
