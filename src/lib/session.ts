import { cookies } from "next/headers";

export const SESSION_COOKIE = "tb_session";
export const BACKEND = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8500/api";

export interface SessionUser {
  token: string;
  name: string;
  email: string;
  has_password: boolean;
}

export async function sessionToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/** The signed-in candidate, validated against the backend, or null. */
export async function currentUser(): Promise<SessionUser | null> {
  const token = await sessionToken();
  if (!token) return null;
  try {
    const res = await fetch(`${BACKEND}/auth/me/${encodeURIComponent(token)}`, { cache: "no-store", headers: { Accept: "application/json" } });
    return res.ok ? ((await res.json()) as SessionUser) : null;
  } catch {
    return null;
  }
}

/** Account owner check for a portal token: who it belongs to and whether it has a password. */
export async function portalOwner(token: string): Promise<SessionUser | null> {
  try {
    const res = await fetch(`${BACKEND}/auth/me/${encodeURIComponent(token)}`, { cache: "no-store", headers: { Accept: "application/json" } });
    return res.ok ? ((await res.json()) as SessionUser) : null;
  } catch {
    return null;
  }
}
