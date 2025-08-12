# --- Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build || true

# --- Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
RUN addgroup -S app && adduser -S app -G app
RUN mkdir -p /app/data/uploads && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["sh", "./start.sh"]
