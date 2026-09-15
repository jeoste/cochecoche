import { Mark } from "@/components/mark";
import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-full flex-1 flex-col items-center justify-center px-6 py-16">
      <Link href="/" className="mb-8 flex items-center gap-2.5">
        <Mark className="size-8" />
        <span className="text-lg font-semibold tracking-tight">CocheCoche</span>
      </Link>
      {children}
    </main>
  );
}
