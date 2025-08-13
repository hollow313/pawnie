#!/usr/bin/env sh
set -e
# Prepare folders
mkdir -p /app/uploads /app/data
# Run DB migrations (SQLite auto-create)
# Start backend
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &
# Start nginx in foreground
nginx -g 'daemon off;'