import Link from "next/link";
import { api } from "@/lib/api";
import { Card, LevelBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TalentProfilePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await api.profile(token);
  const byLevel = Object.keys(p.levels).map((lvl) => ({
    level: lvl as keyof typeof p.levels,
    label: p.levels[lvl as keyof typeof p.levels],
    count: p.skills.filter((s) => s.level === lvl).length,
  }));

  return (
    <div className="space-y-6">
      <Card className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Talent Profile</p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{p.candidate.name}</h1>
          <p className="mt-1 text-slate-500">{p.candidate.headline ?? "Add a headline so recruiters know what you do best."}</p>
          <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
            {[
              ["Email", p.candidate.email],
              ["Phone", p.candidate.phone],
              ["Location", p.candidate.location],
              ["Career interests", p.candidate.career_interests],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl bg-paper p-4">
                <dt className="text-xs font-semibold text-slate-500">{k}</dt>
                <dd className="mt-1 font-semibold">{v || <span className="font-normal text-slate-400">Not added yet</span>}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`/portal/${token}/settings`} className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">Edit profile</Link>
            <Link href={`/portal/${token}/experience`} className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold hover:border-slate-400">Add experience</Link>
          </div>
        </div>
        <div className="rounded-3xl bg-ink p-6 text-white">
          <p className="text-sm text-zinc-300">Profile completion</p>
          <p className="mt-1 font-display text-5xl font-bold">{p.completion}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full bg-brand-500" style={{ width: `${p.completion}%` }} />
          </div>
          <ul className="mt-6 space-y-2.5 text-sm">
            {byLevel.map((l) => (
              <li key={l.level} className="flex items-center justify-between">
                <span className="text-zinc-300">{l.label}</span>
                <span className="font-bold">{l.count}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold">What we found about you</h2>
            <p className="mt-1 text-sm text-slate-500">AI only suggests skills. You prove them, and a recruiter can validate them.</p>
          </div>
          <Link href={`/portal/${token}/skills`} className="text-sm font-bold text-brand-700 hover:underline">See all skills</Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {p.skills.slice(0, 18).map((s) => (
            <span key={s.id} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-paper px-3 py-2 text-sm font-semibold">
              {s.name}
              <LevelBadge level={s.level} label={s.level_label} />
            </span>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="font-display text-xl font-bold">Experience beyond your CV</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {p.experiences.length === 0 && <p className="text-sm text-slate-500">Projects, volunteering, family business and self-learning all count. Add them under Projects & Experience.</p>}
          {p.experiences.map((e) => (
            <div key={e.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="text-xs font-bold text-brand-700">{e.type_label}</p>
              <p className="mt-1 font-bold">{e.title}</p>
              {e.organisation && <p className="text-sm text-slate-500">{e.organisation}</p>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
