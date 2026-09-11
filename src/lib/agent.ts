import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { apiKeys } from "@/db/schema";
import { hashToken } from "@/lib/crypto";

export function agentKeyFrom(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export async function resolveAgentUserId(request: Request) {
  const token = agentKeyFrom(request);
  if (!token?.startsWith("rlv_")) return null;
  const [row] = await getDb()
    .select()
    .from(apiKeys)
    .where(eq(apiKeys.keyHash, hashToken(token)))
    .limit(1);
  if (!row) return null;
  await getDb()
    .update(apiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiKeys.id, row.id));
  return row.userId;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
