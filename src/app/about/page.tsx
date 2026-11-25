import { CtaBand, PageHero, Btn } from "@/components/ui";

const PRINCIPLES = [
  "CVs are evidence, not the whole person.",
  "Potential must be discoverable.",
  "Skills should be demonstrated where possible.",
  "A rejected application is not a rejected candidate.",
  "Vacancies decide the assessments.",
  "AI recommendations must be explainable.",
  "Humans keep decision-making authority.",
  "The platform must work even without AI.",
];

export default function About() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="About TalentBridge"
        title="Built for Donswift. Built for people the CV misses."
        intro="Donswift Company Ltd receives more than 500 applications a week and about 45 calls a day. TalentBridge helps its recruiters find capability faster, without letting good people slip through."
      >
        <Btn href="/platform">See the platform</Btn>
        <Btn href="/fairness" variant="ghost">Fairness</Btn>
      </PageHero>
      <section className="grid gap-4 sm:grid-cols-3">
        {[["500+", "applications every week"], ["45", "phone inquiries a day"], ["3", "engines: discover, verify, connect"]].map(([n, l]) => (
          <div key={l} className="rounded-3xl border border-slate-200 bg-white p-8">
            <p className="font-display text-5xl font-bold text-brand-600">{n}</p>
            <p className="mt-2 text-slate-600">{l}</p>
          </div>
        ))}
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
        <h2 className="font-display text-3xl font-bold">Our design principles</h2>
        <ol className="mt-6 grid gap-3 md:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <li key={p} className="flex gap-4 rounded-2xl bg-paper p-4">
              <span className="font-display font-bold text-brand-600">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-medium">{p}</span>
            </li>
          ))}
        </ol>
      </section>
      <CtaBand title="Because the best candidate is not always the one with the best CV" text="Join the talent pool or bring us your next vacancy." href="/vacancies" label="Browse vacancies" />
    </div>
  );
}
