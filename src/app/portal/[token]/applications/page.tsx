import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Empty, scoreTone } from "@/components/ui";

export const dynamic = "force-dynamic";

const STEPS = ["applied", "screening", "shortlisted", "interview", "offer"];
const STEP_LABEL = ["Submitted", "Under review", "Shortlisted", "Interview", "Offer"];

export default async function ApplicationsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const apps = await api.myApplications(token);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="font-display text-3xl font-bold tracking-tight">My Applications</h1>
        <p className="mt-2 text-slate-600">Live status for every role. You do not need to call to ask for an update.</p>
      </Card>
      {apps.length === 0 && <Empty title="No applications yet" text="Browse open vacancies and apply in a few minutes." href="/vacancies" label="Browse vacancies" />}
      {apps.map((a) => {
        const step = a.status === "hired" ? 5 : STEPS.indexOf(a.status) + 1;
        return (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Link href={`/jobs/${a.job_id}`} className="font-display text-xl font-bold hover:text-brand-700">{a.job}</Link>
                <p className="text-sm text-slate-500">{a.client} | Applied {a.applied_at} | Updated {a.updated_at}</p>
                <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-bold ${a.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-ink text-white"}`}>{a.status_label}</span>
              </div>
              {a.score !== null && (
                <div className="text-right">
                  <p className={`font-display text-4xl font-bold ${scoreTone(a.score)}`}>{a.score}</p>
                  <p className="text-xs text-slate-400">compatibility indicator</p>
                </div>
              )}
            </div>
            {step > 0 && a.status !== "rejected" && (
              <ol className="mt-6 grid grid-cols-5 gap-2">
                {STEP_LABEL.map((s, i) => (
                  <li key={s}>
                    <span className={`block h-2 rounded-full ${i < step ? "bg-brand-500" : "bg-slate-200"}`} />
                    <span className={`mt-1.5 block text-xs ${i < step ? "font-semibold" : "text-slate-400"}`}>{s}</span>
                  </li>
                ))}
              </ol>
            )}
            {a.status === "rejected" && (
              <p className="mt-4 rounded-2xl bg-paper p-4 text-sm text-slate-600">
                This role is not moving forward, but you stay in the Donswift talent pool.{" "}
                <Link href={`/portal/${token}/opportunities`} className="font-bold text-brand-700 hover:underline">See other opportunities</Link>
              </p>
            )}
            {a.breakdown && (
              <div className="mt-6 grid gap-3 sm:grid-cols-4">
                {(["skills", "experience", "education", "potential"] as const).map((k) => (
                  <div key={k} className="rounded-2xl bg-paper p-4">
                    <p className="text-xs font-semibold capitalize text-slate-500">{k}</p>
                    <p className="mt-1 font-display text-2xl font-bold">{Math.round(a.breakdown![k])}</p>
                  </div>
                ))}
              </div>
            )}
            {a.explanations.length > 0 && (
              <details className="mt-5 rounded-2xl border border-slate-200 p-4">
                <summary className="cursor-pointer text-sm font-bold">Why this compatibility?</summary>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-600">{a.explanations.map((e) => <li key={e}>{e}</li>)}</ul>
              </details>
            )}
          </Card>
        );
      })}
    </div>
  );
}
