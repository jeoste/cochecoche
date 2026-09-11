import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { tasks } from "@/db/schema";
import { resolveAgentUserId, unauthorized } from "@/lib/agent";
import { ensureProject } from "@/lib/projects";
import { getTask } from "@/lib/queries";
import { taskPatch } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  const userId = await resolveAgentUserId(request);
  if (!userId) return unauthorized();
  const { id } = await context.params;
  const task = await getTask(userId, id);
  if (!task) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ task });
}

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await resolveAgentUserId(request);
  if (!userId) return unauthorized();
  const { id } = await context.params;
  const parsed = taskPatch.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const project = await ensureProject({
    userId,
    project: body.project,
    client: body.client,
  });
  const patch: Partial<typeof tasks.$inferInsert> = { updatedAt: new Date() };
  if (body.title !== undefined) patch.title = body.title;
  if (body.notes !== undefined) patch.notes = body.notes;
  if (body.dueDate !== undefined) patch.dueDate = body.dueDate;
  if (body.status !== undefined) {
    patch.status = body.status;
    patch.completedAt = body.status === "done" ? new Date() : null;
  }
  if (body.projectId !== undefined) patch.projectId = body.projectId;
  else if (project) patch.projectId = project.id;
  if (body.sourceRef !== undefined) patch.sourceRef = body.sourceRef;
  if (body.sourceUrl !== undefined) patch.sourceUrl = body.sourceUrl;
  const [task] = await getDb()
    .update(tasks)
    .set(patch)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();
  if (!task) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ task });
}

export async function DELETE(request: Request, context: RouteContext) {
  const userId = await resolveAgentUserId(request);
  if (!userId) return unauthorized();
  const { id } = await context.params;
  const [task] = await getDb()
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();
  if (!task) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json({ ok: true });
}
