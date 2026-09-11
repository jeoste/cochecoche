"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export function AccountMenu() {
  return (
    <div className="flex items-center justify-between gap-2">
      <Link
        href="/settings"
        className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground"
      >
        Clés agent
      </Link>
      <UserButton />
    </div>
  );
}
