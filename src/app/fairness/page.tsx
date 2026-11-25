const PROMISES = [
  { t: "No automated rejection", d: "The system ranks and explains. A recruiter reviews every shortlist and makes every decision." },
  { t: "Graduates are not ranked down", d: "For entry-level roles, missing years of employment never lowers your score." },
  { t: "Informal work counts", d: "A family business, volunteering or self-taught skills are read as real experience." },
  { t: "Career breaks are never penalised", d: "Gaps are noted as context only and never reduce a match." },
  { t: "Desirable is not mandatory", d: "Only recruiter-approved, job-related criteria can be mandatory. AI cannot decide that." },
  { t: "You can correct us", d: "Review what we found in your profile and fix anything that is wrong." },
];

const PRIVACY = [
  "Secure sign-in and role-based access for recruiters",
  "Your consent before your profile is considered for other roles",
  "Control over whether recruiters can find you in the talent pool",
  "Encrypted connections and secure storage for CVs and evidence",
  "An audit trail of every recruiter decision",
  "The right to request your data or have it deleted",
];

export default function Fairness() {
  return (
    <div className="space-y-16">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">Technology that finds people, not reasons to reject them</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Recruitment software can copy old biases by rewarding the same CVs, schools and keywords. We designed TalentBridge to
          do the opposite.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PROMISES.map((p) => (
          <div key={p.t} className="rounded-3xl border border-slate-200 bg-white p-6">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <h2 className="mt-4 font-display text-lg font-bold">{p.t}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.d}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 md:grid-cols-[1fr_1.3fr] sm:p-10">
        <div>
          <h2 className="font-display text-3xl font-bold">Your data, your choice</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            Built with Uganda&apos;s Data Protection and Privacy Act, 2019 in mind. We only use your information to connect you
            with suitable work.
          </p>
        </div>
        <ul className="space-y-3">
          {PRIVACY.map((p) => (
            <li key={p} className="flex gap-3 rounded-2xl bg-paper px-4 py-3 text-sm font-medium">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
              {p}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl bg-sun-50 p-8 sm:p-10">
        <h2 className="font-display text-2xl font-bold">How we keep ourselves honest</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-slate-700">
          We track outcomes by background, comparing graduates, informal-sector workers and experienced professionals, to spot
          gaps early. We do not claim our scores predict job performance, and we will not claim time savings until we have
          measured them.
        </p>
      </section>
    </div>
  );
}
