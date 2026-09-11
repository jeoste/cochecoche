import { getDb } from "@/db";
import { tasks } from "@/db/schema";
import { resolveAgentUserId, unauthorized } from "@/lib/agent";
import { ensureProject } from "@/lib/projects";
import { ingestInput } from "@/lib/validators";

export async function POST(request: Request) {
  const userId = await resolveAgentUserId(request);
  if (!userId) return unauthorized();
  const parsed = ingestInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const project = await ensureProject({
    userId,
    project: body.project,
    client: body.client,
  });
  const created = [];
  const skipped = [];
  for (const item of body.tasks) {
    const notes = [
      item.notes,
      body.meetingTitle ? `Réunion : ${body.meetingTitle}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    const [task] = await getDb()
      .insert(tasks)
      .values({
        userId,
        title: item.title,
        notes: notes || null,
        dueDate: item.dueDate ?? null,
        projectId: project?.id ?? null,
        source: body.source,
        sourceRef: body.sourceRef,
        sourceUrl: body.sourceUrl ?? null,
      })
      .onConflictDoNothing()
      .returning();
    if (task) created.push(task);
    else skipped.push(item.title);
  }
  return Response.json({
    created: created.length,
    skipped: skipped.length,
    tasks: created,
    skippedTitles: skipped,
    project,
  });
}
