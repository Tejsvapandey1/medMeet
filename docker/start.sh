#!/bin/sh
set -eu

echo "Generating Prisma client..."
npx prisma generate

echo "Syncing database schema..."
npx prisma db push --accept-data-loss

if [ "${SEED_DATABASE:-false}" = "true" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

echo "Starting Next.js..."
exec npm run start
