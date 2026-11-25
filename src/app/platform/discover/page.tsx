import { CtaBand, FeatureGrid, PageHero, Btn } from "@/components/ui";

const ITEMS = [
  { t: "Beyond formal jobs", d: "Academic and personal projects, internships, freelancing, family businesses, volunteering and community work all count." },
  { t: "Academic-to-professional translation", d: "A hospital management system project becomes software development, database design, requirements analysis and documentation." },
  { t: "Informal work recognised", d: "Years in a family shop reveal inventory management, customer service and financial record keeping." },
  { t: "Honest evidence labels", d: "Every skill is self-reported, AI-inferred, evidence-supported, assessed or human-validated. Nothing is overstated." },
  { t: "Candidate stays in control", d: "Candidates review what was found, correct mistakes and choose what recruiters can see." },
  { t: "Works without AI", d: "If an AI service is down, candidates can still register and build their profile manually." },
];

export default function Page() {
  return (
    <div className="space-y-16">
      <PageHero eyebrow="Pillar one: Discover" title="Find talent hidden behind the CV" intro="Candidates describe every kind of experience. The engine translates it into professional competencies and labels each one honestly by its evidence.">
        <Btn href="/vacancies">Find a role</Btn>
        <Btn href="/platform" variant="ghost">All engines</Btn>
      </PageHero>
      <FeatureGrid items={ITEMS} />
      <CtaBand title="Next: Verify" text="See how the next engine builds on this one." href="/platform/verify" label="Continue" />
    </div>
  );
}
