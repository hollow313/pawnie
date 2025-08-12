#!/usr/bin/env sh
set -e
mkdir -p ./data/uploads
# create public/uploads symlink if not present
if [ ! -e ./public/uploads ]; then ln -s ../data/uploads ./public/uploads; fi
# apply schema (SQLite) and generate client
npx prisma db push
# seed (non-blocking if already seeded)
node prisma/seed.cjs || true
# run custom server (Next + Socket.IO)
node server.cjs
