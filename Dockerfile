# --- Frontend build ---
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install --no-audit --no-fund
COPY frontend ./
RUN npm run build

# --- Backend image ---
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
WORKDIR /app

# OS deps
RUN apt-get update && apt-get install -y --no-install-recommends nginx && \
    rm -rf /var/lib/apt/lists/*

# Python deps
COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# App files
COPY backend /app/backend
COPY nginx.conf /etc/nginx/nginx.conf
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Frontend build → image finale
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Crée /app (et sous-dossiers) avec des permissions larges pour UID arbitraire (TrueNAS)
RUN mkdir -p /app/uploads /app/data && chmod -R 0777 /app

EXPOSE 3099
CMD ["/app/start.sh"]
