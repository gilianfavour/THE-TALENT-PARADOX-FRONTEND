"use client";

import { useState } from "react";

const SUGGESTIONS = ["What is my application status?", "How does the skills check work?", "When is my interview?"];

export default function HelpBox() {
  const [q, setQ] = useState("");
  const [log, setLog] = useState<{ q: string; a: string }[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask(question: string) {
    if (!question.trim()) return;
    setBusy(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/help?q=${encodeURIComponent(question)}`);
      const data = await res.json();
      setLog((l) => [...l, { q: question, a: data.answer }]);
    } catch {
      setLog((l) => [...l, { q: question, a: "The assistant is offline right now. Your portal still shows your latest status." }]);
    }
    setQ("");
    setBusy(false);
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5M21 12a8.5 8.5 0 0 1-12.6 7.4L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12Z" />
          </svg>
        </span>
        <div>
          <h2 className="font-bold">Ask TalentBridge</h2>
          <p className="text-xs text-slate-500">Instant answers, no phone queue</p>
        </div>
      </div>

      <div className="mt-4 max-h-72 space-y-3 overflow-y-auto">
        {log.map((m, i) => (
          <div key={i} className="space-y-2 text-sm">
            <p className="ml-8 rounded-2xl rounded-br-md bg-brand-600 px-3.5 py-2.5 text-white">{m.q}</p>
            <p className="mr-8 rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 leading-relaxed text-slate-700">{m.a}</p>
          </div>
        ))}
        {log.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => ask(s)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-500 hover:text-brand-700"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(q);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Type a question"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
        />
        <button disabled={busy} className="rounded-xl bg-ink px-4 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
          Ask
        </button>
      </form>
    </section>
  );
}
