import { and, asc, desc, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { apiKeys, projects, tasks, type ApiKey, type Project, type Task } from "@/db/schema";

export type DeskData = {
  projects: Project[];
  tasks: Task[];
};

export async function getDeskData(userId: string): Promise<DeskData> {
  const db = getDb();
  const [projectRows, taskRows] = await Promise.all([
    db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .orderBy(asc(projects.client), asc(projects.name)),
    db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, userId))
      .orderBy(asc(tasks.status), asc(tasks.dueDate), desc(tasks.createdAt)),
  ]);
  return { projects: projectRows, tasks: taskRows };
}

export async function findProjectByName(userId: string, name: string) {
  const db = getDb();
  const rows = await db.select().from(projects).where(eq(projects.userId, userId));
  const needle = name.trim().toLowerCase();
  return rows.find((row) => row.name.trim().toLowerCase() === needle) ?? null;
}

export async function getProject(userId: string, id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function getTask(userId: string, id: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);
  return row ?? null;
}

export async function listOpenTasksForProject(userId: string, projectId: string) {
  const db = getDb();
  return db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.projectId, projectId),
        ne(tasks.status, "done"),
      ),
    );
}

export async function listApiKeys(userId: string): Promise<ApiKey[]> {
  return getDb()
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.userId, userId))
    .orderBy(desc(apiKeys.createdAt));
}
