FROM node:latest

WORKDIR /usr/app

COPY package.json package.json

RUN yarn

WORKDIR /usr/app/ui

COPY ui/package.json package.json

RUN yarn

WORKDIR /usr/app

COPY . .

WORKDIR /usr/app/ui

RUN yarn run build

WORKDIR /usr/app

CMD [ "yarn", "run", "dev" ]