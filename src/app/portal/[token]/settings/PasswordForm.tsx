"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import Spinner from "@/components/Spinner";
import { toast } from "@/components/Toaster";

const field = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function PasswordForm({ token, hasPassword, email }: { token: string; hasPassword: boolean; email: string }) {
  const router = useRouter();
  const [has, setHas] = useState(hasPassword);
  const [f, setF] = useState({ current_password: "", password: "", password_confirmation: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await api.setPassword(token, has ? f : { password: f.password, password_confirmation: f.password_confirmation });
      // sign this browser in with the new account
      await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "adopt", token }) });
      toast(res.message);
      setHas(true);
      setF({ current_password: "", password: "", password_confirmation: "" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form id="account" onSubmit={save} className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold">{has ? "Account and password" : "Create your account"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {has ? <>You sign in with <strong>{email}</strong>.</> : <>Set a password to sign in with <strong>{email}</strong> on any device instead of using a private link.</>}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${has ? "bg-brand-50 text-brand-700" : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"}`}>
          {has ? "Account active" : "No password yet"}
        </span>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {has && (
          <label className="block text-sm font-semibold">
            Current password
            <input required type="password" autoComplete="current-password" value={f.current_password} onChange={(e) => setF({ ...f, current_password: e.target.value })} className={field} />
          </label>
        )}
        <label className="block text-sm font-semibold">
          {has ? "New password" : "Password"}
          <input required type="password" minLength={8} autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className={field} placeholder="At least 8 characters" />
        </label>
        <label className="block text-sm font-semibold">
          Confirm
          <input required type="password" minLength={8} autoComplete="new-password" value={f.password_confirmation} onChange={(e) => setF({ ...f, password_confirmation: e.target.value })} className={field} />
        </label>
      </div>
      {error && <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      <button disabled={busy} className="mt-5 rounded-xl bg-ink px-6 py-3 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:opacity-60">
        {busy ? <span className="inline-flex items-center gap-2"><Spinner /> Saving...</span> : has ? "Change password" : "Set password and sign in"}
      </button>
    </form>
  );
}
