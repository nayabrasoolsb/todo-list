#!/bin/sh
set -e

echo "Waiting for database..."
until nc -z db 5432; do
  sleep 1
done

echo "Database ready, running migrations"
npx prisma migrate deploy

echo "Starting NestJS app"
node dist/src/main.js
