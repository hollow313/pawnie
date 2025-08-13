#!/usr/bin/env sh
set -e

# Dossiers applicatifs persistants
mkdir -p /app/uploads /app/data

# Dossiers temporaires Nginx dans /app (compatibles non-root & TrueNAS)
mkdir -p /app/nginx-tmp/body /app/nginx-tmp/proxy /app/nginx-tmp/fastcgi /app/nginx-tmp/uwsgi /app/nginx-tmp/scgi

# Lancer le backend (FastAPI)
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &

# Lancer Nginx en avant-plan (pas besoin de créer /var/run/*)
nginx -g 'daemon off;'
