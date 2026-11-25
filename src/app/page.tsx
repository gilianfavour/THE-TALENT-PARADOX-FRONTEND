import Link from "next/link";
import { api, fmtMoney } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let jobs = [] as Awaited<ReturnType<typeof api.jobs>>;
  try {
    jobs = await api.jobs();
  } catch {
    jobs = [];
  }

  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 px-8 py-14 text-white">
        <p className="text-sm font-semibold uppercase tracking-widest text-indigo-200">SecondLook by Donswift</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight">What if the best candidate has the worst CV?</h1>
        <p className="mt-4 max-w-xl text-indigo-100">
          We look at what you can <em>do</em>, not just what your CV claims. Every application gets a skills check,
          a transparent match analysis, and a real conversation.
        </p>
        <div className="mt-6 flex gap-3 text-sm font-medium">
          <a href="#jobs" className="rounded-lg bg-white px-5 py-2.5 text-indigo-700 hover:bg-indigo-50">View open roles</a>
          <span className="self-center text-indigo-200">{jobs.length} live vacancies</span>
        </div>
      </section>

      <section id="jobs" className="space-y-4">
        <h2 className="text-2xl font-bold">Open vacancies</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((j) => (
            <Link key={j.id} href={`/jobs/${j.id}`}
              className="group rounded-xl border bg-white p-5 shadow-sm transition hover:border-indigo-300 hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-indigo-700">{j.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{j.client} - {j.location} - {j.type}</p>
                </div>
                {j.deadline && (
                  <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                    closes {new Date(j.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
              {j.salary && (
                <p className="mt-3 text-sm text-slate-600">{fmtMoney(j.salary[0])} - {fmtMoney(j.salary[1])}</p>
              )}
              {j.summary && <p className="mt-2 line-clamp-2 text-xs text-slate-400">{j.summary}</p>}
            </Link>
          ))}
        </div>
        {jobs.length === 0 && (
          <p className="rounded-lg border border-dashed p-8 text-center text-slate-500">
            No vacancies right now - check back soon.
          </p>
        )}
      </section>
    </div>
  );
}
