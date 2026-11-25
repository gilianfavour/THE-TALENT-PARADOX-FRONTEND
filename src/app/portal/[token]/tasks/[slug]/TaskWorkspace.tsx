"use client";

import { useState } from "react";
import { api, type PracticalTask, type TaskResult } from "@/lib/api";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";

const STATUS = {
  shown: { label: "Shown", tone: "bg-brand-50 text-brand-700", bar: "bg-brand-500" },
  partly: { label: "Partly shown", tone: "bg-amber-50 text-amber-800", bar: "bg-amber-400" },
  not_shown: { label: "Not yet shown", tone: "bg-slate-100 text-slate-600", bar: "bg-slate-300" },
};

const field = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function TaskWorkspace({ token, task }: { token: string; task: PracticalTask }) {
  const [result, setResult] = useState<TaskResult | null>(task.result);
  const [response, setResponse] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  const [retake, setRetake] = useState(false);
  const words = response.trim() ? response.trim().split(/\s+/).length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.submitTask(token, task.slug, { response, link: link || undefined, job_id: task.job_id });
      setResult(res.result);
      setRetake(false);
      toast(res.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not submit. Try again.", "error");
    } finally {
      setBusy(false);
    }
  }

  const showForm = !result || retake;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
      <section className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Practical task · {task.role} · about {task.minutes} min</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{task.title}</h1>
          {task.job && <p className="mt-1 text-sm text-slate-500">Built from the {task.job} vacancy</p>}
        </div>
        <p className="leading-relaxed text-slate-700">{task.brief}</p>
        <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl bg-ink p-5 font-mono text-[13px] leading-relaxed text-zinc-100">{task.scenario}</pre>
        <div>
          <p className="text-sm font-bold">How your work is scored</p>
          <ul className="mt-3 space-y-2">
            {task.criteria.map((c) => (
              <li key={c.label} className="flex items-center justify-between rounded-xl bg-paper px-4 py-2.5 text-sm">
                <span>{c.label}</span>
                <span className="font-bold text-slate-500">{c.weight} pts</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Skills shown: {task.skills.join(", ")}. The score shows what you demonstrated in this task. It does not predict future job performance.
          </p>
        </div>
      </section>

      <section className="space-y-5">
        {result && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${result.status === "validated" ? "bg-brand-600 text-white" : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"}`}>
                  {result.status === "validated" ? `Human-validated by ${result.reviewer}` : "Awaiting recruiter review"}
                </span>
                <h2 className="mt-3 font-display text-xl font-bold">
                  {result.status === "validated" ? "Your validated result" : "Your preliminary result"}
                </h2>
              </div>
              <div className="text-right">
                <p className="font-display text-5xl font-bold text-brand-700">{result.status === "validated" ? result.final_score : Math.round(result.preliminary_score)}</p>
                <p className="text-xs text-slate-400">out of 100</p>
              </div>
            </div>
            {result.review_note && <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-brand-700"><strong>Recruiter feedback:</strong> {result.review_note}</p>}
            <ul className="mt-5 space-y-3">
              {result.criteria.map((c) => (
                <li key={c.key} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold">{c.label}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${STATUS[c.status].tone}`}>{STATUS[c.status].label}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full ${STATUS[c.status].bar}`} style={{ width: `${Math.round((c.points / c.weight) * 100)}%` }} />
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500">{c.feedback}</p>
                </li>
              ))}
            </ul>
            {result.status !== "validated" && !retake && (
              <button onClick={() => setRetake(true)} className="mt-5 text-sm font-bold text-slate-500 hover:text-ink">Improve and resubmit</button>
            )}
          </div>
        )}

        {showForm && (
          <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Your answer</h2>
            <label className="block text-sm font-semibold">
              Work through the task in your own words
              <textarea required minLength={20} rows={14} value={response} onChange={(e) => setResponse(e.target.value)} className={`${field} font-mono leading-relaxed`} placeholder="Explain your steps, show your working, paste code or a draft..." />
              <span className="mt-1 block text-right text-xs font-normal text-slate-400">{words} words</span>
            </label>
            <label className="block text-sm font-semibold">
              Supporting link <span className="font-normal text-slate-400">(optional: GitHub, document, portfolio)</span>
              <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" className={field} />
            </label>
            <button disabled={busy || words < 5} className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
              {busy ? (
                <span className="inline-flex items-center gap-2"><Spinner /> Scoring against the rubric...</span>
              ) : (
                "Submit for review"
              )}
            </button>
            <p className="text-center text-xs text-slate-500">You see a preliminary score straight away. A recruiter confirms it before it is final.</p>
          </form>
        )}
      </section>
    </div>
  );
}
