"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { projects, tasks } from "@/db/schema";
import {
  SESSION_COOKIE,
  getSession,
  passwordMatches,
  signSession,
} from "@/lib/auth";
import { PROJECT_COLORS } from "@/lib/dates";
import { findProjectByName } from "@/lib/queries";

async function requireUser() {
  if (!(await getSession())) {
    redirect("/login");
  }
}

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password)) {
    return { error: "Mot de passe incorrect." as const };
  }
  const store = await cookies();
  store.set(SESSION_COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/login");
}

export async function createProjectAction(formData: FormData) {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const client = String(formData.get("client") ?? "").trim() || null;
  const color = String(formData.get("color") ?? "pine");
  if (!name) return;
  const existing = await findProjectByName(name);
  if (existing) return;
  await getDb()
    .insert(projects)
    .values({
      name,
      client,
      color: PROJECT_COLORS.includes(color as (typeof PROJECT_COLORS)[number])
        ? color
        : "pine",
    });
  revalidatePath("/");
}

export async function createTaskAction(formData: FormData) {
  await requireUser();
  const title = String(formData.get("title") ?? "").trim();
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const projectId = readProjectId(formData);
  if (!title) return;
  await getDb().insert(tasks).values({
    title,
    dueDate,
    projectId,
    source: "manual",
  });
  revalidatePath("/");
}

export async function toggleTaskAction(taskId: string, done: boolean) {
  await requireUser();
  await getDb()
    .update(tasks)
    .set({
      status: done ? "done" : "open",
      completedAt: done ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId));
  revalidatePath("/");
}

export async function updateTaskAction(formData: FormData) {
  await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const title = String(formData.get("title") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;
  const projectId = readProjectId(formData);
  await getDb()
    .update(tasks)
    .set({
      title: title || undefined,
      notes,
      dueDate,
      projectId,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));
  revalidatePath("/");
}

export async function deleteTaskAction(taskId: string) {
  await requireUser();
  await getDb().delete(tasks).where(eq(tasks.id, taskId));
  revalidatePath("/");
}

function readProjectId(formData: FormData) {
  const value = String(formData.get("projectId") ?? "").trim();
  if (!value || value === "none") return null;
  return value;
}

export async function archiveProjectAction(projectId: string) {
  await requireUser();
  await getDb()
    .update(projects)
    .set({ archived: true })
    .where(and(eq(projects.id, projectId)));
  revalidatePath("/");
}
