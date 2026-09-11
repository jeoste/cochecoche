import { z } from "zod";

export const projectInput = z.object({
  name: z.string().trim().min(1).max(120),
  client: z.string().trim().max(120).nullable().optional(),
  color: z.string().trim().max(32).optional(),
  archived: z.boolean().optional(),
});

export const taskInput = z.object({
  title: z.string().trim().min(1).max(300),
  notes: z.string().trim().max(4000).nullable().optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
  projectId: z.string().uuid().nullable().optional(),
  project: z.string().trim().max(120).optional(),
  client: z.string().trim().max(120).optional(),
  status: z.enum(["open", "done"]).optional(),
  source: z.enum(["manual", "granola", "agent"]).optional(),
  sourceRef: z.string().trim().max(200).nullable().optional(),
  sourceUrl: z.string().url().nullable().optional(),
});

export const taskPatch = taskInput.partial().extend({
  id: z.string().uuid().optional(),
});

export const ingestTask = z.object({
  title: z.string().trim().min(1).max(300),
  notes: z.string().trim().max(4000).optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .nullable()
    .optional(),
});

export const ingestInput = z.object({
  source: z.enum(["granola", "agent"]).default("agent"),
  sourceRef: z.string().trim().min(1).max(200),
  sourceUrl: z.string().url().optional(),
  meetingTitle: z.string().trim().max(200).optional(),
  project: z.string().trim().min(1).max(120).optional(),
  client: z.string().trim().max(120).optional(),
  tasks: z.array(ingestTask).min(1).max(50),
});
