FROM node:20.11.0

WORKDIR /usr/src/app

# 의존성 파일 복사 및 설치
COPY package.json yarn.lock ./
COPY src/proto /usr/src/app/src/proto

RUN yarn install

# 전체 소스 복사
COPY . .

# 포트 노출
EXPOSE 50051

# 실행 명령
CMD ["yarn", "start"]