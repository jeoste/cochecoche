import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "desk_session";

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value) throw new Error("AUTH_SECRET is not set");
  return value;
}

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function signSession() {
  const issuedAt = Date.now().toString();
  const sig = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  return `${issuedAt}.${sig}`;
}

export function isValidSession(token: string | undefined) {
  if (!token) return false;
  const [issuedAt, sig] = token.split(".");
  if (!issuedAt || !sig) return false;
  const expected = createHmac("sha256", secret()).update(issuedAt).digest("hex");
  if (!safeEqual(sig, expected)) return false;
  const age = Date.now() - Number(issuedAt);
  return Number.isFinite(age) && age > 0 && age < 1000 * 60 * 60 * 24 * 30;
}

export async function getSession() {
  const store = await cookies();
  return isValidSession(store.get(SESSION_COOKIE)?.value);
}

export function passwordMatches(input: string) {
  const expected = process.env.APP_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}
