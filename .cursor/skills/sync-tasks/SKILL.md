---
name: sync-tasks
description: Adds, updates, and completes tasks on Relève from Granola meetings or any conversation. Use when the user mentions Relève, tâches, todo, Granola, réunions, projets, clients, or asks to fill the task list.
---

# Sync tasks to Relève

Private task app in this repo. You write via the HTTP API. The user checks items, due dates, and projects in the web UI.

## Setup

Read `APP_URL` and `AGENT_API_KEY` from `.env.local`. Never print the key.

Base URL: `$APP_URL` (local `http://localhost:3000`, production from Vercel).

All agent calls:

```
Authorization: Bearer $AGENT_API_KEY
Content-Type: application/json
```

If `APP_URL` is localhost, the Next.js dev server must be running.

## After a Granola meeting

1. Use Granola MCP (`query_granola_meetings` or `get_meetings`) to read notes/summary. Do not dump the full transcript unless needed.
2. Extract only **action items for the user** (not other attendees' work, not vague discussion).
3. Infer `project` (internal name) and `client` when obvious. Reuse existing project names from `GET /api/v1/projects`.
4. Due dates as `YYYY-MM-DD` when a date was said. Otherwise omit.
5. Ingest in one request:

```
POST $APP_URL/api/v1/ingest
{
  "source": "granola",
  "sourceRef": "<granola meeting id>",
  "sourceUrl": "<meeting url if any>",
  "meetingTitle": "<title>",
  "project": "<project name or omit>",
  "client": "<client name or omit>",
  "tasks": [
    { "title": "...", "dueDate": "2026-09-15", "notes": "optional" }
  ]
}
```

Duplicates for the same `source` + `sourceRef` + `title` are skipped. Re-running after the same meeting is safe.

## Other writes

- `GET /api/v1/tasks?status=open` — current list
- `POST /api/v1/tasks` — one task (`title`, `dueDate`, `project`, `client`, `notes`, `source`)
- `PATCH /api/v1/tasks/:id` — `{ "status": "done" }` or due date / project / title
- `POST /api/v1/projects` — `{ "name", "client", "color" }`
- `PATCH /api/v1/projects/:id` — rename, client, archive

Colors: `pine` `copper` `brass` `moss` `slate` `wine`.

## Rules

- Do not invent tasks. Quote the meeting, then write only clear next actions.
- Prefer updating an existing open task over creating a near-duplicate.
- French titles unless the meeting was in another language.
- After ingest, tell the user what was created vs skipped, with project/client and due dates.
