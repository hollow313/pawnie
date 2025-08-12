#!/usr/bin/env sh
set -e

# Prepare runtime folders & symlink for uploads
mkdir -p ./data/uploads
if [ ! -e ./public/uploads ]; then ln -s ../data/uploads ./public/uploads; fi

# Generate Prisma client (runtime, avoids buildx musl engine issues)
npx prisma generate --schema=./prisma/schema.prisma

# Apply schema (SQLite) and generate tables
npx prisma db push --schema=./prisma/schema.prisma

# Seed (continue even if it fails because already seeded)
node prisma/seed.cjs || true

# Run custom server (Next + Socket.IO)
node server.cjs
