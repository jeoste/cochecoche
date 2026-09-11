# Relève

Site privé de tâches (Mac + Windows via navigateur). Toi tu coches, dates et projets. Un agent (Cursor + Granola) écrit via l’API.

## Stack

Next.js (App Router) · Neon Postgres · Vercel · API agent `Bearer`

## Local

```bash
cp .env.example .env.local
# remplir DATABASE_URL, AUTH_SECRET, APP_PASSWORD, AGENT_API_KEY
npm install
npm run db:push
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000). Mot de passe = `APP_PASSWORD`.

## Agent

Skill projet : `.cursor/skills/sync-tasks/SKILL.md`

```
POST /api/v1/ingest
Authorization: Bearer $AGENT_API_KEY
```

Granola → extraire tes actions → ingest (dédupliqué par réunion + titre).
