import Link from "next/link";
import { CtaBand, PageHero, Btn } from "@/components/ui";

const PILLARS = [
  { href: "/platform/discover", n: "01", t: "Discover", s: "Talent Discovery Engine", d: "Finds skills in academic projects, informal work, volunteering and self-learning, not just job titles." },
  { href: "/platform/verify", n: "02", t: "Verify", s: "Competency Assessment Engine", d: "Vacancy-specific practical tasks let candidates show what they can actually do." },
  { href: "/platform/connect", n: "03", t: "Connect", s: "Matching and Rediscovery Engine", d: "Explains every match and finds a better-fit role when the first application is not the right one." },
];

export default function Platform() {
  return (
    <div className="space-y-16">
      <PageHero eyebrow="The platform" title="Three engines. One recruitment ecosystem." intro="TalentBridge asks a different question: what can this person do, what evidence supports it, and which open role could use it?">
        <Btn href="/vacancies">Find a role</Btn>
        <Btn href="/recruiters" variant="ghost">For recruiters</Btn>
      </PageHero>
      <div className="grid gap-5 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <Link key={p.href} href={p.href} className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-8 transition hover:-translate-y-1 hover:border-brand-500 hover:shadow-xl hover:shadow-slate-200/70">
            <span className="font-display text-sm font-bold text-brand-600">{p.n}</span>
            <h2 className="mt-4 font-display text-4xl font-bold">{p.t}</h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">{p.s}</p>
            <p className="mt-4 flex-1 leading-relaxed text-slate-600">{p.d}</p>
            <span className="mt-6 text-sm font-bold text-brand-700 group-hover:underline">Explore {p.t.toLowerCase()} &rarr;</span>
          </Link>
        ))}
      </div>
      <CtaBand title="AI discovers and supports. Humans decide." text="Every recommendation is explained and every hiring decision is made by a Donswift recruiter." href="/fairness" label="Our fairness promise" />
    </div>
  );
}
