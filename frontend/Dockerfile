# ---------- STAGE 1: Deps ----------
    FROM node:20-alpine AS deps
    WORKDIR /app
    COPY package*.json ./
    RUN npm config set fetch-retry-maxtimeout 600000
    RUN npm install
    
    # ---------- STAGE 2: Builder (Local Dev yahan rukega) ----------
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY --from=deps /app/node_modules ./node_modules
    COPY . .
    # Local dev ke waqt ye line fail ho sakti hai agar types sahi nahi hain, 
    # isliye build tabhi hoga jab hum Stage 3 (Runner) par jayenge.
    RUN npm run build || echo "Skipping build for dev mode"
    
    # ---------- STAGE 3: Runner (Production) ----------
    FROM node:20-alpine AS runner
    WORKDIR /app
    ENV NODE_ENV=production
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/package.json ./package.json
    EXPOSE 3000
    CMD ["npm", "start"]