import Link from "next/link";
import { api, fmtMoney } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await api.job(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-indigo-600 font-medium">{job.client}</p>
        <h1 className="mt-1 text-3xl font-bold">{job.title}</h1>
        <p className="mt-2 text-sm text-slate-500">
          {job.location} - {job.type}
          {job.salary && <> - {fmtMoney(job.salary[0])} to {fmtMoney(job.salary[1])}</>}
          {job.deadline && <> - closes {new Date(job.deadline).toLocaleDateString("en-GB")}</>}
        </p>
      </div>

      <div className="whitespace-pre-line rounded-xl border bg-white p-6 text-slate-700">{job.description}</div>

      {job.requirements && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6">
          <h2 className="font-semibold text-indigo-900">What we measure, not just ask for</h2>
          <p className="mt-1 text-sm text-indigo-700/80">
            Our engine reads the vacancy for competencies. Your skills check shows which ones you have - CV keywords are only a start.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-800">Required</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {job.requirements.required_skills.map((s) => (
                  <span key={s.name} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-indigo-800 ring-1 ring-indigo-200">{s.name}</span>
                ))}
              </div>
            </div>
            {job.requirements.preferred_skills.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-800">Nice to have</h3>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {job.requirements.preferred_skills.map((s) => (
                    <span key={s.name} className="rounded-full bg-white px-3 py-1 text-xs text-indigo-600 ring-1 ring-indigo-100">{s.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-indigo-700/70">
            {job.requirements.years_min !== null && `Experience: ${job.requirements.years_min}+ yrs - `}
            {job.requirements.education_min && `Education: ${job.requirements.education_min}+`}
          </p>
        </div>
      )}

      <Link href={`/apply/${job.id}`}
        className="inline-block rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700">
        Apply for this role
      </Link>
      <p className="text-xs text-slate-400">Applying takes 2 minutes. You will get a private portal link to track your progress and take a short skills check.</p>
    </div>
  );
}
