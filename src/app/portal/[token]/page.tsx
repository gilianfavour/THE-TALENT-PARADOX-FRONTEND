import Link from "next/link";
import { api } from "@/lib/api";
import HelpBox from "./HelpBox";

export const dynamic = "force-dynamic";

const STATUS: Record<string, { label: string; tone: string; step: number }> = {
  applied: { label: "Submitted", tone: "bg-slate-100 text-slate-700", step: 1 },
  screening: { label: "Under review", tone: "bg-sky-50 text-sky-700", step: 2 },
  shortlisted: { label: "Shortlisted", tone: "bg-brand-50 text-brand-700", step: 3 },
  interview: { label: "Interview", tone: "bg-sun-50 text-sun-700", step: 4 },
  offer: { label: "Offer", tone: "bg-brand-100 text-brand-700", step: 5 },
  hired: { label: "Hired", tone: "bg-brand-600 text-white", step: 5 },
  rejected: { label: "Not progressing", tone: "bg-rose-50 text-rose-700", step: 0 },
};

const STEPS = ["Submitted", "Review", "Shortlist", "Interview", "Offer"];

const SIGNAL_LABEL: Record<string, string> = {
  hidden_gem: "Hidden talent found",
  claims_unverified: "Skills check recommended",
  strong_demonstrated: "Skills proven",
  career_changer: "Transferable skills",
  self_taught: "Self-taught",
  career_gap: "Career break, not penalised",
  overqualified: "Experienced",
  early_career: "Early career",
  better_fit_elsewhere: "Better fit elsewhere",
};

function tone(score: number) {
  return score >= 70 ? "text-brand-700" : score >= 45 ? "text-sun-700" : "text-slate-500";
}

function ScoreRing({ score }: { score: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(score, 100) / 100) * c;
  return (
    <div className="relative h-14 w-14 shrink-0" title="Compatibility indicator, not a prediction of job success">
      <svg viewBox="0 0 44 44" className="h-14 w-14 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e5ebe9" strokeWidth="4" />
        <circle
          cx="22" cy="22" r={r} fill="none" strokeWidth="4" strokeLinecap="round"
          className={score >= 70 ? "stroke-brand-500" : score >= 45 ? "stroke-sun-500" : "stroke-slate-300"}
          strokeDasharray={c} strokeDashoffset={off}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center font-display text-sm font-bold ${tone(score)}`}>{score}</span>
    </div>
  );
}

export default async function PortalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { token } = await params;
  const { welcome } = await searchParams;
  const data = await api.portal(token);
  const first = data.candidate.name.split(" ")[0];
  const bestScore = Math.max(0, ...data.applications.map((a) => a.score ?? 0), ...data.suggested_jobs.map((s) => s.score));

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="rounded-2xl border border-brand-200 bg-brand-50 px-5 py-4 text-sm text-brand-700">
          <strong className="font-bold">Application received.</strong> This is your private portal. Bookmark it to track your
          status, see how you match, and take your skills check.
        </div>
      )}

      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sun-500 font-display text-2xl font-bold">
            {first.slice(0, 1)}
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Welcome back, {first}</h1>
            <p className="mt-1 text-sm text-slate-500">{data.candidate.headline ?? data.candidate.email}</p>
          </div>
        </div>
        <Link href={`/assess/${token}`} className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">
          Take the skills check
        </Link>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active applications", value: data.applications.length, hint: "Tracked live, no need to call" },
          { label: "Skills proven", value: data.skills.demonstrated.length, hint: "Through the practical skills check" },
          { label: "Best compatibility", value: bestScore > 0 ? bestScore : "None yet", hint: "Across every open role" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-bold">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Applications */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Your applications</h2>
            <div className="mt-5 space-y-5">
              {data.applications.length === 0 && <p className="text-sm text-slate-500">You have not applied for a role yet.</p>}
              {data.applications.map((a, i) => {
                const st = STATUS[a.status] ?? { label: a.status, tone: "bg-slate-100 text-slate-700", step: 1 };
                return (
                  <div key={i} className="rounded-2xl border border-slate-200 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="font-display text-lg font-bold">{a.job}</p>
                        <p className="text-sm text-slate-500">{a.client}</p>
                        <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${st.tone}`}>{st.label}</span>
                      </div>
                      {a.score !== null && <ScoreRing score={a.score} />}
                    </div>

                    {st.step > 0 && (
                      <ol className="mt-5 grid grid-cols-5 gap-1.5">
                        {STEPS.map((s, idx) => (
                          <li key={s}>
                            <span className={`block h-1.5 rounded-full ${idx < st.step ? "bg-brand-500" : "bg-slate-200"}`} />
                            <span className={`mt-1.5 block text-[11px] ${idx < st.step ? "font-semibold text-ink" : "text-slate-400"}`}>{s}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {a.signals.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {a.signals.map((s) => (
                          <span key={s} className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
                            {SIGNAL_LABEL[s] ?? s.replaceAll("_", " ")}
                          </span>
                        ))}
                      </div>
                    )}

                    {a.explanations.length > 0 && (
                      <div className="mt-4 rounded-2xl bg-paper p-4">
                        <p className="text-sm font-bold">Why you match</p>
                        <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-slate-600">
                          {a.explanations.map((e, j) => (
                            <li key={j} className="flex gap-2.5">
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                              {e}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {a.better_fit && (
                      <div className="mt-4 rounded-2xl border border-sun-200 bg-sun-50 p-4 text-sm text-slate-700">
                        <p className="font-bold text-sun-700">You may fit another role even better</p>
                        <p className="mt-1">
                          <strong>{a.better_fit.title}</strong> at {a.better_fit.client} scores {a.better_fit.score}. A recruiter
                          will review this and may invite you. You can accept or decline.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Skills */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="font-display text-xl font-bold">Your skills evidence</h2>
            <p className="mt-1 text-sm text-slate-500">Skills you prove count for more than skills on paper.</p>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-bold text-brand-700">Proven in the skills check</h3>
                <div className="mt-3 space-y-3.5">
                  {data.skills.demonstrated.length === 0 && (
                    <p className="text-sm text-slate-500">Take the skills check to show what you can do.</p>
                  )}
                  {data.skills.demonstrated.map((s) => (
                    <div key={s.name}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-semibold">{s.name}</span>
                        <span className={`font-bold ${tone(s.score)}`}>{s.score}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div className={`h-full rounded-full ${s.score >= 70 ? "bg-brand-500" : "bg-sun-500"}`} style={{ width: `${Math.min(s.score, 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500">Found in your CV</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {data.skills.claimed.length === 0 && <p className="text-sm text-slate-500">No skills detected yet.</p>}
                  {data.skills.claimed.map((s) => (
                    <span key={s.name} className="rounded-lg border border-slate-200 bg-paper px-3 py-1.5 text-sm text-slate-700">
                      {s.name}
                      {s.years ? <span className="ml-1.5 text-xs text-slate-400">{s.years} yrs</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6">
            <h2 className="font-display text-lg font-bold">Roles you might fit</h2>
            <p className="mt-1 text-xs text-slate-500">Matched on your evidence, not keywords</p>
            <div className="mt-4 space-y-2.5">
              {data.suggested_jobs.slice(0, 4).map((s) => (
                <Link
                  key={s.job_id}
                  href={`/jobs/${s.job_id}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 p-4 transition hover:border-brand-500"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{s.title}</p>
                    <p className="truncate text-xs text-slate-500">{s.client}</p>
                  </div>
                  <span className={`font-display text-lg font-bold ${tone(s.score)}`}>{s.score}</span>
                </Link>
              ))}
            </div>
          </section>

          <HelpBox />
        </div>
      </div>
    </div>
  );
}
