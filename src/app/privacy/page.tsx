import { PageHero } from "@/components/ui";

const SECTIONS: [string, string][] = [
  ["What we collect", "Contact details, CV content, experiences you add, assessment submissions and results, and your application history."],
  ["Why we use it", "Only to match you with suitable vacancies, support assessments and keep you informed about your applications."],
  ["Your consent", "You choose whether recruiters can find you in the talent pool and whether you can be considered for other vacancies."],
  ["Who can see it", "Authorised Donswift recruiters through role-based access. Employers only see recruiter-approved shortlists."],
  ["How we protect it", "Encrypted connections, secure document storage, audit trails and protection against unauthorised access."],
  ["Your rights", "Ask for a copy of your data, correct it, or ask for it to be deleted, in line with the Data Protection and Privacy Act, 2019."],
];

export default function Page() {
  return (
    <div className="space-y-10">
      <PageHero eyebrow="Legal" title="Privacy notice" intro="How TalentBridge collects, uses and protects your personal information." />
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
