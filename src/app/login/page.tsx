import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  if (await getSession()) redirect("/");

  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <p className="font-heading text-sm tracking-[0.2em] text-primary uppercase">
          Après la réunion
        </p>
        <h1 className="mt-3 font-heading text-4xl leading-none">Relève</h1>
        <p className="mt-3 mb-8 text-sm text-muted-foreground">
          Tes tâches, tes clients, tes échéances. Accès personnel uniquement.
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
