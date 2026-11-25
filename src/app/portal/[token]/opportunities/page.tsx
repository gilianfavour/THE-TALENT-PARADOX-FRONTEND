import { api } from "@/lib/api";
import Invitations from "./Invitations";
import Link from "next/link";
import { Card, scoreTone } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await api.opportunities(token);
  return (
    <div className="space-y-6">
      <Card>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Talent Rediscovery</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">Opportunities picked for you</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          A role you applied for may not be the best fit, but another one might be. A recruiter reviews every suggestion before it
          reaches you, and you always decide. We never apply on your behalf.
        </p>
      </Card>

      <Invitations token={token} initial={data.invitations} />

      <Card>
        <h2 className="font-display text-xl font-bold">Recommended vacancies</h2>
        <p className="mt-1 text-sm text-slate-500">Compatibility is an indicator from your evidence, not a prediction of job success.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {data.suggested.map((s) => (
            <Link key={s.job_id} href={`/jobs/${s.job_id}`} className="group rounded-2xl border border-slate-200 p-5 transition hover:border-brand-500 hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate font-display text-lg font-bold group-hover:text-brand-700">{s.title}</p>
                  <p className="text-sm text-slate-500">{s.client}</p>
                </div>
                <span className={`font-display text-2xl font-bold ${scoreTone(s.score)}`}>{s.score}</span>
              </div>
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {s.top_reasons.slice(0, 2).map((r) => <li key={r}>{r}</li>)}
              </ul>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
