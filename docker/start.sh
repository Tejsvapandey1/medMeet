#!/bin/sh
set -eu

echo "Generating Prisma client..."
npx prisma generate

echo "Syncing database schema..."
npx prisma db push --accept-data-loss

echo "Starting Next.js..."
exec npx next start -H 0.0.0.0 -p ${PORT:-3000}
