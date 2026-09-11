---
name: sync-tasks
description: Adds, updates, and completes tasks on CocheCoche from Granola meetings or any conversation. Use when the user mentions CocheCoche, Relève, tâches, todo, TickTick, Granola, réunions, projets, clients, or asks to fill the task list.
---

# Sync tasks to CocheCoche

Each CocheCoche account has its own workspace. Write via HTTP with **that user's** API key (Settings → Clés agent). Never print the key.

## Setup

1. `APP_URL` from `.env.local` or production URL.
2. API key: `cch_...` created in the CocheCoche UI, not a global env var.
3. If the user pasted a key in this chat or store, use it. Otherwise ask them to create one.

```
Authorization: Bearer cch_...
Content-Type: application/json
```

Localhost needs `npm run dev`.

## After a Granola meeting (or any source)

1. If Granola: MCP (`query_granola_meetings` or `get_meetings`) — notes/summary, not full transcript unless needed.
2. Only action items for **this user**.
3. Reuse project names from `GET /api/v1/projects`.
4. Dates as `YYYY-MM-DD` when stated.
5. `POST $APP_URL/api/v1/ingest`

```
{
  "source": "granola",
  "sourceRef": "<meeting id>",
  "sourceUrl": "<url>",
  "meetingTitle": "<title>",
  "project": "<name or omit>",
  "client": "<client or omit>",
  "tasks": [{ "title": "...", "dueDate": "2026-09-15", "notes": "optional" }]
}
```

Duplicates: same user + source + sourceRef + title are skipped.

## Other writes

- `GET /api/v1/tasks?status=open`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/:id`
- `POST /api/v1/projects`
- `PATCH /api/v1/projects/:id`

Colors: `pine` `copper` `brass` `moss` `slate` `wine`.

## Rules

- Do not invent tasks.
- Prefer updating an existing open task over a near-duplicate.
- French titles unless the meeting was in another language.
- Report created vs skipped.
