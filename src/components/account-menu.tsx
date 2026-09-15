"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { SettingsIcon } from "lucide-react";

export function AccountMenu({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Link
          href="/settings"
          className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Paramètres"
        >
          <SettingsIcon className="size-4" />
        </Link>
        <UserButton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <Link
        href="/settings"
        className="inline-flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
      >
        <SettingsIcon className="size-4" />
        Paramètres
      </Link>
      <UserButton />
    </div>
  );
}
