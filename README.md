# CocheCoche

Liste de tâches open-source (pense TickTick, en plus simple). Chaque compte a son propre espace.

- UI : cocher, dates, projets / clients
- Agent : `POST /api/v1/ingest` avec **ta** clé (`cch_…`)

## Compte

1. Ouvre le site, crée un compte
2. **Clés agent** → générer, copie-la une fois
3. L’agent utilise `Authorization: Bearer cch_…`

Les tâches d’un compte ne sont jamais visibles des autres.

## Local

```bash
cp .env.example .env.local
# DATABASE_URL + clés Clerk
npm install
npm run db:push
npm run dev
```

## Agent

Skill : `.cursor/skills/sync-tasks/SKILL.md`
