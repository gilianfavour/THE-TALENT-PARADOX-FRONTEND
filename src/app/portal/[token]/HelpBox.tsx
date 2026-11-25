"use client";

import { useState } from "react";

export default function HelpBox() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!q.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/help?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setAnswer(data.answer);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-xl border bg-white p-5">
      <h2 className="font-semibold">Ask us anything</h2>
      <p className="mt-1 text-xs text-slate-400">Instant answers, no phone call needed.</p>
      <form onSubmit={ask} className="mt-3 flex gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. when is my interview?"
          className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm" />
        <button className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white" disabled={busy}>
          {busy ? "..." : "Ask"}
        </button>
      </form>
      {answer && <p className="mt-3 rounded-lg bg-indigo-50 px-3 py-2 text-sm text-indigo-900">{answer}</p>}
      <div className="mt-3 flex flex-wrap gap-1.5 text-xs text-slate-400">
        {["my status", "skills check", "interview", "salary"].map((s) => (
          <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full bg-slate-100 px-2.5 py-1 hover:bg-slate-200">{s}</button>
        ))}
      </div>
    </section>
  );
}
