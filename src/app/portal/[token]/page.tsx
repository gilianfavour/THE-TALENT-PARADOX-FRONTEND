import { api } from "@/lib/api";
import HelpBox from "./HelpBox";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-slate-100 text-slate-700",
  screening: "bg-blue-100 text-blue-700",
  shortlisted: "bg-indigo-100 text-indigo-700",
  interview: "bg-amber-100 text-amber-700",
  offer: "bg-emerald-100 text-emerald-700",
  hired: "bg-emerald-600 text-white",
  rejected: "bg-rose-100 text-rose-700",
};

export default async function PortalPage({ params, searchParams }: { params: Promise<{ token: string }>; searchParams: Promise<{ welcome?: string }> }) {
  const { token } = await params;
  const { welcome } = await searchParams;
  const data = await api.portal(token);

  return (
    <div className="space-y-8">
      {welcome && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <strong>Application received!</strong> This is your private portal - bookmark it. Track your status, see how you match, and take your skills check.
        </div>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {data.candidate.name.split(" ")[0]}</h1>
          <p className="mt-1 text-slate-500">{data.candidate.headline ?? data.candidate.email}</p>
        </div>
        <a href={`/assess/${token}`} className="rounded-lg bg-indigo-600 px-5 py-2.5 font-semibold text-white hover:bg-indigo-700">
          Take the skills check
        </a>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Your applications</h2>
            <div className="mt-4 space-y-4">
              {data.applications.length === 0 && <p className="text-sm text-slate-400">No applications yet.</p>}
              {data.applications.map((a, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{a.job}</p>
                      <p className="text-sm text-slate-500">{a.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.score !== null && (
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold text-indigo-700">{a.score}/100</span>
                      )}
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[a.status] ?? "bg-slate-100"}`}>
                        {a.status}
                      </span>
                    </div>
                  </div>

                  {a.signals.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {a.signals.map((s) => (
                        <span key={s} className="rounded bg-violet-50 px-2 py-0.5 text-xs text-violet-700">{s.replaceAll("_", " ")}</span>
                      ))}
                    </div>
                  )}

                  {a.explanations.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Why this match</p>
                      <ul className="mt-1 list-disc space-y-0.5 pl-5 text-sm text-slate-600">
                        {a.explanations.map((e, j) => <li key={j}>{e}</li>)}
                      </ul>
                    </div>
                  )}

                  {a.better_fit && (
                    <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                      You may be an even better fit for <strong>{a.better_fit.title}</strong> ({a.better_fit.score}/100) at {a.better_fit.client} - our team may suggest it to you.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Skills evidence</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Demonstrated (skills check)</h3>
                <div className="mt-2 space-y-1.5">
                  {data.skills.demonstrated.length === 0 && <p className="text-sm text-slate-400">Take the skills check to prove your skills.</p>}
                  {data.skills.demonstrated.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm">
                      <span>{s.name}</span>
                      <span className={`font-semibold ${s.score >= 70 ? "text-emerald-600" : "text-amber-600"}`}>{s.score}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Claimed (from your CV)</h3>
                <div className="mt-2 space-y-1.5">
                  {data.skills.claimed.length === 0 && <p className="text-sm text-slate-400">No skills detected from your CV yet.</p>}
                  {data.skills.claimed.map((s) => (
                    <div key={s.name} className="flex items-center justify-between text-sm text-slate-600">
                      <span>{s.name}</span>
                      <span className="text-xs text-slate-400">{s.years ? `${s.years} yrs` : "claimed"}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold">Other roles you might fit</h2>
            <div className="mt-3 space-y-3">
              {data.suggested_jobs.slice(0, 4).map((s) => (
                <a key={s.job_id} href={`/jobs/${s.job_id}`} className="block rounded-lg border p-3 hover:border-indigo-300">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{s.title}</p>
                    <span className="text-sm font-bold text-indigo-600">{s.score}</span>
                  </div>
                  <p className="text-xs text-slate-500">{s.client}</p>
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Matched on your skills evidence, not just keywords.</p>
          </section>

          <HelpBox />
        </div>
      </div>
    </div>
  );
}
