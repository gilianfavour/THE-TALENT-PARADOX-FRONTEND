import Link from "next/link";

const STEPS = [
  {
    t: "Tell us everything you have done",
    d: "Paste a CV or just describe your experience. University projects, a family business, volunteering, freelancing and self-taught skills all count.",
    e: "A diploma graduate's hospital management system project reveals software development, database design, requirements analysis and documentation.",
  },
  {
    t: "AI finds your competencies",
    d: "We translate informal descriptions into professional skills, and label each one by how we know it. AI suggests, it never verifies on its own.",
    e: "Four years in a family shop becomes inventory management, customer service, financial record keeping and sales coordination.",
  },
  {
    t: "Prove it in a practical task",
    d: "Each vacancy gets its own short assessment built from the real job, scored against a clear rubric and reviewed by a person.",
    e: "Software developers debug a small feature. Administrative assistants organise records and prioritise tasks.",
  },
  {
    t: "Get matched to every role you fit",
    d: "We compare your evidence with every open vacancy and explain each match: what fits, what supports it, and what is not shown yet.",
    e: "Not a strong fit for the role you chose? A recruiter can invite you to a better one. You accept or decline.",
  },
  {
    t: "A recruiter makes the decision",
    d: "Shortlists, interviews, client recommendations and offers are always human decisions. You get an update at every step.",
    e: "Your portal shows your status live, so you never have to call to ask.",
  },
];

const LADDER = [
  ["Self-reported", "You say you have the skill", "bg-slate-300"],
  ["AI-inferred", "It appears in experience you described", "bg-zinc-400"],
  ["Evidence-supported", "You shared a project, document or work sample", "bg-zinc-700"],
  ["Assessed", "You showed it in a practical task", "bg-brand-500"],
  ["Human-validated", "A recruiter reviewed and confirmed it", "bg-brand-700"],
];

export default function HowItWorks() {
  return (
    <div className="space-y-16">
      <header className="max-w-3xl">
        <h1 className="font-display text-5xl font-bold leading-tight tracking-tight">From hidden talent to hired, in five steps</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          TalentBridge asks a different question. Not &ldquo;does this CV match the vacancy?&rdquo; but &ldquo;what can this
          person do, what proves it, and which roles need it?&rdquo;
        </p>
      </header>

      <ol className="relative space-y-6 border-l-2 border-brand-100 pl-8">
        {STEPS.map((s, i) => (
          <li key={s.t} className="relative">
            <span className="absolute -left-[3.05rem] flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white ring-4 ring-paper">
              {i + 1}
            </span>
            <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 md:grid-cols-[1.2fr_1fr]">
              <div>
                <h2 className="font-display text-xl font-bold">{s.t}</h2>
                <p className="mt-2 leading-relaxed text-slate-600">{s.d}</p>
              </div>
              <p className="rounded-2xl bg-paper p-4 text-sm leading-relaxed text-slate-700">
                <span className="font-bold text-brand-700">Example: </span>
                {s.e}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <section className="rounded-3xl border border-slate-200 bg-white p-8">
        <h2 className="font-display text-2xl font-bold">How we label every skill</h2>
        <p className="mt-1 text-slate-500">Recruiters always see how strong the evidence is, so claims never pass as proof.</p>
        <div className="mt-6 space-y-3">
          {LADDER.map(([label, hint, tone], i) => (
            <div key={label} className="flex items-center gap-4 rounded-2xl bg-paper p-4">
              <div className="flex w-28 shrink-0 gap-1">
                {LADDER.map((_, j) => (
                  <span key={j} className={`h-2 flex-1 rounded-full ${j <= i ? tone : "bg-slate-200"}`} />
                ))}
              </div>
              <p className="w-44 shrink-0 font-bold">{label}</p>
              <p className="text-sm text-slate-600">{hint}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/vacancies" className="rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700">
          Browse open roles
        </Link>
        <Link href="/fairness" className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold transition hover:border-slate-400">
          Read our fairness promise
        </Link>
      </div>
    </div>
  );
}
