import HelpBox from "../portal/[token]/HelpBox";

const FAQ = [
  ["Do I need a perfect CV?", "No. Paste it in any format, or simply describe what you have done. Formatting never counts against you."],
  ["What counts as experience?", "Jobs, internships, a family business, volunteering, freelancing, university projects and skills you taught yourself."],
  ["What is the skills check?", "A short practical task based on the real job. It shows what you can do, and a recruiter reviews the result."],
  ["How do I track my application?", "After you apply you get a private portal link. It shows your live status, your match feedback and next steps."],
  ["What if I am not a fit for the role I chose?", "We check every open vacancy. If another fits better, a recruiter may invite you. You can accept or decline."],
  ["Does AI decide who gets hired?", "Never. AI ranks and explains. Donswift recruiters make every shortlisting and hiring decision."],
];

export default function Help() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div>
        <h1 className="font-display text-5xl font-bold tracking-tight">Help centre</h1>
        <p className="mt-3 text-lg text-slate-600">Answers to the questions people used to phone us about.</p>
        <div className="mt-8 divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                {q}
                <span className="text-xl text-brand-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{a}</p>
            </details>
          ))}
        </div>
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <HelpBox />
      </div>
    </div>
  );
}
