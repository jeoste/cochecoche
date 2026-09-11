"use client";

import { useMemo, useState, useTransition } from "react";
import { PlusIcon } from "lucide-react";
import type { Project, Task } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  archiveProjectAction,
  createProjectAction,
  createTaskAction,
  deleteTaskAction,
  logoutAction,
  toggleTaskAction,
  updateTaskAction,
} from "@/lib/actions";
import {
  PROJECT_COLORS,
  dueBucket,
  formatDue,
  todayIso,
  type DueBucket,
} from "@/lib/dates";

const BUCKETS: { id: DueBucket; label: string }[] = [
  { id: "overdue", label: "En retard" },
  { id: "today", label: "Aujourd’hui" },
  { id: "week", label: "Cette semaine" },
  { id: "later", label: "Plus tard" },
  { id: "none", label: "Sans date" },
];

const SWATCH: Record<string, string> = {
  pine: "bg-[var(--swatch-pine)]",
  copper: "bg-[var(--swatch-copper)]",
  brass: "bg-[var(--swatch-brass)]",
  moss: "bg-[var(--swatch-moss)]",
  slate: "bg-[var(--swatch-slate)]",
  wine: "bg-[var(--swatch-wine)]",
};

type Filter = "all" | "inbox" | string;

export function Desk({
  projects,
  tasks,
}: {
  projects: Project[];
  tasks: Task[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [showDone, setShowDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const today = todayIso();
  const activeProjects = projects.filter((project) => !project.archived);

  const visible = useMemo(() => {
    return tasks.filter((task) => {
      if (!showDone && task.status === "done") return false;
      if (filter === "inbox") return !task.projectId;
      if (filter !== "all") return task.projectId === filter;
      return true;
    });
  }, [tasks, filter, showDone]);

  const grouped = useMemo(() => {
    const map: Record<DueBucket, Task[]> = {
      overdue: [],
      today: [],
      week: [],
      later: [],
      none: [],
    };
    for (const task of visible) {
      if (task.status === "done") continue;
      map[dueBucket(task.dueDate, today)].push(task);
    }
    return map;
  }, [visible, today]);

  const doneTasks = visible.filter((task) => task.status === "done");
  const openCount = tasks.filter((task) => task.status === "open").length;
  const selected = activeProjects.find((project) => project.id === filter);

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground md:flex">
        <div className="px-5 pt-6 pb-4">
          <p className="font-heading text-[11px] tracking-[0.22em] text-sidebar-primary uppercase">
            Après la réunion
          </p>
          <h1 className="font-heading mt-2 text-3xl leading-none">Relève</h1>
          <p className="mt-2 font-mono text-xs text-sidebar-foreground/70">
            {openCount} ouvertes
          </p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            Toutes
          </FilterButton>
          <FilterButton
            active={filter === "inbox"}
            onClick={() => setFilter("inbox")}
          >
            Sans projet
          </FilterButton>
          <p className="mt-4 mb-1 px-2 font-mono text-[10px] tracking-[0.18em] text-sidebar-foreground/50 uppercase">
            Projets / clients
          </p>
          {activeProjects.map((project) => (
            <FilterButton
              key={project.id}
              active={filter === project.id}
              onClick={() => setFilter(project.id)}
            >
              <span
                className={`size-2.5 rounded-full ${SWATCH[project.color] ?? SWATCH.pine}`}
              />
              <span className="min-w-0 truncate">
                {project.name}
                {project.client ? (
                  <span className="block truncate text-[11px] text-sidebar-foreground/55">
                    {project.client}
                  </span>
                ) : null}
              </span>
            </FilterButton>
          ))}
        </nav>
        <div className="flex flex-col gap-2 p-4">
          <ProjectDialog />
          <form action={logoutAction}>
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground/70"
            >
              Quitter
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-8">
        <div className="mb-4 md:hidden">
          <select
            className="h-9 w-full rounded-lg border border-input bg-card px-2 text-sm"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">Toutes</option>
            <option value="inbox">Sans projet</option>
            {activeProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.client ? `${project.client} · ` : ""}
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-primary uppercase">
              {new Intl.DateTimeFormat("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              }).format(new Date())}
            </p>
            <h2 className="font-heading mt-1 text-3xl">
              {selected
                ? selected.name
                : filter === "inbox"
                  ? "Sans projet"
                  : "À faire"}
            </h2>
            {selected?.client ? (
              <p className="text-sm text-muted-foreground">{selected.client}</p>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={showDone}
              onCheckedChange={(value) => setShowDone(value === true)}
            />
            Terminées
          </label>
        </header>

        <QuickAdd
          projects={activeProjects}
          defaultProjectId={filter !== "all" && filter !== "inbox" ? filter : ""}
        />

        <div className="mt-8 flex flex-col gap-8">
          {BUCKETS.map((bucket) => {
            const rows = grouped[bucket.id];
            if (!rows.length) return null;
            return (
              <section key={bucket.id}>
                <h3 className="font-mono mb-3 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                  {bucket.label}
                  <span className="ml-2 text-primary">{rows.length}</span>
                </h3>
                <ul className="flex flex-col gap-2">
                  {rows.map((task) => (
                    <TaskTicket
                      key={task.id}
                      task={task}
                      projects={activeProjects}
                      pending={pending}
                      startTransition={startTransition}
                    />
                  ))}
                </ul>
              </section>
            );
          })}

          {!visible.filter((task) => task.status === "open").length ? (
            <p className="rounded-xl border border-dashed border-border px-5 py-10 text-center text-sm text-muted-foreground">
              Rien en attente. Un agent peut déposer des tâches depuis Granola.
            </p>
          ) : null}

          {showDone && doneTasks.length ? (
            <section>
              <h3 className="font-mono mb-3 text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
                Terminées
              </h3>
              <ul className="flex flex-col gap-2 opacity-70">
                {doneTasks.map((task) => (
                  <TaskTicket
                    key={task.id}
                    task={task}
                    projects={activeProjects}
                    pending={pending}
                    startTransition={startTransition}
                  />
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        {selected ? (
          <div className="mt-auto pt-10">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => void archiveProjectAction(selected.id)}
            >
              Archiver ce projet
            </Button>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
        active
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "hover:bg-sidebar-accent/60"
      }`}
    >
      {children}
    </button>
  );
}

function QuickAdd({
  projects,
  defaultProjectId,
}: {
  projects: Project[];
  defaultProjectId: string;
}) {
  return (
    <form
      action={createTaskAction}
      className="ticket flex flex-col gap-3 rounded-xl border border-border bg-card p-3 pl-5 sm:flex-row sm:items-center"
    >
      <Input
        name="title"
        placeholder="Nouvelle tâche"
        required
        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
      <Input name="dueDate" type="date" className="w-full sm:w-40" />
      {defaultProjectId ? (
        <input type="hidden" name="projectId" value={defaultProjectId} />
      ) : (
        <select
          name="projectId"
          className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
          defaultValue=""
        >
          <option value="">Projet</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.client ? `${project.client} · ` : ""}
              {project.name}
            </option>
          ))}
        </select>
      )}
      <Button type="submit" size="sm">
        Ajouter
      </Button>
    </form>
  );
}

function TaskTicket({
  task,
  projects,
  pending,
  startTransition,
}: {
  task: Task;
  projects: Project[];
  pending: boolean;
  startTransition: React.TransitionStartFunction;
}) {
  const project = projects.find((item) => item.id === task.projectId);
  const late = dueBucket(task.dueDate) === "overdue" && task.status === "open";

  return (
    <li className="ticket rounded-xl border border-border bg-card p-3 pl-5">
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.status === "done"}
          disabled={pending}
          className="mt-1"
          onCheckedChange={(value) => {
            startTransition(() => {
              void toggleTaskAction(task.id, value === true);
            });
          }}
        />
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm leading-snug ${task.status === "done" ? "text-muted-foreground line-through" : ""}`}
          >
            {task.title}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <span className={late ? "text-primary" : ""}>
              {formatDue(task.dueDate)}
            </span>
            {project ? (
              <span className="inline-flex items-center gap-1">
                <span
                  className={`size-1.5 rounded-full ${SWATCH[project.color] ?? SWATCH.pine}`}
                />
                {project.client ? `${project.client} · ` : ""}
                {project.name}
              </span>
            ) : null}
            {task.source === "granola" ? <span>Granola</span> : null}
          </div>
          {task.notes ? (
            <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
              {task.notes}
            </p>
          ) : null}
        </div>
        <TaskEditor task={task} projects={projects} />
      </div>
    </li>
  );
}

function TaskEditor({ task, projects }: { task: Task; projects: Project[] }) {
  const [projectId, setProjectId] = useState(task.projectId ?? "");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="xs">
          Éditer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={updateTaskAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Tâche</DialogTitle>
            <DialogDescription>Date, projet, notes.</DialogDescription>
          </DialogHeader>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="projectId" value={projectId} />
          <div className="flex flex-col gap-2">
            <Label htmlFor={`title-${task.id}`}>Titre</Label>
            <Input
              id={`title-${task.id}`}
              name="title"
              defaultValue={task.title}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`due-${task.id}`}>Échéance</Label>
            <Input
              id={`due-${task.id}`}
              name="dueDate"
              type="date"
              defaultValue={task.dueDate ?? ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Projet</Label>
            <Select
              value={projectId || "none"}
              onValueChange={(value) => setProjectId(value === "none" ? "" : value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sans projet</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.client ? `${project.client} · ` : ""}
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={`notes-${task.id}`}>Notes</Label>
            <textarea
              id={`notes-${task.id}`}
              name="notes"
              defaultValue={task.notes ?? ""}
              className="min-h-24 rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void deleteTaskAction(task.id)}
            >
              Supprimer
            </Button>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProjectDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <PlusIcon />
          Projet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form action={createProjectAction} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Nouveau projet</DialogTitle>
            <DialogDescription>Nom interne et client associé.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-name">Projet</Label>
            <Input id="project-name" name="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-client">Client</Label>
            <Input id="project-client" name="client" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="project-color">Couleur</Label>
            <select
              id="project-color"
              name="color"
              defaultValue="pine"
              className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
            >
              {PROJECT_COLORS.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
