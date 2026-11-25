"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Q {
  id: number;
  skill: string;
  question: string;
  options: string[];
}

export default function Quiz({ token, questions }: { token: string; questions: Q[] }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ score: number } | null>(null);

  const answered = Object.keys(answers).length;

  async function submit() {
    setBusy(true);
    const payload = {
      answers: Object.entries(answers).map(([qid, idx]) => ({ question_id: Number(qid), answer_index: idx })),
    };
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/portal/${token}/assessment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) setDone({ score: data.overall_score });
  }

  if (done) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border bg-white p-10 text-center">
        <p className="text-5xl font-bold text-indigo-600">{done.score}</p>
        <p className="mt-2 font-semibold">Skills check complete</p>
        <p className="mt-2 text-sm text-slate-500">
          These scores are now evidence on your profile - the engine just re-matched you against every open vacancy.
        </p>
        <button onClick={() => router.push(`/portal/${token}`)} className="mt-6 rounded-lg bg-indigo-600 px-6 py-2.5 font-semibold text-white">
          See your updated matches
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills check</h1>
        <p className="mt-1 text-sm text-slate-500">
          {questions.length} scenario questions. This is how we find talent beyond the CV - answer honestly, there is no timer.
        </p>
      </div>

      <div className="space-y-5">
        {questions.map((q, i) => (
          <div key={q.id} className="rounded-xl border bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">{q.skill}</p>
            <p className="mt-1 font-medium">{i + 1}. {q.question}</p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, idx) => (
                <label key={idx} className={`block cursor-pointer rounded-lg border px-4 py-2.5 text-sm transition ${answers[q.id] === idx ? "border-indigo-500 bg-indigo-50 font-medium" : "hover:border-slate-300"}`}>
                  <input type="radio" name={`q-${q.id}`} className="sr-only" onChange={() => setAnswers({ ...answers, [q.id]: idx })} />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={submit} disabled={busy || answered < questions.length}
        className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white disabled:opacity-50">
        {busy ? "Scoring..." : `Submit (${answered}/${questions.length} answered)`}
      </button>
    </div>
  );
}
