import Link from "next/link";
import { PageHero } from "@/components/ui";

const CHANNELS = [
  { t: "Jobseekers", d: "Track applications and get answers instantly in your portal.", href: "/portal", l: "Open my portal" },
  { t: "Quick questions", d: "Our assistant answers routine questions about applying, assessments and status.", href: "/help", l: "Ask the assistant" },
  { t: "Employers", d: "Need to fill a role? Tell us about the vacancy and deadline.", href: "mailto:recruitment@donswift.example", l: "Email recruitment" },
];

export default function Contact() {
  return (
    <div className="space-y-12">
      <PageHero eyebrow="Contact" title="Talk to Donswift" intro="Most candidate questions are answered instantly online. For everything else, here is how to reach us." />
      <div className="grid gap-5 md:grid-cols-3">
        {CHANNELS.map((c) => (
          <div key={c.t} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-8">
            <h2 className="font-display text-2xl font-bold">{c.t}</h2>
            <p className="mt-2 flex-1 leading-relaxed text-slate-600">{c.d}</p>
            <Link href={c.href} className="mt-6 inline-block w-fit rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">{c.l}</Link>
          </div>
        ))}
      </div>
      <section className="rounded-3xl bg-ink p-8 text-white sm:p-10">
        <h2 className="font-display text-2xl font-bold">Donswift Company Ltd</h2>
        <p className="mt-2 text-zinc-300">Human resource consultancy and recruitment. Kampala, Uganda.</p>
        <p className="mt-1 text-zinc-300">Office hours: Monday to Friday, 8:00 to 17:00.</p>
      </section>
    </div>
  );
}
