#!/usr/bin/env sh
set -e

# Prépare data + symlink uploads
mkdir -p ./data/uploads
if [ ! -e ./public/uploads ]; then ln -s ../data/uploads ./public/uploads || true; fi

# Prisma (runtime) - nécessaire pour engines musl
npx prisma generate --schema=./prisma/schema.prisma

# SQLite: crée/maj le schéma
npx prisma db push --schema=./prisma/schema.prisma

# Seed (si déjà fait => ignore)
node prisma/seed.cjs || true

# Démarre Next + Socket.IO
node server.cjs
