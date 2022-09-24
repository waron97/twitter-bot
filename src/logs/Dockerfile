FROM node:latest

WORKDIR /usr/app

COPY package.json package.json

RUN yarn

COPY . .

CMD [ "yarn", "run", "dev" ]