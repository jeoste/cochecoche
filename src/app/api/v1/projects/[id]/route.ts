import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { resolveAgentUserId, unauthorized } from "@/lib/agent";
import { getProject } from "@/lib/queries";
import { projectInput } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const userId = await resolveAgentUserId(request);
  if (!userId) return unauthorized();
  const { id } = await context.params;
  const parsed = projectInput.partial().safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const existing = await getProject(userId, id);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  const [project] = await getDb()
    .update(projects)
    .set({
      name: parsed.data.name ?? existing.name,
      client: parsed.data.client === undefined ? existing.client : parsed.data.client,
      color: parsed.data.color ?? existing.color,
      archived: parsed.data.archived ?? existing.archived,
    })
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning();
  return Response.json({ project });
}
