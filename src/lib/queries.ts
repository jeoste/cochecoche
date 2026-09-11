import { and, asc, desc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { projects, tasks, type Project, type Task } from "@/db/schema";

export type DeskData = {
  projects: Project[];
  tasks: Task[];
};

export async function getDeskData(): Promise<DeskData> {
  const db = getDb();
  const [projectRows, taskRows] = await Promise.all([
    db.select().from(projects).orderBy(asc(projects.client), asc(projects.name)),
    db
      .select()
      .from(tasks)
      .orderBy(asc(tasks.status), asc(tasks.dueDate), desc(tasks.createdAt)),
  ]);
  return { projects: projectRows, tasks: taskRows };
}

export async function findProjectByName(name: string) {
  const db = getDb();
  const rows = await db.select().from(projects);
  const needle = name.trim().toLowerCase();
  return rows.find((row) => row.name.trim().toLowerCase() === needle) ?? null;
}

export async function getProject(id: string) {
  const db = getDb();
  const [row] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return row ?? null;
}

export async function getTask(id: string) {
  const db = getDb();
  const [row] = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
  return row ?? null;
}

export async function listOpenTasksForProject(projectId: string) {
  const db = getDb();
  return db
    .select()
    .from(tasks)
    .where(and(eq(tasks.projectId, projectId), ne(tasks.status, "done")));
}
