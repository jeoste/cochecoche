import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { isAgentRequest, unauthorized } from "@/lib/agent";
import { getDeskData } from "@/lib/queries";
import { projectInput } from "@/lib/validators";

export async function GET(request: Request) {
  if (!isAgentRequest(request)) return unauthorized();
  const { projects: rows } = await getDeskData();
  return Response.json({ projects: rows });
}

export async function POST(request: Request) {
  if (!isAgentRequest(request)) return unauthorized();
  const parsed = projectInput.safeParse(await request.json());
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const [project] = await getDb()
    .insert(projects)
    .values({
      name: parsed.data.name,
      client: parsed.data.client ?? null,
      color: parsed.data.color ?? "pine",
    })
    .returning();
  return Response.json({ project }, { status: 201 });
}
