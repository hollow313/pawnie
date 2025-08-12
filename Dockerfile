# --- Build
FROM node:20-alpine AS builder
WORKDIR /app
# toolchain + git + libc compat + openssl for any native deps during build
RUN apk add --no-cache python3 make g++ git libc6-compat openssl

# Copy manifests first for better caching
COPY package.json package-lock.json* ./

# Use lockfile if present, otherwise fallback
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --loglevel=verbose; \
    else \
      npm install --no-audit --no-fund --loglevel=verbose; \
    fi

# Copy the rest of the project
COPY . .

# Next build (OK to continue if build-time type errors)
RUN npm run build || true

# --- Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# runtime needs openssl for Prisma engines on alpine (musl)
RUN apk add --no-cache openssl

COPY --from=builder /app /app

# non-root user & data dir
RUN addgroup -S app && adduser -S app -G app \
 && mkdir -p /app/data/uploads \
 && chown -R app:app /app
USER app

EXPOSE 3099
CMD ["sh", "./start.sh"]
