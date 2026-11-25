"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

interface Q {
  id: number;
  skill: string;
  question: string;
  options: string[];
}

const LETTERS = ["A", "B", "C", "D", "E"];

export default function Quiz({ token, questions }: { token: string; questions: Q[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<{ score: number } | null>(null);

  const answered = Object.keys(answers).length;
  const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0;

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portal/${token}/assessment`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          answers: Object.entries(answers).map(([qid, idx]) => ({ question_id: Number(qid), answer_index: idx })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Your answers were not saved. Try submitting again.");
      setDone({ score: data.overall_score });
      toast("Skills check submitted. Your matches have been updated.");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Your answers were not saved. Try submitting again.";
      setError(message);
      toast(message, "error");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-50">
          <p className="font-display text-4xl font-bold text-brand-700">{done.score}</p>
        </div>
        <h1 className="mt-6 font-display text-2xl font-bold">Skills check complete</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Your results are now evidence on your Talent Profile, and we have re-matched you against every open role. A
          recruiter reviews results before any decision.
        </p>
        <button
          onClick={() => router.push(`/portal/${token}`)}
          className="mt-8 rounded-xl bg-brand-600 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
        >
          See your updated matches
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Skills check</h1>
        <p className="mt-2 leading-relaxed text-slate-600">
          {questions.length} short scenario questions. There is no timer. This shows what you can do, whatever your CV says.
        </p>
      </div>

      <div className="sticky top-20 z-10 rounded-2xl border border-slate-200 bg-white/95 p-4 backdrop-blur">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>
            {answered} of {questions.length} answered
          </span>
          <span className="text-brand-700">{pct}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-brand-500 transition-all duration-300" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((q, i) => (
          <fieldset key={q.id} className="rounded-3xl border border-slate-200 bg-white p-6">
            <legend className="sr-only">Question {i + 1}</legend>
            <div className="flex items-center justify-between text-sm">
              <span className="rounded-md bg-brand-50 px-2.5 py-1 font-semibold text-brand-700">{q.skill}</span>
              <span className="text-slate-400">Question {i + 1}</span>
            </div>
            <p className="mt-3 font-semibold leading-relaxed">{q.question}</p>
            <div className="mt-4 space-y-2.5">
              {q.options.map((opt, idx) => {
                const selected = answers[q.id] === idx;
                return (
                  <label
                    key={idx}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      selected ? "border-brand-500 bg-brand-50 font-semibold" : "border-slate-200 hover:border-slate-300 hover:bg-paper"
                    }`}
                  >
                    <input type="radio" name={`q-${q.id}`} className="sr-only" onChange={() => setAnswers({ ...answers, [q.id]: idx })} />
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                        selected ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {LETTERS[idx]}
                    </span>
                    {opt}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

      <button
        onClick={submit}
        disabled={busy || answered < questions.length}
        className="w-full rounded-xl bg-brand-600 py-4 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {busy ? (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner />
            Scoring your answers...
          </span>
        ) : (
          `Submit answers (${answered} of ${questions.length})`
        )}
      </button>
    </div>
  );
}
