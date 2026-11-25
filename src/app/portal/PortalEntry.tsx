"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PortalEntry() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function open(e: React.FormEvent) {
    e.preventDefault();
    const token = value.trim().split("/portal/").pop()?.split(/[?#]/)[0]?.replace(/\/$/, "") ?? "";
    if (token.length < 10) {
      setError("Paste the full portal link from your application confirmation.");
      return;
    }
    router.push(`/portal/${token}`);
  }

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
      <div>
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">Open your candidate portal</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Track your applications, see why you match, take your skills check and respond to invitations for other roles.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/login" className="tb-sheen rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">Sign in</Link>
          <Link href="/register" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-slate-400">Create an account</Link>
        </div>
        <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="h-px flex-1 bg-slate-200" />or open with the link from your application<span className="h-px flex-1 bg-slate-200" />
        </div>
        <form onSubmit={open} className="mt-5 space-y-3">
          <label className="block text-sm font-semibold">
            Your private portal link
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError(null);
              }}
              placeholder="http://localhost:3000/portal/your-private-code"
              className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <button className="w-full rounded-xl border border-slate-300 bg-white py-3.5 text-sm font-bold text-ink transition hover:border-slate-400">
            Open my portal
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-500">
          New here?{" "}
          <Link href="/vacancies" className="font-semibold text-brand-700">
            Apply for a role
          </Link>{" "}
          and your portal is created instantly.
        </p>
      </div>
      <div className="rounded-3xl border border-slate-200 bg-white p-8">
        <p className="font-display text-lg font-bold">Inside your portal</p>
        <ul className="mt-5 space-y-4">
          {[
            ["Live status", "Submitted, under review, shortlisted, interview, offer"],
            ["Why you match", "The skills and evidence behind your score, and what is missing"],
            ["Skills check", "Prove what you can do in a short practical task"],
            ["Other roles", "Vacancies your profile fits, including ones you did not apply for"],
            ["Instant answers", "Ask the assistant instead of calling the office"],
          ].map(([t, d]) => (
            <li key={t} className="flex gap-3">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              <div>
                <p className="font-bold">{t}</p>
                <p className="text-sm text-slate-600">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
