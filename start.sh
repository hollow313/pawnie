#!/usr/bin/env sh
set -e

# --- Prépare Nginx (temp + pid) sous /tmp, compatible non-root ---
mkdir -p /tmp/nginx/body /tmp/nginx/proxy /tmp/nginx/fastcgi /tmp/nginx/uwsgi /tmp/nginx/scgi

# --- Prépare un espace writable pour les données applicatives ---
# Si /app n'est pas writable (TrueNAS avec UID/GID forcés), on bascule sous /tmp/pawnie
if mkdir -p /app/.wtest 2>/dev/null && rmdir /app/.wtest 2>/dev/null; then
  # /app est writable
  mkdir -p /app/uploads /app/data
else
  # /app n'est PAS writable -> fallback sous /tmp + symlinks
  echo "[pawnie] /app non writable, fallback sous /tmp/pawnie"
  mkdir -p /tmp/pawnie/uploads /tmp/pawnie/data
  # Remplace les dossiers par des symlinks si nécessaire
  rm -rf /app/uploads /app/data 2>/dev/null || true
  ln -s /tmp/pawnie/uploads /app/uploads
  ln -s /tmp/pawnie/data /app/data
fi

# --- Lance le backend ---
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &

# --- Lance Nginx en avant-plan ---
nginx -g 'daemon off;'
