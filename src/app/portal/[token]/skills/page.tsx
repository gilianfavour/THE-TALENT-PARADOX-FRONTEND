import Link from "next/link";
import { api } from "@/lib/api";
import { Card, Empty, LevelBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

const LADDER = [
  ["self_reported", "You told us"],
  ["ai_inferred", "Spotted in your experience"],
  ["evidence_supported", "Backed by a project or sample"],
  ["assessed", "Proven in a skills check"],
  ["human_validated", "Confirmed by a recruiter"],
] as const;

export default async function SkillsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await api.profile(token);

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="font-display text-3xl font-bold tracking-tight">My Skills</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Every skill carries an evidence level, so recruiters always know what is claimed and what is proven.</p>
        <ol className="mt-6 grid gap-2 sm:grid-cols-5">
          {LADDER.map(([lvl, text], i) => (
            <li key={lvl} className="rounded-2xl bg-paper p-4">
              <span className="text-xs font-bold text-slate-400">Level {i + 1}</span>
              <div className="mt-1.5"><LevelBadge level={lvl} label={p.levels[lvl]} /></div>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{text}</p>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="!p-0 overflow-hidden">
        {p.skills.length === 0 ? (
          <div className="p-6"><Empty title="No skills yet" text="Add an experience or take a skills check and we will start building your skills map." href={`/portal/${token}/experience`} label="Add experience" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-paper text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3">Skill</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Evidence</th>
                  <th className="px-6 py-3">Source</th>
                  <th className="px-6 py-3 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {p.skills.map((s) => (
                  <tr key={s.id} className="hover:bg-paper/60">
                    <td className="px-6 py-4 font-semibold">{s.name}{s.years ? <span className="ml-2 text-xs text-slate-400">{s.years} yrs</span> : null}</td>
                    <td className="px-6 py-4 text-slate-500">{s.category ?? "-"}</td>
                    <td className="px-6 py-4"><LevelBadge level={s.level} label={s.level_label} /></td>
                    <td className="px-6 py-4 text-slate-500">{s.source ?? "-"}</td>
                    <td className="px-6 py-4 text-right font-display font-bold">{s.score ?? <span className="text-slate-300">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-brand-50 p-6">
        <p className="font-semibold text-brand-700">Turn claimed skills into proven skills in about 10 minutes.</p>
        <Link href={`/assess/${token}`} className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white hover:bg-brand-700">Take the skills check</Link>
      </div>
    </div>
  );
}
