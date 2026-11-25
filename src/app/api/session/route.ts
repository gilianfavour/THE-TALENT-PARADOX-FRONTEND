import { NextResponse } from "next/server";
import { BACKEND, SESSION_COOKIE } from "@/lib/session";

const COOKIE = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

async function backend(path: string, body?: unknown) {
  const res = await fetch(`${BACKEND}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

/** Sign in, create an account, or adopt a token right after applying with a new password. */
export async function POST(req: Request) {
  const input = await req.json().catch(() => ({}));
  const mode = input.mode as "login" | "register" | "adopt";
  let result;
  if (mode === "login") {
    result = await backend("/auth/login", { email: input.email, password: input.password });
  } else if (mode === "register") {
    result = await backend("/auth/register", {
      name: input.name,
      email: input.email,
      password: input.password,
      password_confirmation: input.password_confirmation,
      phone: input.phone || undefined,
      location: input.location || undefined,
    });
  } else if (mode === "adopt" && typeof input.token === "string") {
    result = await backend(`/auth/me/${encodeURIComponent(input.token)}`);
    if (result.ok && !result.data.has_password) {
      return NextResponse.json({ message: "Set a password first." }, { status: 422 });
    }
  } else {
    return NextResponse.json({ message: "Unknown request." }, { status: 400 });
  }

  if (!result.ok || !result.data?.token) {
    const message = result.data?.message ?? "Something went wrong. Try again.";
    return NextResponse.json({ message, errors: result.data?.errors }, { status: result.status || 422 });
  }

  const res = NextResponse.json({ name: result.data.name, portal: `/portal/${result.data.token}` });
  res.cookies.set(SESSION_COOKIE, result.data.token, COOKIE);
  return res;
}

/** Sign out. */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { ...COOKIE, maxAge: 0 });
  return res;
}
