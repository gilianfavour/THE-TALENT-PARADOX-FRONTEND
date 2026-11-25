import { CtaBand, FeatureGrid, PageHero, Btn } from "@/components/ui";

const ITEMS = [
  { t: "Explainable matching", d: "Each recommendation shows matching competencies, supporting evidence, gaps and whether more assessment is advised." },
  { t: "Mandatory vs desirable", d: "Only recruiter-approved, job-related criteria can exclude anyone. Missing a desirable skill never does." },
  { t: "Talent Rediscovery", d: "Weak matches are checked against other open vacancies and sent to a recruiter as alternative recommendations." },
  { t: "Recruiter approval first", d: "Nothing reaches the candidate until a recruiter approves it. The system never applies on anyone's behalf." },
  { t: "Candidate choice", d: "Candidates are told when they are considered for another role and can accept or decline." },
  { t: "Fair to graduates", d: "For entry-level roles, fewer years of employment never pushes a graduate below an experienced applicant." },
];

export default function Page() {
  return (
    <div className="space-y-16">
      <PageHero eyebrow="Pillar three: Connect" title="A rejected application is not a rejected candidate" intro="Every candidate is compared with every open vacancy. When the first role is not the right fit, the engine looks for one that is.">
        <Btn href="/vacancies">Find a role</Btn>
        <Btn href="/platform" variant="ghost">All engines</Btn>
      </PageHero>
      <FeatureGrid items={ITEMS} />
      <CtaBand title="Next: Graduate pathway" text="See how the next engine builds on this one." href="/graduates" label="Continue" />
    </div>
  );
}
