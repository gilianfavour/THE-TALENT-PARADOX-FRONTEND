import { CtaBand, FeatureGrid, PageHero, Btn } from "@/components/ui";

const ITEMS = [
  { t: "Built from the vacancy", d: "A developer debugs code, an accountant reconciles accounts, a customer care agent handles a complaint. No single generic test." },
  { t: "Clear rubrics", d: "Each task is scored against predefined criteria such as clarity, problem resolution and accuracy." },
  { t: "AI assists, humans review", d: "AI drafts feedback and highlights evidence. Recruiters review subjective or borderline submissions." },
  { t: "Proven beats claimed", d: "Demonstrated results always weigh more in matching than keywords on a CV." },
  { t: "Feedback for candidates", d: "Every candidate sees results and feedback, so even an unsuccessful attempt teaches something." },
  { t: "No false promises", d: "A score shows what was demonstrated on the day. It never claims to predict future job performance." },
];

export default function Page() {
  return (
    <div className="space-y-16">
      <PageHero eyebrow="Pillar two: Verify" title="Let people show what they can do" intro="Vacancy-specific practical tasks move recruitment beyond qualifications and self-reported claims.">
        <Btn href="/vacancies">Find a role</Btn>
        <Btn href="/platform" variant="ghost">All engines</Btn>
      </PageHero>
      <FeatureGrid items={ITEMS} />
      <CtaBand title="Next: Connect" text="See how the next engine builds on this one." href="/platform/connect" label="Continue" />
    </div>
  );
}
