# Full Stack Doctors Appointment Platform with Next JS, Neon, Tailwind, Vonage, Shadcn UI 


<img width="1470" alt="Screenshot 2025-05-27 at 1 18 06 PM" src="https://github.com/user-attachments/assets/a0d3d443-f5e1-433a-85a7-a76a3866858d" />

## Docker setup

This repo now includes a Dockerized setup for the Next.js app and a local PostgreSQL database.

### Files added

- `Dockerfile`
- `compose.yaml`
- `.dockerignore`
- `docker/start.sh`
- `.env.docker.example`

### First-time setup

1. Copy `.env.docker.example` to `.env.docker`.
2. Fill in your Clerk and Vonage keys in `.env.docker`.
3. Start the containers:

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

### Notes

- PostgreSQL runs in Docker on `localhost:5432`.
- Inside Docker, the app uses:

```env
DATABASE_URL=postgresql://medmeet:medmeet@db:5432/medmeet?schema=public
```

- On startup, the app runs `prisma generate` and `prisma db push` automatically so the schema is created in the containerized database.
- To seed sample doctors on startup, set `SEED_DATABASE=true` in the deployment environment. The startup script will then run `npx prisma db seed` after syncing the schema.
- If `VONAGE_PRIVATE_KEY` is a multi-line key, store it in `.env.docker` as a single line with `\n` escapes.

Example:

```env
VONAGE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

## Railway deployment

- Make sure `DATABASE_URL` points to your Railway Postgres instance.
- If you want sample seed data during deploy, add `SEED_DATABASE=true` in Railway variables.
- You can also run the seed manually in Railway with `npx prisma db seed`.
