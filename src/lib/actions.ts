"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/db";
import { apiKeys, projects, tasks } from "@/db/schema";
import { requireUserId } from "@/lib/auth";
import { generateAgentKey, hashToken, keyPrefix } from "@/lib/crypto";
import { PROJECT_COLORS } from "@/lib/dates";
import { findProjectByName, getProject } from "@/lib/queries";

export async function createProjectAction(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "pine");
  if (!name) return;
  const existing = await findProjectByName(userId, name);
  if (existing) return;
  await getDb()
    .insert(projects)
    .values({
      userId,
      name,
      client,
      color: PROJECT_COLORS.includes(color as (typeof PROJECT_COLORS)[number])
        ? color
        : "pine",
    });
  revalidatePath("/");
}

export async function createTaskAction(formData: FormData) {
  const userId = await requireUserId();
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const projectId = await ownedProjectId(userId, formData);
  if (!title) return;
  await getDb().insert(tasks).values({
    userId,
    title,
    dueDate,
    projectId,
    source: "manual",
  });
  revalidatePath("/");
}

export async function toggleTaskAction(taskId: string, done: boolean) {
  const userId = await requireUserId();
  await getDb()
    .update(tasks)
    .set({
      status: done ? "done" : "open",
      completedAt: done ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidatePath("/");
}

export async function updateTaskAction(formData: FormData) {
  const userId = await requireUserId();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const projectId = await ownedProjectId(userId, formData);
  await getDb()
    .update(tasks)
    .set({
      title: title || undefined,
      notes,
      dueDate,
      projectId,
      updatedAt: new Date(),
    })
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)));
  revalidatePath("/");
}

export async function deleteTaskAction(taskId: string) {
  const userId = await requireUserId();
  await getDb()
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, userId)));
  revalidatePath("/");
}

export async function archiveProjectAction(projectId: string) {
  const userId = await requireUserId();
  await getDb()
    .update(projects)
    .set({ archived: true })
    .where(and(eq(projects.id, projectId), eq(projects.userId, userId)));
  revalidatePath("/");
}

export async function createApiKeyAction(formData: FormData) {
  const userId = await requireUserId();
  const name = String(formData.get("name") ?? "Agent").trim() || "Agent";
  const token = generateAgentKey();
  await getDb().insert(apiKeys).values({
    userId,
    name,
    keyHash: hashToken(token),
    keyPrefix: keyPrefix(token),
  });
  revalidatePath("/");
  return { token };
}

export async function revokeApiKeyAction(id: string) {
  const userId = await requireUserId();
  await getDb()
    .delete(apiKeys)
    .where(and(eq(apiKeys.id, id), eq(apiKeys.userId, userId)));
  revalidatePath("/");
}

async function ownedProjectId(userId: string, formData: FormData) {
  const value = String(formData.get("projectId") ?? "").trim();
  if (!value || value === "none") return null;
  const project = await getProject(userId, value);
  return project?.id ?? null;
}
