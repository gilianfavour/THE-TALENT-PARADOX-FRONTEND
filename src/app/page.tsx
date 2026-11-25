import Link from "next/link";
import { api, fmtMoney } from "@/lib/api";
import BridgeIllustration from "@/components/BridgeIllustration";
import CountUp from "@/components/CountUp";
import { Typewriter, TypeOnce } from "@/components/Typewriter";

const HERO_PHRASES = ["best CV.", "longest job history.", "top keyword match.", "fanciest job title.", "loudest in the room."];

export const dynamic = "force-dynamic";

const LADDER = [
  { label: "Self-reported", hint: "You say you can", tone: "bg-slate-300" },
  { label: "AI-inferred", hint: "Found in your experience", tone: "bg-zinc-400" },
  { label: "Evidence-supported", hint: "A project or work sample", tone: "bg-zinc-700" },
  { label: "Assessed", hint: "Shown in a practical task", tone: "bg-brand-500" },
  { label: "Human-validated", hint: "Confirmed by a recruiter", tone: "bg-brand-700" },
];

const PROFILE_SKILLS = [
  { name: "Inventory management", level: 4, source: "Family shop, 4 years" },
  { name: "Record keeping", level: 5, source: "Validated by recruiter" },
  { name: "Customer service", level: 2, source: "Inferred from daily sales" },
  { name: "Project coordination", level: 3, source: "Community clean-up drive" },
];

function Dots({ level }: { level: number }) {
  return (
    <span className="flex gap-1" aria-label={`Evidence level ${level} of 5`}>
      {LADDER.map((l, i) => (
        <span key={l.label} className="h-1.5 w-5 overflow-hidden rounded-full bg-slate-200">
          {i < level && <span className={`anim-grow block h-full ${l.tone}`} style={{ animationDelay: `${0.8 + i * 0.12}s` }} />}
        </span>
      ))}
    </span>
  );
}

export default async function Home() {
  let jobs = [] as Awaited<ReturnType<typeof api.jobs>>;
  try {
    jobs = await api.jobs();
  } catch {
    jobs = [];
  }

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="grid items-center gap-12 pt-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span style={{ animationDelay: "0.05s" }} className="anim-fade-up tb-sheen inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            {jobs.length} open vacancies at Donswift
          </span>
          <h1 style={{ animationDelay: "0.15s" }} className="anim-fade-up mt-6 font-display text-5xl font-bold leading-[1.02] tracking-tight text-ink sm:text-6xl">
            <span className="sr-only">The best candidate is not always the best CV.</span>
            <span aria-hidden>The best candidate is not always the </span>
            <Typewriter phrases={HERO_PHRASES} className="tb-highlight" />
          </h1>
          <p style={{ animationDelay: "0.3s" }} className="anim-fade-up mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
            TalentBridge reads your projects, family business, volunteering and self-taught skills, lets you prove them in a
            short practical task, and matches you to every role you fit. Not just the one you applied for.
          </p>
          <div style={{ animationDelay: "0.45s" }} className="anim-fade-up mt-8 flex flex-wrap items-center gap-3">
            <a href="#jobs" className="tb-sheen group inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm shadow-brand-600/30 transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-lg hover:shadow-brand-600/30">
              Browse open roles
              <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>&rarr;</span>
            </a>
            <a href="/how-it-works" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md">
              See how it works
            </a>
          </div>
          <dl style={{ animationDelay: "0.6s" }} className="anim-fade-up mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-6">
            <div>
              <dt className="text-xs text-slate-500">Applications a week</dt>
              <dd className="mt-1 font-display text-2xl font-bold"><CountUp to={500} suffix="+" /></dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Phone calls a day</dt>
              <dd className="mt-1 font-display text-2xl font-bold"><CountUp to={45} /></dd>
            </div>
            <div>
              <dt className="text-xs text-slate-500">Decisions made by AI</dt>
              <dd className="mt-1 font-display text-2xl font-bold">0</dd>
            </div>
          </dl>
        </div>

        {/* Talent profile visual */}
        <div className="anim-fade-up relative" style={{ animationDelay: "0.35s" }}>
          <div className="anim-glow absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-brand-100 via-white to-sun-50" />
          <div style={{ ["--sheen-delay" as string]: "2.4s" }} className="tb-sheen tb-sheen-soft rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-25px_rgba(10,10,10,0.35)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_30px_70px_-25px_rgba(200,16,46,0.35)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink font-display text-xl font-bold text-white">AN</div>
              <div>
                <p className="font-display text-lg font-bold">Amina Nakato</p>
                <p className="text-sm text-slate-500">Family shop, Kisenyi. No formal admin job title.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {PROFILE_SKILLS.map((s, i) => (
                <div key={s.name} style={{ animationDelay: `${0.55 + i * 0.12}s` }} className="anim-fade-up flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="truncate text-xs text-slate-500">{s.source}</p>
                  </div>
                  <Dots level={s.level} />
                </div>
              ))}
            </div>
            <div style={{ ["--sheen-delay" as string]: "3.4s" }} className="tb-sheen mt-6 rounded-2xl border border-sun-200 bg-sun-50 p-4">
              <p className="text-sm font-bold text-sun-700">Rediscovered for another role</p>
              <TypeOnce
                delay={1900}
                className="mt-1 text-sm leading-relaxed text-slate-700"
                text="Not a strong fit for Administrative Assistant, but a 78 match for Project Support Officer. A recruiter is reviewing the recommendation."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="scroll-mt-24">
        <div className="max-w-2xl">
          <h2 className="tb-text-shimmer font-display text-4xl font-bold tracking-tight">Discover. Verify. Connect.</h2>
          <p className="mt-3 text-base leading-relaxed text-slate-600">
            Three steps between you and a fair shot. No keyword filter decides your future.
          </p>
        </div>
        <div className="mt-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-3">
          <BridgeIllustration className="h-auto w-full" />
        </div>
        <ol className="mt-6 grid gap-px overflow-hidden rounded-3xl border border-slate-200 bg-slate-200 md:grid-cols-3">
          {[
            {
              t: "Discover",
              d: "Tell us everything you have done: university projects, informal work, volunteering, freelancing. We turn it into skills, not job titles.",
            },
            {
              t: "Verify",
              d: "Take a short practical task built for the vacancy. What you show becomes evidence that outweighs any CV claim.",
            },
            {
              t: "Connect",
              d: "We match you to every open role and explain why. If another role fits better, a recruiter invites you. You decide.",
            },
          ].map((p, i) => (
            <li key={p.t} className="bg-white p-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 font-display text-sm font-bold text-brand-700">
                {i + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold">{p.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{p.d}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8">
          <h3 className="font-display text-xl font-bold">Every skill shows how we know it</h3>
          <p className="mt-1 text-sm text-slate-500">Recruiters see the evidence behind each skill, so nobody is judged on CV polish.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-5">
            {LADDER.map((l, i) => (
              <div key={l.label} className="rounded-2xl bg-paper p-4">
                <div className="flex gap-1">
                  {LADDER.map((_, j) => (
                    <span key={j} className={`h-1.5 flex-1 rounded-full ${j <= i ? l.tone : "bg-slate-200"}`} />
                  ))}
                </div>
                <p className="mt-3 text-sm font-bold">{l.label}</p>
                <p className="mt-0.5 text-xs text-slate-500">{l.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section id="jobs" className="scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-bold tracking-tight">Open vacancies</h2>
            <p className="mt-2 text-slate-600">Every application gets a real review by a person, backed by evidence.</p>
          </div>
          <Link href="/vacancies" className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold transition hover:border-slate-400">
            See all vacancies
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {jobs.map((j) => (
            <Link
              key={j.id}
              href={`/jobs/${j.id}`}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-brand-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-sm font-bold text-brand-700">
                    {(j.client ?? "D").slice(0, 2).toUpperCase()}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold leading-snug group-hover:text-brand-700">{j.title}</h3>
                    <p className="text-sm text-slate-500">{j.client}</p>
                  </div>
                </div>
                {j.deadline && (
                  <span className="shrink-0 rounded-full bg-sun-50 px-3 py-1 text-xs font-semibold text-sun-700">
                    Closes {new Date(j.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
              {j.summary && <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600">{j.summary}</p>}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600">
                {j.location && <span className="rounded-md bg-paper px-2.5 py-1">{j.location}</span>}
                {j.type && <span className="rounded-md bg-paper px-2.5 py-1">{j.type}</span>}
                {j.salary && (
                  <span className="ml-auto text-sm text-ink">
                    {fmtMoney(j.salary[0])} to {fmtMoney(j.salary[1])}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        {jobs.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="font-semibold">No vacancies to show yet</p>
            <p className="mt-1 text-sm text-slate-500">Start the backend API, then refresh this page.</p>
          </div>
        )}
      </section>

      {/* Promise */}
      <section className="tb-sheen tb-sheen-soft rounded-3xl bg-brand-700 px-8 py-12 text-white sm:px-12">
        <div className="grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="font-display text-3xl font-bold leading-tight">A rejected application never means a rejected candidate.</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-brand-100">
              If another role fits your skills better, a Donswift recruiter reviews the match and invites you. You can accept
              or decline. We never apply on your behalf.
            </p>
          </div>
          <div className="flex md:justify-end">
            <a href="/vacancies" className="rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50">
              Start your Talent Profile
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
