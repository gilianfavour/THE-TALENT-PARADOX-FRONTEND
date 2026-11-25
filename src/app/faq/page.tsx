import Link from "next/link";
import { PageHero } from "@/components/ui";

const FAQ = [
  ["How do I apply?", "Open a vacancy, paste your CV text and submit. You get a private portal link straight away."],
  ["I have no formal job experience. Can I still apply?", "Yes. Add academic projects, volunteering, family business work or self-taught skills. They count."],
  ["What is the skills check?", "A short set of practical, job-related scenarios. It lets you prove skills that a CV cannot show."],
  ["Will AI reject me?", "No. AI organises and explains. A Donswift recruiter makes every shortlisting and hiring decision."],
  ["What does the compatibility number mean?", "It is an indicator of how your evidence lines up with a vacancy. It is not a prediction of job success."],
  ["What if I am not a good fit for the role I applied for?", "You stay in the talent pool. If another role suits you, a recruiter may invite you and you can accept or decline."],
  ["How do I check my application status?", "Open your portal and go to My Applications. Every stage is shown live, so there is no need to call."],
  ["Can I correct my profile?", "Yes. Edit your profile, remove experiences and choose whether recruiters can find you."],
  ["How is my data protected?", "Secure storage, role-based access, consent controls and audit trails, designed with Uganda's Data Protection and Privacy Act, 2019 in mind."],
];

export default function Faq() {
  return (
    <div className="space-y-12">
      <PageHero eyebrow="Help centre" title="Frequently asked questions" intro="Quick answers to the questions our recruiters hear most on the phone." />
      <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group p-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-bold">
              {q}
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-paper text-brand-700 transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">{a}</p>
          </details>
        ))}
      </div>
      <p className="text-sm text-slate-500">
        Still stuck? <Link href="/help" className="font-bold text-brand-700 hover:underline">Ask the assistant</Link> or{" "}
        <Link href="/contact" className="font-bold text-brand-700 hover:underline">contact Donswift</Link>.
      </p>
    </div>
  );
}
