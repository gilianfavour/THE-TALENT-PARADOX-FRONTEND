import Link from "next/link";
import { api } from "@/lib/api";
import { Card, LevelBadge, scoreTone } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AssessmentsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [p, tasks] = await Promise.all([api.profile(token), api.tasks(token).catch(() => [])]);
  const assessed = p.skills.filter((s) => s.score !== null);
  const toProve = p.skills.filter((s) => s.score === null).slice(0, 10);

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="font-display text-3xl font-bold tracking-tight">Assessments</h1>
          <p className="mt-2 text-slate-600">
            Short, practical scenarios built around real job tasks. Your results become proven evidence that counts in every match.
            Scores show what you demonstrated, they do not predict future performance.
          </p>
        </div>
        <Link href={`/assess/${token}`} className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-700">
          {assessed.length ? "Take another skills check" : "Start your skills check"}
        </Link>
      </Card>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Practical tasks</p>
            <h2 className="mt-1 font-display text-2xl font-bold">Show the real work of the job</h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Each task is built around the vacancy and scored against a clear rubric. You get instant preliminary feedback, then a
              recruiter reviews your work before it counts as validated.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {tasks.length === 0 && <p className="text-sm text-slate-500">Apply for a vacancy to unlock its practical task.</p>}
          {tasks.map((t) => {
            const r = t.result;
            const badge = !r
              ? { text: "Not started", tone: "bg-slate-100 text-slate-600" }
              : r.status === "validated"
                ? { text: `Validated ${r.final_score}`, tone: "bg-brand-600 text-white" }
                : { text: `Preliminary ${Math.round(r.preliminary_score)} · in review`, tone: "bg-amber-50 text-amber-800 ring-1 ring-amber-200" };
            return (
              <Link
                key={t.slug}
                href={`/portal/${token}/tasks/${t.slug}${t.job_id ? `?job=${t.job_id}` : ""}`}
                className="group flex flex-col rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xs font-bold text-slate-400">{t.why === "applied" ? "For your application" : "Suggested for you"} · {t.minutes} min</span>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${badge.tone}`}>{badge.text}</span>
                </div>
                <p className="mt-2 font-display text-lg font-bold group-hover:text-brand-700">{t.title}</p>
                <p className="text-sm text-slate-500">{t.job}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {t.skills.map((s) => (
                    <span key={s} className="rounded-md bg-paper px-2 py-0.5 text-xs font-semibold text-slate-600">{s}</span>
                  ))}
                </div>
                <span className="mt-4 text-sm font-bold text-brand-700">{r ? "View result" : "Start task"} &rarr;</span>
              </Link>
            );
          })}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl font-bold">Skill scores ({assessed.length})</h2>
          <div className="mt-5 space-y-4">
            {assessed.length === 0 && <p className="text-sm text-slate-500">No results yet.</p>}
            {assessed.map((s) => (
              <div key={s.id}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{s.name}</span>
                  <span className={`font-display font-bold ${scoreTone(s.score!)}`}>{s.score}</span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${Math.min(100, s.score!)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-display text-xl font-bold">Skills you could prove next</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {toProve.length === 0 && <p className="text-sm text-slate-500">Add experiences to discover more skills.</p>}
            {toProve.map((s) => (
              <span key={s.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-paper px-3 py-2 text-sm font-semibold">
                {s.name}
                <LevelBadge level={s.level} label={s.level_label} />
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
