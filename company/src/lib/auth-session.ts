import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/src/lib/auth";

export function hasAdminRole(
  role?: string | null,
) {
  if (!role) {
    return false;
  }

  return role
    .split(",")
    .map((item) => item.trim())
    .includes("admin");
}

export async function getCurrentSession() {
  return auth.api.getSession({
    headers: await headers(),
  });
}

export async function requireAdminSession() {
  const session =
    await getCurrentSession();

  if (!session) {
    redirect("/admin/login");
  }

  if (!hasAdminRole(session.user.role)) {
    redirect("/");
  }

  return session;
}