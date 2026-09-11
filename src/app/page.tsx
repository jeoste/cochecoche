import { Desk } from "@/components/desk";
import { Landing } from "@/components/landing";
import { getUserId } from "@/lib/auth";
import { getDeskData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function Home() {
  const userId = await getUserId();
  if (!userId) return <Landing />;

  if (!process.env.DATABASE_URL) {
    return (
      <main className="mx-auto flex min-h-full max-w-lg flex-col justify-center px-6 py-16">
        <p className="font-heading text-sm tracking-[0.2em] text-primary uppercase">
          Configuration
        </p>
        <h1 className="font-heading mt-3 text-3xl">Base absente</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          `DATABASE_URL` manque dans l’environnement.
        </p>
      </main>
    );
  }

  const data = await getDeskData(userId);
  return <Desk projects={data.projects} tasks={data.tasks} />;
}
