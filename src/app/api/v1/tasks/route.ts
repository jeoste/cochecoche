import { isAgentRequest, unauthorized } from "@/lib/agent";
import { ensureProject } from "@/lib/projects";
import { getDeskData } from "@/lib/queries";
import { taskInput } from "@/lib/validators";
import { getDb } from "@/db";
import { tasks } from "@/db/schema";

export async function GET(request: Request) {
  if (!isAgentRequest(request)) return unauthorized();
  const { tasks: rows, projects } = await getDeskData();
  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const project = url.searchParams.get("project");
  const filtered = rows.filter((task) => {
    if (status && task.status !== status) return false;
    if (project) {
      const match = projects.find(
        (item) => item.name.toLowerCase() === project.toLowerCase(),
      );
      if (!match || task.projectId !== match.id) return false;
    }
    return true;
  });
  return Response.json({ tasks: filtered, projects });
}

export async function POST(request: Request) {
  if (!isAgentRequest(request)) return unauthorized();
  const parsed = taskInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;
  const project = await ensureProject({
    project: body.project,
    client: body.client,
    color: undefined,
  });
  const [task] = await getDb()
    .insert(tasks)
    .values({
      title: body.title,
      notes: body.notes ?? null,
      dueDate: body.dueDate ?? null,
      projectId: body.projectId ?? project?.id ?? null,
      source: body.source ?? "agent",
      sourceRef: body.sourceRef ?? null,
      sourceUrl: body.sourceUrl ?? null,
      status: body.status ?? "open",
    })
    .onConflictDoNothing()
    .returning();
  return Response.json({ task: task ?? null, skipped: !task }, { status: task ? 201 : 200 });
}
