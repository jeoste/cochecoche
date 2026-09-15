export const PROJECT_COLORS = [
  "pine",
  "copper",
  "brass",
  "moss",
  "slate",
  "wine",
] as const;

export type ProjectColor = (typeof PROJECT_COLORS)[number];

export type TaskStatus = "open" | "done";
export type TaskSource = "manual" | "granola" | "agent";

export type DueBucket = "overdue" | "today" | "week" | "later" | "none";

export function todayIso(now = new Date()) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDaysIso(iso: string, days: number) {
  const date = new Date(`${iso}T12:00:00`);
  date.setDate(date.getDate() + days);
  return todayIso(date);
}

export function dueBucket(dueDate: string | null, today = todayIso()): DueBucket {
  if (!dueDate) return "none";
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  if (dueDate <= addDaysIso(today, 7)) return "week";
  return "later";
}

export function formatDue(dueDate: string | null) {
  if (!dueDate) return "Sans date";
  const [y, m, d] = dueDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function formatDueShort(dueDate: string | null, today = todayIso()) {
  if (!dueDate) return null;
  if (dueDate === today) return "Auj.";
  if (dueDate === addDaysIso(today, 1)) return "Dem.";
  const [y, m, d] = dueDate.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
}

export function dueTone(
  dueDate: string | null,
  today = todayIso(),
): "overdue" | "today" | "soon" | "muted" {
  if (!dueDate) return "muted";
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  if (dueDate <= addDaysIso(today, 1)) return "soon";
  return "muted";
}

export function formatDayHeading(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const heading = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
  return heading.charAt(0).toUpperCase() + heading.slice(1);
}
