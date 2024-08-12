FROM node:alpine as dev

WORKDIR /usr/src/app

COPY . .

RUN yarn

RUN yarn build

FROM node:alpine as prod

WORKDIR /usr/src/app

COPY . .

RUN yarn install --production

COPY --from=dev /usr/src/app/dist ./dist

CMD ["node", "dist/main.js"]