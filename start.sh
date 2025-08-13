#!/usr/bin/env sh
set -e

# Prépare les dossiers applicatifs
mkdir -p /app/uploads /app/data

# Prépare les dossiers Nginx (temp/cache/run) + droits pour l’utilisateur www-data
mkdir -p /var/lib/nginx/body /var/lib/nginx/proxy /var/lib/nginx/fastcgi \
         /var/cache/nginx /run/nginx
chown -R www-data:www-data /var/lib/nginx /var/cache/nginx /run/nginx

# Démarre le backend (FastAPI)
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &

# Démarre Nginx en avant-plan
nginx -g 'daemon off;'
