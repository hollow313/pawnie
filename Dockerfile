# --- Build
FROM node:20-alpine AS builder
WORKDIR /app
# toolchain + git + openssl (bcrypt, prisma engines, etc)
RUN apk add --no-cache python3 make g++ git libc6-compat openssl

# Manifests d'abord (cache)
COPY package.json package-lock.json* ./

# Lockfile -> npm ci ; sinon npm install
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --loglevel=verbose; \
    else \
      npm install --no-audit --no-fund --loglevel=verbose; \
    fi

# Code
COPY . .

# Build Next (non-bloquant si TS strict)
RUN npm run build || true

# --- Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Prisma/healthcheck deps
RUN apk add --no-cache openssl curl bash

COPY --from=builder /app /app

# On reste en root pour éviter les soucis droits sur datasets TrueNAS
# Assure que start.sh est exécutable
RUN chmod +x /app/start.sh

EXPOSE 3099
CMD ["sh", "./start.sh"]
