"use client";

import { useState } from "react";
import type { ApiKey } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApiKeyAction, revokeApiKeyAction } from "@/lib/actions";

export function ApiKeyPanel({ keys }: { keys: ApiKey[] }) {
  const [token, setToken] = useState<string | null>(null);

  async function create(formData: FormData) {
    const result = await createApiKeyAction(formData);
    if (result?.token) setToken(result.token);
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col">
        {keys.length ? (
          keys.map((key) => (
            <li
              key={key.id}
              className="flex items-center justify-between gap-2 border-b border-border py-3 text-sm"
            >
              <span className="min-w-0 truncate font-mono text-xs">
                {key.name} · {key.keyPrefix}…
              </span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => void revokeApiKeyAction(key.id)}
              >
                Révoquer
              </Button>
            </li>
          ))
        ) : (
          <li className="py-3 text-sm text-muted-foreground">Aucune clé.</li>
        )}
      </ul>
      {token ? (
        <p className="break-all rounded-md bg-muted px-3 py-2 font-mono text-xs">
          {token}
          <span className="mt-1 block text-muted-foreground">
            Copie-la maintenant, elle ne s’affichera plus.
          </span>
        </p>
      ) : null}
      <form action={create} className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="key-name">Nom</Label>
          <Input id="key-name" name="name" defaultValue="Agent" />
        </div>
        <Button type="submit">Générer une clé</Button>
      </form>
    </div>
  );
}
