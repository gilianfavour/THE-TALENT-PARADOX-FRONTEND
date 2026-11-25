import Link from "next/link";
import { api, fmtMoney } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await api.job(id);
  const req = job.requirements;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <article className="space-y-6">
        <Link href="/#jobs" className="text-sm font-semibold text-slate-500 hover:text-brand-700">
          Back to vacancies
        </Link>
        <header className="rounded-3xl border border-slate-200 bg-white p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand-50 font-display text-lg font-bold text-brand-700">
              {(job.client ?? "D").slice(0, 2).toUpperCase()}
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{job.title}</h1>
              <p className="mt-1 text-slate-500">{job.client}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-slate-700">
            {job.location && <span className="rounded-lg bg-paper px-3 py-1.5">{job.location}</span>}
            {job.type && <span className="rounded-lg bg-paper px-3 py-1.5">{job.type}</span>}
            {job.salary && (
              <span className="rounded-lg bg-paper px-3 py-1.5">
                {fmtMoney(job.salary[0])} to {fmtMoney(job.salary[1])}
              </span>
            )}
            {job.deadline && (
              <span className="rounded-lg bg-sun-50 px-3 py-1.5 text-sun-700">
                Closes {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </span>
            )}
          </div>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white p-8">
          <h2 className="font-display text-xl font-bold">About the role</h2>
          <div className="mt-4 whitespace-pre-line text-[15px] leading-7 text-slate-700">{job.description}</div>
        </section>

        {req && (
          <section className="rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="font-display text-xl font-bold">What this role needs</h2>
            <p className="mt-1 text-sm text-slate-500">
              {req.engine?.startsWith("claude")
                ? "Claude AI turned the job description into competencies. A recruiter confirms what is mandatory."
                : "The job description was turned into competencies. A recruiter confirms what is mandatory."}
            </p>
            {req.required_skills?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-ink">Core competencies</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {req.required_skills.map((s) => (
                    <span key={s.name} className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-semibold text-brand-700">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {req.preferred_skills?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-bold text-ink">Nice to have</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {req.preferred_skills.map((s) => (
                    <span key={s.name} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {((req.behavioural_expectations?.length ?? 0) > 0 || (req.practical_tasks?.length ?? 0) > 0) && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {(req.behavioural_expectations?.length ?? 0) > 0 && (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-sm font-bold">How you will work</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                      {req.behavioural_expectations!.map((b) => <li key={b} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{b}</li>)}
                    </ul>
                  </div>
                )}
                {(req.practical_tasks?.length ?? 0) > 0 && (
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <h3 className="text-sm font-bold">What you would do in week one</h3>
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                      {req.practical_tasks!.map((t) => <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />{t}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs text-slate-500">Experience</p>
                <p className="mt-1 font-semibold">{req.years_min ? `${req.years_min}+ years` : "Entry level welcome"}</p>
              </div>
              <div className="rounded-2xl bg-paper p-4">
                <p className="text-xs text-slate-500">Education</p>
                <p className="mt-1 font-semibold">{req.education_min ?? "Not required"}</p>
              </div>
            </div>
          </section>
        )}
      </article>

      <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-display text-lg font-bold">Apply in a few minutes</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Paste your CV in any format. Then take a short practical task to show what you can do.
          </p>
          <Link
            href={`/apply/${job.id}`}
            className="mt-5 block rounded-xl bg-brand-600 py-3.5 text-center text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Apply for this role
          </Link>
        </div>
        <div className="rounded-3xl border border-sun-200 bg-sun-50 p-6">
          <h3 className="font-bold text-sun-700">Not sure you fit?</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Apply anyway. We match your profile against every open role, and a recruiter will invite you if another one fits
            better.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-relaxed text-slate-600">
          <h3 className="font-bold text-ink">How we decide</h3>
          <p className="mt-2">AI ranks and explains. A Donswift recruiter reviews every shortlist and makes the final call.</p>
        </div>
      </aside>
    </div>
  );
}
