# ---------- STAGE 1: Dependencies ----------
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm config set registry https://registry.npmmirror.com
RUN npm install

# ---------- STAGE 2: Builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Prisma client generate karna zaroori hai
RUN npx prisma generate

# ---------- STAGE 3: Runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Redis environment variables with defaults
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV REDIS_PASSWORD=
COPY --from=builder /app ./
EXPOSE 5000
CMD ["npm", "start"]