import { CtaBand, FeatureGrid, PageHero, Btn } from "@/components/ui";

const STEPS = [
  { t: "Academic-to-professional translation", d: "Your projects, coursework and research are read for real workplace competencies." },
  { t: "Entry-level skills checks", d: "Practical tasks designed for graduate and junior roles, not for people with ten years of experience." },
  { t: "Career readiness analysis", d: "See the gap between what you have shown and what a vacancy needs, and what to do next." },
  { t: "Graduate opportunity matching", d: "Graduate trainee posts, internships, apprenticeships, entry-level and junior roles." },
  { t: "Graduate talent pool", d: "Complete your profile once. Recruiters can find you when the right role opens." },
  { t: "Fair ranking", d: "For entry-level vacancies you are never ranked down simply for having fewer years of employment." },
];

export default function Graduates() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="Graduate Discovery Pathway"
        title="No experience? Your projects say otherwise."
        intro="Fresh graduates are often filtered out by experience requirements. TalentBridge reads what you built at university and lets you prove it."
      >
        <Btn href="/vacancies">See entry-level roles</Btn>
        <Btn href="/portal" variant="ghost">Build my profile</Btn>
      </PageHero>
      <section className="grid items-center gap-8 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold">One project, six competencies</h2>
          <p className="mt-3 leading-relaxed text-slate-600">
            A final-year hospital management system is not &quot;no experience&quot;. It shows the skills an employer pays for.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {["Software development", "Database management", "Requirements analysis", "Problem solving", "Documentation", "Project execution"].map((s) => (
            <span key={s} className="rounded-xl bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-700">{s}</span>
          ))}
        </div>
      </section>
      <FeatureGrid items={STEPS} />
      <CtaBand title="Start with one project" text="Add your final-year project and see which skills we find." href="/portal" label="Open my portal" />
    </div>
  );
}
