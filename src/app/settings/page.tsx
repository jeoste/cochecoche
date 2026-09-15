import { ApiKeyPanel } from "@/components/api-key-panel";
import { Mark } from "@/components/mark";
import { requireUserId } from "@/lib/auth";
import { listApiKeys } from "@/lib/queries";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const keys = await listApiKeys(userId);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeftIcon className="size-4" />
        <Mark className="size-4" />
        Retour
      </Link>
      <h1 className="mt-6 text-2xl font-bold tracking-tight">Paramètres</h1>
      <p className="mt-1 mb-8 text-sm text-muted-foreground">
        Tes tâches restent dans ce compte. Une clé agent n’écrit que dans ton
        espace.
      </p>
      <h2 className="mb-3 text-[14px] font-semibold">Clés agent</h2>
      <ApiKeyPanel keys={keys} />
    </main>
  );
}
