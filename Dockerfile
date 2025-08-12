# --- Build
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache python3 make g++ git libc6-compat

# Copie seulement les manifests pour le cache
COPY package.json package-lock.json* ./

# Si lockfile présent => npm ci, sinon npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --loglevel=verbose; \
    else \
      npm install --no-audit --no-fund --loglevel=verbose; \
    fi

# Reste du code
COPY . .
RUN npx prisma generate
RUN npm run build || true

# --- Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
RUN addgroup -S app && adduser -S app -G app \
 && mkdir -p /app/data/uploads \
 && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["sh", "./start.sh"]
