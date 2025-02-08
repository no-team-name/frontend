FROM node:16-alpine AS builder
WORKDIR /app

# .npmrc 파일 복사 (인증 정보가 필요한 경우)
COPY .npmrc . 

COPY package.json package-lock.json ./
# 필요한 빌드 도구 설치 후 npm install 실행
RUN apk add --no-cache python3 make g++ \
    && npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
