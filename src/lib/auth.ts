import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function getUserId() {
  const { userId } = await auth();
  return userId;
}

export async function requireUserId() {
  const userId = await getUserId();
  if (!userId) redirect("/sign-in");
  return userId;
}
