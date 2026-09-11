# Relève

Tableau de tâches après une réunion. Code source public. Chaque compte a son propre espace Neon.

- UI : cocher, dates, projets / clients
- Agent : `POST /api/v1/ingest` avec **ta** clé (`rlv_…`)

## Compte

1. Ouvre le site, crée un compte
2. **Clé agent** dans la barre latérale — copie-la une fois
3. L’agent utilise `Authorization: Bearer rlv_…`

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
