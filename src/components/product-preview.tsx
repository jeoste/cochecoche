import { Mark } from "@/components/mark";

const DEMO = [
  { title: "Relire le devis", due: "Auj.", dueClass: "text-[var(--due-today)]", project: "Studio Nord", color: "bg-[var(--swatch-moss)]" },
  { title: "Envoyer les accès Clerk", due: "Auj.", dueClass: "text-[var(--due-today)]", project: "CocheCoche", color: "bg-[var(--swatch-pine)]" },
  { title: "Appeler Marie", due: "15 sept.", dueClass: "text-primary", project: "Atelier Lumen", color: "bg-[var(--swatch-copper)]" },
  { title: "Préparer l’ingest Granola", due: "Dem.", dueClass: "text-[var(--due-today)]", project: "CocheCoche", color: "bg-[var(--swatch-pine)]" },
];

export function ProductPreview() {
  return (
    <div
      aria-hidden
      className="w-full min-w-0 max-w-[min(100%,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-border bg-background shadow-[0_12px_40px_rgba(32,32,32,0.08)]"
    >
      <div className="flex min-h-[420px] min-w-0">
        <aside className="hidden w-[200px] shrink-0 border-r border-border bg-sidebar p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <Mark className="size-6" />
            <span className="text-[13px] font-semibold">CocheCoche</span>
          </div>
          <p className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-muted-foreground">
            Boîte de réception
          </p>
          <p className="flex h-8 items-center gap-2 rounded-md bg-sidebar-accent px-2 text-[13px] font-medium">
            Aujourd’hui
            <span className="ml-auto text-[12px] text-muted-foreground">4</span>
          </p>
          <p className="flex h-8 items-center gap-2 rounded-md px-2 text-[13px] text-muted-foreground">
            À venir
          </p>
          <p className="mt-4 px-2 text-[11px] font-semibold text-muted-foreground">
            Mes projets
          </p>
          <p className="mt-1 flex h-8 items-center gap-2 px-2 text-[13px]">
            <span className="size-2.5 rounded-full bg-[var(--swatch-pine)]" />
            CocheCoche
          </p>
          <p className="flex h-8 items-center gap-2 px-2 text-[13px]">
            <span className="size-2.5 rounded-full bg-[var(--swatch-moss)]" />
            Studio Nord
          </p>
        </aside>
        <div className="min-w-0 flex-1 p-5">
          <p className="text-xl font-bold">Aujourd’hui</p>
          <p className="mt-0.5 text-sm text-muted-foreground">Mardi 15 septembre</p>
          <p className="mt-4 flex items-center gap-2 text-sm text-primary">
            <span className="flex size-[18px] items-center justify-center rounded-full border border-current text-[11px] leading-none">
              +
            </span>
            Ajouter une tâche
          </p>
          <p className="mt-5 text-[14px] font-bold">
            En retard <span className="ml-1 text-[12px] font-medium text-muted-foreground">1</span>
          </p>
          <DemoRow task={DEMO[2]} />
          {DEMO.filter((_, i) => i !== 2).map((task) => (
            <DemoRow key={task.title} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoRow({
  task,
}: {
  task: (typeof DEMO)[number];
}) {
  return (
    <div className="flex items-start gap-2.5 border-b border-border py-2.5">
      <span className="mt-0.5 size-[18px] shrink-0 rounded-full border-[1.5px] border-[#b8b8b8]" />
      <div className="min-w-0">
        <p className="text-[14px] leading-snug">{task.title}</p>
        <p className="mt-0.5 flex items-center gap-2 text-[12px]">
          <span className={task.dueClass}>{task.due}</span>
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <span className={`size-1.5 rounded-full ${task.color}`} />
            {task.project}
          </span>
        </p>
      </div>
    </div>
  );
}
