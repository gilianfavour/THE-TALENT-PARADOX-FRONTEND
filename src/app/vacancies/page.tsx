import Link from "next/link";
import { api, fmtMoney } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function VacanciesPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const { q = "", type = "" } = await searchParams;
  let jobs = [] as Awaited<ReturnType<typeof api.jobs>>;
  try {
    jobs = await api.jobs();
  } catch {
    jobs = [];
  }
  const types = Array.from(new Set(jobs.map((j) => j.type).filter(Boolean)));
  const term = q.trim().toLowerCase();
  const shown = jobs.filter(
    (j) =>
      (!term || [j.title, j.client, j.location, j.summary].join(" ").toLowerCase().includes(term)) &&
      (!type || j.type === type),
  );

  return (
    <div className="space-y-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-4xl font-bold tracking-tight">Open vacancies</h1>
        <p className="mt-3 leading-relaxed text-slate-600">
          Apply for the role you want. We also check your profile against every other vacancy, so one application can open
          several doors.
        </p>
      </header>

      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 sm:flex-row">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search by role, company or location"
          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-paper px-4 py-3 text-sm outline-none focus:border-brand-500 focus:bg-white"
        />
        <select name="type" defaultValue={type} className="rounded-xl border border-slate-200 bg-paper px-4 py-3 text-sm outline-none focus:border-brand-500">
          <option value="">All job types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700">Search</button>
      </form>

      <p className="text-sm text-slate-500">
        {shown.length} of {jobs.length} roles
      </p>

      <div className="divide-y divide-slate-200 overflow-hidden rounded-3xl border border-slate-200 bg-white">
        {shown.map((j) => (
          <Link key={j.id} href={`/jobs/${j.id}`} className="group grid gap-4 p-6 transition hover:bg-paper sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 font-bold text-brand-700">
                {(j.client ?? "D").slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <h2 className="font-display text-lg font-bold group-hover:text-brand-700">{j.title}</h2>
                <p className="text-sm text-slate-500">
                  {j.client}
                  {j.location ? `, ${j.location}` : ""}
                </p>
                {j.summary && <p className="mt-2 line-clamp-1 text-sm text-slate-600">{j.summary}</p>}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              {j.type && <span className="rounded-md bg-paper px-2.5 py-1 text-xs font-semibold text-slate-600">{j.type}</span>}
              {j.salary && <span className="text-sm font-semibold">{fmtMoney(j.salary[0])} to {fmtMoney(j.salary[1])}</span>}
              {j.deadline && (
                <span className="rounded-full bg-sun-50 px-3 py-1 text-xs font-semibold text-sun-700">
                  Closes {new Date(j.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              )}
            </div>
          </Link>
        ))}
        {shown.length === 0 && (
          <div className="p-12 text-center">
            <p className="font-semibold">No roles match your search</p>
            <Link href="/vacancies" className="mt-2 inline-block text-sm font-semibold text-brand-700">
              Clear filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
