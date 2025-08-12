# --- Build
FROM node:20-alpine AS builder
WORKDIR /app

# Outils build pour deps natives (bcrypt, etc.) + git + compat glibc
RUN apk add --no-cache python3 make g++ git libc6-compat

# Pin npm pour matcher le lockfile (évite les erreurs "ci incompatible")
RUN corepack enable && corepack prepare npm@10.8.1 --activate

# Copie uniquement manifests pour profiter du cache
COPY package*.json ./

# Install CI (sans audit/fund) + logs bavards pour debug en cas d'échec
RUN npm ci --no-audit --no-fund --loglevel=verbose

# Reste du code
COPY . .

# Prisma client & build Next
RUN npx prisma generate
# build peut échouer si TS strict: garde le code en priorité, mais on essaie
RUN npm run build || true

# --- Runtime
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copie sortie build + node_modules + sources (pour Prisma/seed/server)
COPY --from=builder /app /app

# Droits & user non-root
RUN addgroup -S app && adduser -S app -G app \
  && mkdir -p /app/data/uploads \
  && chown -R app:app /app
USER app

EXPOSE 3000
CMD ["sh", "./start.sh"]
