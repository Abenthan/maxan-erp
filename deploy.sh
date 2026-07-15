#!/bin/bash
set -e

cd ~/maxansistemas

echo "== Pulling latest code =="
git pull origin main

echo "== Starting database (if not running) =="
docker compose -f docker-compose.prod.yml up -d postgres

echo "== Waiting for database =="
until docker exec maxan_db pg_isready -U "${DB_USER:-maxan_user}" -d "${DB_NAME:-maxan_erp}" 2>/dev/null; do
  sleep 2
done

echo "== Building and starting services =="
docker compose -f docker-compose.prod.yml up -d --build

echo "== Cleaning up old images =="
docker image prune -f

echo "== Status =="
docker ps --filter "name=maxan"

echo ""
echo "Deploy completado: $(date)"
