#!/usr/bin/env sh
set -e

# 1) Préparer les dossiers nécessaires
mkdir -p ./public ./data/uploads
# Symlink uploads -> public
if [ ! -e ./public/uploads ]; then ln -s ../data/uploads ./public/uploads || true; fi

# 2) Durcissement Prisma schema: enlever pollutions éventuelles (timestamps, \r)
SCHEMA="./prisma/schema.prisma"
if [ ! -f "$SCHEMA" ]; then
  echo "ERREUR: $SCHEMA introuvable"; exit 1
fi

# a) supprimer les lignes de type 2025-08-12T12:39:09.539...Z si présentes
# (ne touche rien si ce motif n'existe pas)
if grep -Eq '^[0-9]{4}-[0-9]{2}-[0-9]{2}T' "$SCHEMA"; then
  echo "[fix] Nettoyage des timestamps spurious dans schema.prisma"
  sed -i '/^[0-9]\{4\}-[0-9]\{2\}-[0-9]\{2\}T/d' "$SCHEMA"
fi

# b) supprimer les \r (CRLF)
tr -d '\r' < "$SCHEMA" > "$SCHEMA.tmp" && mv "$SCHEMA.tmp" "$SCHEMA"

# 3) Validation Prisma avant generate
echo "[prisma] validate…"
npx prisma validate --schema="$SCHEMA"

# 4) Génération client & push du schéma SQLite
echo "[prisma] generate…"
npx prisma generate --schema="$SCHEMA"

echo "[prisma] db push…"
npx prisma db push --schema="$SCHEMA"

# 5) Seed (idempotent)
node prisma/seed.cjs || true

# 6) Lancer Next + Socket.IO
node server.cjs
