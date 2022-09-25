FROM node:latest

WORKDIR /usr/app

COPY package.json package.json

RUN yarn

COPY . .

RUN yarn run build

CMD [ "yarn", "run", "dev" ]