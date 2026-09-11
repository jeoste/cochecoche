import { ApiKeyPanel } from "@/components/api-key-panel";
import { requireUserId } from "@/lib/auth";
import { listApiKeys } from "@/lib/queries";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await requireUserId();
  const keys = await listApiKeys(userId);

  return (
    <main className="mx-auto flex min-h-full w-full max-w-lg flex-col px-6 py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← CocheCoche
      </Link>
      <h1 className="font-heading mt-6 text-3xl">Espace</h1>
      <p className="mt-2 mb-8 text-sm text-muted-foreground">
        Tes tâches sont liées à ce compte. La clé agent n’écrit que dans ton
        workspace.
      </p>
      <ApiKeyPanel keys={keys} />
    </main>
  );
}
