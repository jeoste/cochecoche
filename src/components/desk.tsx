"use client";

import { useMemo, useState, useTransition } from "react";
import {
  CalendarDaysIcon,
  CalendarIcon,
  InboxIcon,
  MenuIcon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react";
import type { Project, Task } from "@/db/schema";
import { Button } from "@/components/ui/button";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  archiveProjectAction,
  createProjectAction,
  createTaskAction,
  deleteTaskAction,
  toggleTaskAction,
  updateTaskAction,
} from "@/lib/actions";
import { AccountMenu } from "@/components/account-menu";
import { Mark } from "@/components/mark";
import { TaskCheck } from "@/components/task-check";
import {
  PROJECT_COLORS,
  dueBucket,
  dueTone,
  formatDayHeading,
  formatDueShort,
  todayIso,
} from "@/lib/dates";
import { cn } from "@/lib/utils";

const SWATCH: Record<string, string> = {
  pine: "bg-[var(--swatch-pine)]",
  copper: "bg-[var(--swatch-copper)]",
  brass: "bg-[var(--swatch-brass)]",
  moss: "bg-[var(--swatch-moss)]",
  slate: "bg-[var(--swatch-slate)]",
  wine: "bg-[var(--swatch-wine)]",
};

const TONE: Record<ReturnType<typeof dueTone>, string> = {
  overdue: "text-primary",
  today: "text-[var(--due-today)]",
  soon: "text-[var(--due-today)]",
  muted: "text-muted-foreground",
};

type Filter = "today" | "inbox" | "upcoming" | string;

export function Desk({
  projects,
  tasks,
}: {
  projects: Project[];
  tasks: Task[];
}) {
  const [filter, setFilter] = useState<Filter>("today");
  const [showDone, setShowDone] = useState(false);
  const [pending, startTransition] = useTransition();
  const [browseOpen, setBrowseOpen] = useState(false);
  const today = todayIso();
  const activeProjects = projects.filter((project) => !project.archived);

  const openTasks = tasks.filter((task) => task.status === "open");
  const inboxCount = openTasks.filter((task) => !task.projectId).length;
  const todayCount = openTasks.filter((task) => {
    const bucket = dueBucket(task.dueDate, today);
    return bucket === "overdue" || bucket === "today";
  }).length;
  const upcomingCount = openTasks.filter((task) => {
    const bucket = dueBucket(task.dueDate, today);
    return bucket === "week" || bucket === "later";
  }).length;

  const visible = useMemo(() => {
    return tasks.filter((task) => {
      if (!showDone && task.status === "done") return false;
      if (filter === "inbox") return !task.projectId;
      if (filter === "today") {
        const bucket = dueBucket(task.dueDate, today);
        return bucket === "overdue" || bucket === "today";
      }
      if (filter === "upcoming") {
        const bucket = dueBucket(task.dueDate, today);
        return bucket === "week" || bucket === "later";
      }
      return task.projectId === filter;
    });
  }, [tasks, filter, showDone, today]);

  const openVisible = visible.filter((task) => task.status === "open");
  const doneTasks = visible.filter((task) => task.status === "done");
  const overdue = openVisible.filter(
    (task) => dueBucket(task.dueDate, today) === "overdue",
  );
  const restOpen = openVisible.filter(
    (task) => dueBucket(task.dueDate, today) !== "overdue",
  );

  const upcomingGroups = useMemo(() => {
    if (filter !== "upcoming") return [];
    const map = new Map<string, Task[]>();
    for (const task of restOpen) {
      const key = task.dueDate ?? "";
      const list = map.get(key) ?? [];
      list.push(task);
      map.set(key, list);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [filter, restOpen]);

  const selected = activeProjects.find((project) => project.id === filter);
  const title = selected
    ? selected.name
    : filter === "inbox"
      ? "Boîte de réception"
      : filter === "upcoming"
        ? "À venir"
        : "Aujourd’hui";

  function choose(next: Filter) {
    setFilter(next);
    setBrowseOpen(false);
  }

  const nav = (
    <Nav
      filter={filter}
      inboxCount={inboxCount}
      todayCount={todayCount}
      upcomingCount={upcomingCount}
      projects={activeProjects}
      openTasks={openTasks}
      onChoose={choose}
    />
  );

  return (
    <div className="flex min-h-full flex-1">
      <aside className="hidden w-[280px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex items-center gap-2.5 px-4 pt-5 pb-4">
          <Mark className="size-7" />
          <div className="min-w-0">
            <p className="truncate text-[15px] font-semibold tracking-tight">
              CocheCoche
            </p>
            <p className="text-[11px] text-muted-foreground">
              {openTasks.length} ouvertes
            </p>
          </div>
        </div>
        {nav}
        <div className="mt-auto flex flex-col gap-1 border-t border-sidebar-border p-3">
          <ProjectDialog />
          <AccountMenu />
        </div>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <div className="flex items-center justify-between gap-3 px-4 pt-4 md:hidden">
          <div className="flex items-center gap-2">
            <Mark className="size-7" />
            <p className="text-[15px] font-semibold">CocheCoche</p>
          </div>
          <AccountMenu compact />
        </div>

        <header className="flex items-end justify-between gap-4 px-4 pt-5 pb-3 sm:px-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {selected?.client ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {selected.client}
              </p>
            ) : filter === "today" ? (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {formatDayHeading(today)}
              </p>
            ) : null}
          </div>
          {selected ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() => void archiveProjectAction(selected.id)}
            >
              Archiver
            </Button>
          ) : null}
        </header>

        <div className="flex flex-1 flex-col px-2 sm:px-8">
          <QuickAdd
            projects={activeProjects}
            defaultProjectId={
              filter !== "today" && filter !== "inbox" && filter !== "upcoming"
                ? filter
                : ""
            }
            defaultDue={filter === "today" ? today : ""}
          />

          {filter === "today" && overdue.length ? (
            <TaskSection
              label="En retard"
              count={overdue.length}
              tasks={overdue}
              projects={activeProjects}
              pending={pending}
              startTransition={startTransition}
            />
          ) : null}

          {filter === "upcoming"
            ? upcomingGroups.map(([iso, rows]) => (
                <TaskSection
                  key={iso}
                  label={formatDayHeading(iso)}
                  count={rows.length}
                  tasks={rows}
                  projects={activeProjects}
                  pending={pending}
                  startTransition={startTransition}
                />
              ))
            : filter === "today"
              ? restOpen.length
                ? (
                    <TaskSection
                      tasks={restOpen}
                      projects={activeProjects}
                      pending={pending}
                      startTransition={startTransition}
                    />
                  )
                : null
              : openVisible.length
                ? (
                    <TaskSection
                      tasks={openVisible}
                      projects={activeProjects}
                      pending={pending}
                      startTransition={startTransition}
                    />
                  )
                : null}

          {!openVisible.length ? (
            <p className="px-3 py-12 text-center text-sm text-muted-foreground">
              {filter === "today"
                ? "Rien pour aujourd’hui. Ajoute une tâche ou laisse un agent en déposer une."
                : "Aucune tâche ici. Ajoute-en une, ou un agent peut écrire depuis Granola."}
            </p>
          ) : null}

          {doneTasks.length ? (
            showDone ? (
              <TaskSection
                label="Terminées"
                tasks={doneTasks}
                projects={activeProjects}
                pending={pending}
                startTransition={startTransition}
                faded
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowDone(true)}
                className="mt-4 px-3 py-2 text-left text-sm text-muted-foreground hover:text-foreground"
              >
                Afficher les tâches accomplies ({doneTasks.length})
              </button>
            )
          ) : null}
        </div>
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border bg-background md:hidden">
        <TabButton
          active={filter === "inbox"}
          icon={<InboxIcon className="size-5" />}
          label="Boîte"
          onClick={() => choose("inbox")}
        />
        <TabButton
          active={filter === "today"}
          icon={<CalendarIcon className="size-5" />}
          label="Aujourd’hui"
          onClick={() => choose("today")}
        />
        <TabButton
          active={filter === "upcoming"}
          icon={<CalendarDaysIcon className="size-5" />}
          label="À venir"
          onClick={() => choose("upcoming")}
        />
        <Sheet open={browseOpen} onOpenChange={setBrowseOpen}>
          <SheetTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[10px]",
                selected ? "text-primary" : "text-muted-foreground",
              )}
            >
              <MenuIcon className="size-5" />
              Parcourir
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="max-h-[80vh] gap-0">
            <SheetHeader>
              <SheetTitle>Parcourir</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto pb-6">
              {nav}
              <div className="px-2 pt-3">
                <ProjectDialog />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

function Nav({
  filter,
  inboxCount,
  todayCount,
  upcomingCount,
  projects,
  openTasks,
  onChoose,
}: {
  filter: Filter;
  inboxCount: number;
  todayCount: number;
  upcomingCount: number;
  projects: Project[];
  openTasks: Task[];
  onChoose: (filter: Filter) => void;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-0.5 px-2">
      <NavItem
        active={filter === "inbox"}
        icon={<InboxIcon className="size-4" />}
        count={inboxCount}
        onClick={() => onChoose("inbox")}
      >
        Boîte de réception
      </NavItem>
      <NavItem
        active={filter === "today"}
        icon={<CalendarIcon className="size-4" />}
        count={todayCount}
        onClick={() => onChoose("today")}
      >
        Aujourd’hui
      </NavItem>
      <NavItem
        active={filter === "upcoming"}
        icon={<CalendarDaysIcon className="size-4" />}
        count={upcomingCount}
        onClick={() => onChoose("upcoming")}
      >
        À venir
      </NavItem>
      <p className="mt-4 mb-1 px-2 text-[12px] font-semibold text-muted-foreground">
        Mes projets
      </p>
      {projects.map((project) => (
        <NavItem
          key={project.id}
          active={filter === project.id}
          icon={
            <span
              className={cn(
                "size-2.5 rounded-full",
                SWATCH[project.color] ?? SWATCH.pine,
              )}
            />
          }
          count={openTasks.filter((task) => task.projectId === project.id).length}
          onClick={() => onChoose(project.id)}
        >
          <span className="min-w-0 truncate">
            {project.name}
            {project.client ? (
              <span className="ml-1 text-muted-foreground">{project.client}</span>
            ) : null}
          </span>
        </NavItem>
      ))}
    </nav>
  );
}

function NavItem({
  active,
  icon,
  count,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] transition-colors",
        active
          ? "bg-sidebar-accent font-medium"
          : "hover:bg-sidebar-accent/70",
      )}
    >
      <span className="flex size-4 items-center justify-center text-muted-foreground">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      {count ? (
        <span className="tabular-nums text-[12px] text-muted-foreground">
          {count}
        </span>
      ) : null}
    </button>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2 text-[10px]",
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function TaskSection({
  label,
  count,
  tasks,
  projects,
  pending,
  startTransition,
  faded,
}: {
  label?: string;
  count?: number;
  tasks: Task[];
  projects: Project[];
  pending: boolean;
  startTransition: React.TransitionStartFunction;
  faded?: boolean;
}) {
  return (
    <section className="mt-2">
      {label ? (
        <h2 className="flex items-baseline gap-2 px-3 pt-4 pb-1 text-[14px] font-bold">
          {label}
          {count != null ? (
            <span className="text-[12px] font-medium text-muted-foreground">
              {count}
            </span>
          ) : null}
        </h2>
      ) : null}
      <ul className={faded ? "opacity-60" : undefined}>
        {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            projects={projects}
            pending={pending}
            startTransition={startTransition}
          />
        ))}
      </ul>
    </section>
  );
}

function QuickAdd({
  projects,
  defaultProjectId,
  defaultDue,
}: {
  projects: Project[];
  defaultProjectId: string;
  defaultDue: string;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-primary transition-colors hover:bg-primary/5"
      >
        <span className="flex size-[18px] items-center justify-center rounded-full border border-current">
          <PlusIcon className="size-3 stroke-[2.5]" />
        </span>
        Ajouter une tâche
      </button>
    );
  }

  return (
    <form
      action={createTaskAction}
      className="mx-1 rounded-lg border border-border bg-card p-3 shadow-sm"
    >
      <Input
        name="title"
        placeholder="Nom de la tâche"
        required
        autoFocus
        className="h-8 border-0 px-0 text-[15px] shadow-none focus-visible:ring-0"
      />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Input
          name="dueDate"
          type="date"
          defaultValue={defaultDue}
          className="h-8 w-auto"
        />
        {defaultProjectId ? (
          <input type="hidden" name="projectId" value={defaultProjectId} />
        ) : (
          <select
            name="projectId"
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm"
            defaultValue=""
          >
            <option value="">Boîte de réception</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.client ? `${project.client} · ` : ""}
                {project.name}
              </option>
            ))}
          </select>
        )}
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
          >
            Annuler
          </Button>
          <Button type="submit" size="sm">
            Ajouter
          </Button>
        </div>
      </div>
    </form>
  );
}

function TaskRow({
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
  const short = formatDueShort(task.dueDate);
  const tone = dueTone(task.dueDate);

  return (
    <li className="group flex items-start gap-2.5 border-b border-border px-3 py-2.5 hover:bg-muted/80">
      <TaskCheck
        checked={task.status === "done"}
        disabled={pending}
        onCheckedChange={(value) => {
          startTransition(() => {
            void toggleTaskAction(task.id, value === true);
          });
        }}
      />
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "text-[14px] leading-snug",
            task.status === "done" && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]">
          {short ? <span className={TONE[tone]}>{short}</span> : null}
          {project ? (
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  SWATCH[project.color] ?? SWATCH.pine,
                )}
              />
              {project.client ? `${project.client} · ` : ""}
              {project.name}
            </span>
          ) : null}
          {task.source === "granola" ? (
            <span className="text-muted-foreground">Granola</span>
          ) : null}
        </div>
        {task.notes ? (
          <p className="mt-1 line-clamp-2 text-[12px] text-muted-foreground">
            {task.notes}
          </p>
        ) : null}
      </div>
      <div className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
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
        <Button variant="ghost" size="icon-xs" className="text-muted-foreground">
          <MoreHorizontalIcon />
          <span className="sr-only">Modifier</span>
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
              onValueChange={(value) =>
                setProjectId(value === "none" ? "" : value)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Aucun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Boîte de réception</SelectItem>
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
              className="min-h-24 rounded-md border border-input bg-transparent px-2.5 py-2 text-sm"
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
        <Button variant="ghost" className="w-full justify-start text-muted-foreground">
          <PlusIcon />
          Ajouter un projet
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
          <fieldset className="flex flex-col gap-2">
            <Label>Couleur</Label>
            <div className="flex flex-wrap gap-2">
              {PROJECT_COLORS.map((color, index) => (
                <label key={color} className="cursor-pointer">
                  <input
                    type="radio"
                    name="color"
                    value={color}
                    defaultChecked={index === 0}
                    className="peer sr-only"
                  />
                  <span
                    className={cn(
                      "block size-6 rounded-full ring-offset-2 peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-checked:ring-2 peer-checked:ring-foreground",
                      SWATCH[color],
                    )}
                  />
                  <span className="sr-only">{color}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <DialogFooter>
            <Button type="submit">Créer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
