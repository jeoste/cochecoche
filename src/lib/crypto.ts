import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    timingSafeEqual(a, a);
    return false;
  }
  return timingSafeEqual(a, b);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function generateAgentKey() {
  return `rlv_${randomBytes(24).toString("base64url")}`;
}

export function keyPrefix(token: string) {
  return token.slice(0, 10);
}
