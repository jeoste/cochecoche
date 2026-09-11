import { safeEqual } from "@/lib/auth";

export function agentKeyFrom(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length).trim();
}

export function isAgentRequest(request: Request) {
  const expected = process.env.AGENT_API_KEY;
  const provided = agentKeyFrom(request);
  if (!expected || !provided) return false;
  return safeEqual(provided, expected);
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
