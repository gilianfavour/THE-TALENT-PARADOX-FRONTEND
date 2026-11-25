const ADMIN_URL = `${(process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8010/api").replace(/\/api$/, "")}/admin`;

const FEATURES = [
  {
    t: "Vacancy intelligence",
    d: "Paste a client job description. AI turns it into competencies, soft skills and practical tasks. You confirm which are mandatory before anything is published.",
  },
  {
    t: "Explainable ranking",
    d: "Every candidate comes with reasons: matched competencies, the evidence behind them, gaps, and whether a skills check is recommended first.",
  },
  {
    t: "Hidden talent signals",
    d: "Candidates whose assessed skills outrun their CV are flagged for a conversation, not filtered out by missing keywords.",
  },
  {
    t: "Talent rediscovery",
    d: "Weak fit for one vacancy, strong fit for another? You get an alternative recommendation to approve. Nobody is lost after one application.",
  },
  {
    t: "Deadline watch",
    d: "See which vacancies close soon and how many strong, evidenced candidates each one has, so you prioritise the right roles.",
  },
  {
    t: "Self-service candidates",
    d: "Applicants track status, read their match feedback and ask the assistant, instead of calling the office 45 times a day.",
  },
];

const HUMAN = ["Shortlisting", "Interviews", "Character and culture fit", "Client recommendations", "Final placement decisions"];

export default function Recruiters() {
  return (
    <div className="space-y-16">
      <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">500 applications. One clear, explained shortlist.</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            TalentBridge handles the sorting, screening and updates. Donswift recruiters spend their time on the judgement only
            people can make.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={ADMIN_URL} className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">
              Open the recruiter dashboard
            </a>
          </div>
          <p className="mt-3 text-sm text-slate-500">Demo login: admin@secondlook.test, password: password</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <p className="text-sm font-bold">Junior Software Developer, ranked</p>
          <div className="mt-4 space-y-3">
            {[
              ["David Okello", 87, "4 skills assessed, 2 years experience", "bg-brand-500"],
              ["Brian Ssemakula", 74, "Hidden talent: no job history, 88 in coding task", "bg-brand-500"],
              ["Neema Atim", 54, "CV claims only, skills check recommended", "bg-sun-500"],
            ].map(([n, s, r, tone]) => (
              <div key={n as string} className="rounded-2xl bg-paper p-4">
                <div className="flex items-center justify-between">
                  <p className="font-bold">{n}</p>
                  <p className="font-display text-lg font-bold">{s}</p>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-200">
                  <div className={`h-full rounded-full ${tone}`} style={{ width: `${s}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-600">{r}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">Scores are compatibility indicators, not predictions of job success.</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-3xl font-bold tracking-tight">What the dashboard does for you</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.t} className="rounded-3xl border border-slate-200 bg-white p-6">
              <h3 className="font-display text-lg font-bold">{f.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-8 rounded-3xl bg-ink p-8 text-white md:grid-cols-2 sm:p-12">
        <div>
          <h2 className="font-display text-3xl font-bold">What stays human</h2>
          <p className="mt-3 leading-relaxed text-slate-300">
            AI recommends, organises and explains. It never rejects anyone and never makes a hiring decision.
          </p>
        </div>
        <ul className="space-y-3">
          {HUMAN.map((h) => (
            <li key={h} className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-semibold">
              <span className="h-2 w-2 rounded-full bg-sun-500" />
              {h}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
