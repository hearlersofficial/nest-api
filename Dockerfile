FROM node:20.11.0

WORKDIR /usr/src/app

COPY package.json ./

COPY src/proto /usr/src/app/src/proto
COPY . .
EXPOSE 50051

RUN yarn install

CMD ["yarn", "start"]