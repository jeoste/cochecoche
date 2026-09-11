import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { isAgentRequest, unauthorized } from "@/lib/agent";
import { getProject } from "@/lib/queries";
import { projectInput } from "@/lib/validators";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!isAgentRequest(request)) return unauthorized();
  const { id } = await context.params;
  const parsed = projectInput.partial().safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const existing = await getProject(id);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  const [project] = await getDb()
    .update(projects)
    .set({
      name: parsed.data.name ?? existing.name,
      client: parsed.data.client === undefined ? existing.client : parsed.data.client,
      color: parsed.data.color ?? existing.color,
      archived: parsed.data.archived ?? existing.archived,
    })
    .where(eq(projects.id, id))
    .returning();
  return Response.json({ project });
}
