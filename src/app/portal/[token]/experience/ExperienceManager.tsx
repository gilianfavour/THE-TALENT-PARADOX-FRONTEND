"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { api, type TalentProfile } from "@/lib/api";

const PROMPTS = [
  "Have you completed academic projects?",
  "Have you volunteered or led a community activity?",
  "Have you worked in a family business?",
  "Have you built something on your own?",
  "Have you learned a skill by yourself?",
  "Have you done an internship or industrial training?",
];

const input = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function ExperienceManager({ token, initial }: { token: string; initial: TalentProfile }) {
  const [profile, setProfile] = useState(initial);
  const [form, setForm] = useState({ type: "academic_project", title: "", organisation: "", description: "", evidence_url: "", started_on: "", ended_on: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const payload = Object.fromEntries(Object.entries(form).filter(([, v]) => v !== "")) as typeof form;
      const res = await api.addExperience(token, payload);
      setProfile(res.profile);
      setMsg({ ok: true, text: res.message });
      toast(res.message);
      setForm((f) => ({ ...f, title: "", organisation: "", description: "", evidence_url: "", started_on: "", ended_on: "" }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save. Try again.";
      setMsg({ ok: false, text: message });
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    await api.deleteExperience(token, id).catch(() => null);
    setProfile((p) => ({ ...p, experiences: p.experiences.filter((x) => x.id !== id) }));
    toast("Experience removed.", "info");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
      <form onSubmit={submit} className="h-fit space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:sticky lg:top-24">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Tell us what your CV leaves out</h1>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {PROMPTS.map((p) => (
              <li key={p} className="rounded-full bg-paper px-3 py-1 text-xs text-slate-600">{p}</li>
            ))}
          </ul>
        </div>
        <label className="block text-sm font-semibold">
          Type of experience
          <select value={form.type} onChange={set("type")} className={input}>
            {Object.entries(profile.experience_types).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Title
          <input required value={form.title} onChange={set("title")} placeholder="Hospital management system (final year project)" className={input} />
        </label>
        <label className="block text-sm font-semibold">
          Organisation, school or business <span className="font-normal text-slate-400">(optional)</span>
          <input value={form.organisation} onChange={set("organisation")} className={input} />
        </label>
        <label className="block text-sm font-semibold">
          What did you do?
          <textarea rows={5} value={form.description} onChange={set("description")} placeholder="Describe tasks, tools and results in your own words. Plain language is fine." className={input} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">From<input value={form.started_on} onChange={set("started_on")} placeholder="2024" className={input} /></label>
          <label className="block text-sm font-semibold">To<input value={form.ended_on} onChange={set("ended_on")} placeholder="Present" className={input} /></label>
        </div>
        <label className="block text-sm font-semibold">
          Evidence link <span className="font-normal text-slate-400">(GitHub, portfolio, document)</span>
          <input type="url" value={form.evidence_url} onChange={set("evidence_url")} placeholder="https://" className={input} />
        </label>
        {msg && <p className={`rounded-xl px-4 py-3 text-sm ${msg.ok ? "bg-brand-50 text-brand-700" : "bg-rose-50 text-rose-700"}`}>{msg.text}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60">
          {busy ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner />
              Discovering skills...
            </span>
          ) : (
            "Save and discover skills"
          )}
        </button>
      </form>

      <div className="space-y-4">
        <h2 className="font-display text-xl font-bold">Your experiences ({profile.experiences.length})</h2>
        {profile.experiences.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            Nothing here yet. Your first project or volunteering role is a great start.
          </p>
        )}
        {profile.experiences.map((e) => (
          <article key={e.id} className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-brand-700">{e.type_label}</p>
                <h3 className="mt-1 font-display text-lg font-bold">{e.title}</h3>
                <p className="text-sm text-slate-500">{[e.organisation, [e.started_on, e.ended_on].filter(Boolean).join(" to ")].filter(Boolean).join(" | ")}</p>
              </div>
              <button onClick={() => remove(e.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-700">Remove</button>
            </div>
            {e.description && <p className="mt-3 text-sm leading-relaxed text-slate-600">{e.description}</p>}
            {e.inferred_skills.length > 0 && (
              <div className="mt-4 rounded-2xl bg-paper p-4">
                <p className="text-xs font-bold text-slate-500">Possible skills (AI-inferred, not yet verified)</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {e.inferred_skills.map((s) => (
                    <span key={s} className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold ring-1 ring-slate-200">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {e.evidence_url && (
              <a href={e.evidence_url} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-bold text-brand-700 hover:underline">View evidence</a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
