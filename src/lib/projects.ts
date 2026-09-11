import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { projects } from "@/db/schema";
import { PROJECT_COLORS } from "@/lib/dates";
import { findProjectByName } from "@/lib/queries";

export async function ensureProject(input: {
  project?: string | null;
  client?: string | null;
  color?: string | null;
}) {
  const name = input.project?.trim();
  if (!name) return null;
  const existing = await findProjectByName(name);
  if (existing) {
    if (input.client && !existing.client) {
      const [updated] = await getDb()
        .update(projects)
        .set({ client: input.client.trim() })
        .where(eq(projects.id, existing.id))
        .returning();
      return updated ?? existing;
    }
    return existing;
  }
  const color = PROJECT_COLORS.includes(
    input.color as (typeof PROJECT_COLORS)[number],
  )
    ? input.color!
    : "pine";
  const [created] = await getDb()
    .insert(projects)
    .values({
      name,
      client: input.client?.trim() || null,
      color,
    })
    .returning();
  return created;
}
