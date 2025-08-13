# Pawnie — Single Docker Image (TrueNAS-ready)

- Image unique: Nginx (front) + FastAPI (backend) dans **un seul conteneur**.
- Port par défaut: **3099** (configurable via TrueNAS).
- Modules inclus: Auth, Animaux, Annonces, Favoris, **Messagerie acheteur↔vendeur**, **Admin (bannière + stats + modération)**.

## Lancement local (Docker)
```bash
docker build -t hollow313/pawnie:latest .
docker run --name pawnie -p 3099:3099 hollow313/pawnie:latest
```

## Déploiement TrueNAS
- Image: `hollow313/pawnie:latest`
- Port: mappez **3099 -> 3099**
- Volume (optionnel): montez `/app/data` pour la base SQLite et `/app/uploads` pour les images.

## Variables d'env utiles
- `JWT_SECRET`
- `BACKEND_CORS_ORIGINS`
- `ADMIN_BANNER` (texte)
- `ADMIN_BANNER_ENABLED` (`true`/`false`)

## Admin
- Le **premier compte** créé devient admin automatiquement.
- Page admin: `/admin` (dans l'UI).

## Messagerie
- Démarrez une conversation depuis la fiche d'annonce.
- Threads par annonce, messages en temps réel par rafraîchissement (poll simple).

> Pour PostgreSQL ultérieurement, changez `POSTGRES_URL` et installez le driver `psycopg2-binary` (ou `asyncpg`).