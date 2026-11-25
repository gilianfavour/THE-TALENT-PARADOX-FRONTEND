"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { api, type TalentProfile } from "@/lib/api";

const input = "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export default function SettingsForm({ token, initial }: { token: string; initial: TalentProfile["candidate"] }) {
  const [c, setC] = useState(initial);
  const [saved, setSaved] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await api.updateProfile(token, {
        name: c.name, phone: c.phone, location: c.location, headline: c.headline,
        career_interests: c.career_interests, talent_pool_visible: c.talent_pool_visible, consent_rediscovery: c.consent_rediscovery,
      });
      setC(res.candidate);
      setSaved("Saved. Your profile is up to date.");
      toast("Settings saved.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not save.";
      setSaved(message);
      toast(message, "error");
    } finally {
      setBusy(false);
    }
  }

  const text = (k: "name" | "phone" | "location" | "headline" | "career_interests", label: string, ph = "") => (
    <label className="block text-sm font-semibold">
      {label}
      <input value={c[k] ?? ""} placeholder={ph} onChange={(e) => setC({ ...c, [k]: e.target.value })} className={input} />
    </label>
  );

  return (
    <form onSubmit={save} className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h1 className="font-display text-2xl font-bold">Account and profile</h1>
        {text("name", "Full name")}
        {text("headline", "Headline", "Junior developer and data enthusiast")}
        {text("career_interests", "Career interests", "Data, finance, project support")}
        <div className="grid gap-4 sm:grid-cols-2">
          {text("phone", "Phone")}
          {text("location", "Location", "Kampala")}
        </div>
        <p className="text-xs text-slate-400">Email: {c.email}</p>
      </section>
      <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Privacy and consent</h2>
        {[
          ["talent_pool_visible", "Let recruiters find me in the talent pool", "Recruiters can discover your profile for roles you did not apply for."],
          ["consent_rediscovery", "Consider me for other suitable vacancies", "A recruiter still reviews every suggestion and you can always decline."],
        ].map(([k, t, d]) => (
          <label key={k} className="flex cursor-pointer gap-4 rounded-2xl bg-paper p-4">
            <input
              type="checkbox"
              checked={Boolean(c[k as "talent_pool_visible"])}
              onChange={(e) => setC({ ...c, [k]: e.target.checked })}
              className="mt-1 h-5 w-5 accent-brand-600"
            />
            <span>
              <span className="block text-sm font-bold">{t}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-slate-500">{d}</span>
            </span>
          </label>
        ))}
        <p className="text-xs leading-relaxed text-slate-500">
          Built with Uganda&apos;s Data Protection and Privacy Act, 2019 in mind. You can ask Donswift for a copy of your data or to delete it at any time.
        </p>
        {saved && <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700">{saved}</p>}
        <button disabled={busy} className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">
          {busy ? (
            <span className="inline-flex items-center justify-center gap-2">
              <Spinner />
              Saving...
            </span>
          ) : (
            "Save changes"
          )}
        </button>
      </section>
    </form>
  );
}
