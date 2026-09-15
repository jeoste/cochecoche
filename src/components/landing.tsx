"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Mark } from "@/components/mark";
import { ProductPreview } from "@/components/product-preview";

export function Landing() {
  return (
    <main className="flex min-h-full min-w-0 w-full flex-1 flex-col overflow-x-hidden">
      <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-10">
        <div className="flex min-w-0 items-center gap-2.5">
          <Mark className="size-8 shrink-0" />
          <span className="truncate text-[17px] font-semibold tracking-tight">
            CocheCoche
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <SignInButton mode="redirect">
            <Button variant="ghost">Connexion</Button>
          </SignInButton>
          <SignUpButton mode="redirect">
            <Button className="hidden sm:inline-flex">Créer un compte</Button>
          </SignUpButton>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl min-w-0 flex-1 grid-cols-[minmax(0,1fr)] items-center gap-12 px-5 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-16">
        <div className="w-full min-w-0 max-w-[min(36rem,calc(100vw-2.5rem))]">
          <h1 className="text-[2rem] font-bold tracking-tight text-balance sm:text-5xl sm:leading-[1.1]">
            Coche tes tâches. Un agent les écrit.
          </h1>
          <p className="mt-5 w-full max-w-full text-base leading-relaxed break-words text-muted-foreground sm:text-[17px]">
            Liste open-source : dates, projets, clients. Chaque compte Clerk a
            son espace. Une clé agent dépose tes tâches depuis Granola ou
            Cursor.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <SignUpButton mode="redirect">
              <Button size="lg" className="h-10 px-4">
                Commencer
              </Button>
            </SignUpButton>
            <SignInButton mode="redirect">
              <Button size="lg" variant="outline" className="h-10 px-4">
                Connexion
              </Button>
            </SignInButton>
          </div>
        </div>
        <ProductPreview />
      </section>
    </main>
  );
}
