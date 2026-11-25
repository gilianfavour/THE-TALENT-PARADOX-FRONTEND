import { PageHero } from "@/components/ui";

const SECTIONS: [string, string][] = [
  ["Honest information", "Provide accurate information. Assessments must be your own work."],
  ["Advisory scores", "Compatibility indicators and assessment scores are advisory. They do not guarantee interviews, offers or job performance."],
  ["Human decisions", "All shortlisting, interview and hiring decisions are made by people, not by the system."],
  ["No automatic applications", "TalentBridge never applies for a job on your behalf. You accept or decline every invitation."],
  ["Availability", "We aim to keep core services available even if AI features are temporarily offline."],
];

export default function Page() {
  return (
    <div className="space-y-10">
      <PageHero eyebrow="Legal" title="Terms of use" intro="The rules for using TalentBridge as a candidate, recruiter or employer." />
      <article className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 sm:p-10">
        {SECTIONS.map(([h, p]) => (
          <section key={h}>
            <h2 className="font-display text-xl font-bold">{h}</h2>
            <p className="mt-2 leading-relaxed text-slate-600">{p}</p>
          </section>
        ))}
        <p className="text-xs text-slate-400">Hackathon prototype. Final wording to be reviewed by Donswift&apos;s legal advisers.</p>
      </article>
    </div>
  );
}
