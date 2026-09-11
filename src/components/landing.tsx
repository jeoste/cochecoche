"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Landing() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <p className="font-heading text-sm tracking-[0.2em] text-primary uppercase">
          Après la réunion
        </p>
        <h1 className="mt-3 font-heading text-5xl leading-none">Relève</h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Chaque compte a son propre espace. Tes tâches, projets et clients
          restent sur Neon, isolés des autres. Un agent peut écrire via ta clé
          API.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <SignInButton mode="redirect">
            <Button>Connexion</Button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <Button variant="outline">Créer un compte</Button>
          </SignUpButton>
        </div>
      </div>
    </main>
  );
}
