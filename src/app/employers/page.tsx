import { CtaBand, FeatureGrid, PageHero, Btn } from "@/components/ui";

const ITEMS = [
  { t: "Submit a vacancy request", d: "Share the job description. We turn it into structured, approved competency requirements." },
  { t: "Shortlists with evidence", d: "Receive recruiter-approved shortlists with assessment results, not just CVs." },
  { t: "See why, not just who", d: "Every recommended candidate comes with matching competencies, evidence and gaps." },
  { t: "Interview feedback loop", d: "Your feedback is recorded and helps Donswift refine future shortlists for you." },
  { t: "Wider talent pool", d: "Graduates, career changers and informal-sector workers you would never find by keywords." },
  { t: "Your decision", d: "Donswift recommends. You make the final selection decision, always." },
];

export default function Employers() {
  return (
    <div className="space-y-16">
      <PageHero
        eyebrow="For employers and clients"
        title="Hire for capability, not CV polish"
        intro="Donswift finds, assesses and explains candidates so your team spends interview time on the people most likely to succeed."
      >
        <Btn href="/contact">Request talent</Btn>
        <Btn href="/recruiters" variant="ghost">How recruiters work</Btn>
      </PageHero>
      <FeatureGrid items={ITEMS} />
      <CtaBand title="Have a vacancy to fill?" text="Tell us about the role and deadline. A Donswift recruiter will be in touch." href="/contact" label="Contact Donswift" />
    </div>
  );
}
