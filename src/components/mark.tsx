import { cn } from "@/lib/utils";

export function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn(className)}
      aria-hidden
      focusable="false"
    >
      <rect width="32" height="32" rx="8" fill="#DC4C3E" />
      <path
        d="M8.4 16.4 13.2 21.6 23.8 9.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({
  className,
  markClassName,
}: {
  className?: string;
  markClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Mark className={markClassName ?? "size-[1.15em] shrink-0"} />
      <span className="font-heading leading-none">CocheCoche</span>
    </span>
  );
}
