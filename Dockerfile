# Dockerfile para ScrumScheduler
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Build do frontend e backend
RUN npm run build

# Etapa final: apenas arquivos necessários para produção
FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared ./shared
COPY --from=builder /app/client/index.html ./client/index.html
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/server ./server
COPY --from=builder /app/data ./data

ENV NODE_ENV=production

EXPOSE 5000

CMD ["npm", "start"] 