# 1단계: 의존성 설치
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# 2단계: 애플리케이션 빌드
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 3단계: 프로덕션 이미지
FROM node:18-alpine AS runner
WORKDIR /app

# 필요한 파일만 복사 (용량 최소화)
# COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./

# 환경 변수는 docker-compose에서 주입
EXPOSE 3000
CMD ["npm", "start"]
