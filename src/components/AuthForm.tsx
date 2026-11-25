"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import { toast } from "@/components/Toaster";

const field =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function AuthForm({ mode, next }: { mode: "login" | "register"; next?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", password_confirmation: "", phone: "", location: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const register = mode === "register";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        const first = data.errors ? (Object.values(data.errors)[0] as string[])[0] : null;
        throw new Error(first ?? data.message ?? "Could not continue.");
      }
      toast(register ? `Welcome, ${data.name.split(" ")[0]}. Your account is ready.` : `Welcome back, ${data.name.split(" ")[0]}.`);
      router.push(next && next.startsWith("/") ? next : register ? `${data.portal}/experience` : data.portal);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not continue.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-7 shadow-[0_20px_60px_-30px_rgba(10,10,10,0.3)]">
      {register && (
        <label className="block text-sm font-semibold">
          Full name
          <input required autoComplete="name" value={form.name} onChange={set("name")} className={field} placeholder="e.g. Amina Nakato" />
        </label>
      )}
      <label className="block text-sm font-semibold">
        Email
        <input required type="email" autoComplete="email" value={form.email} onChange={set("email")} className={field} placeholder="you@example.com" />
      </label>
      <label className="block text-sm font-semibold">
        Password
        <input
          required
          type="password"
          minLength={register ? 8 : undefined}
          autoComplete={register ? "new-password" : "current-password"}
          value={form.password}
          onChange={set("password")}
          className={field}
          placeholder={register ? "At least 8 characters" : ""}
        />
      </label>
      {register && (
        <>
          <label className="block text-sm font-semibold">
            Confirm password
            <input required type="password" minLength={8} autoComplete="new-password" value={form.password_confirmation} onChange={set("password_confirmation")} className={field} />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Phone <span className="font-normal text-slate-400">(optional)</span>
              <input autoComplete="tel" value={form.phone} onChange={set("phone")} className={field} placeholder="+256 7xx xxx xxx" />
            </label>
            <label className="block text-sm font-semibold">
              Location <span className="font-normal text-slate-400">(optional)</span>
              <input value={form.location} onChange={set("location")} className={field} placeholder="Kampala" />
            </label>
          </div>
        </>
      )}
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <button disabled={busy} className="tb-sheen w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
        {busy ? (
          <span className="inline-flex items-center gap-2"><Spinner /> {register ? "Creating your account..." : "Signing you in..."}</span>
        ) : register ? (
          "Create my account"
        ) : (
          "Sign in"
        )}
      </button>
      <p className="text-center text-sm text-slate-500">
        {register ? (
          <>Already have an account? <Link href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-brand-700 hover:underline">Sign in</Link></>
        ) : (
          <>New here? <Link href={`/register${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-bold text-brand-700 hover:underline">Create an account</Link></>
        )}
      </p>
    </form>
  );
}
