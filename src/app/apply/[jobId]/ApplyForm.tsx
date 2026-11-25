"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const PROMPTS = [
  "Academic or personal projects",
  "Family business or informal work",
  "Volunteering and community work",
  "Internships or industrial training",
  "Skills you taught yourself",
];

export default function ApplyForm({ job }: { job: { id: number; title: string; client: string } }) {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", cv_text: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, job_id: job.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "We could not submit your application. Check the fields and try again.");
      toast("Application submitted. Opening your private portal.");
      router.push(`/portal/${data.token}?welcome=1`);
    } catch (err) {
      const message = err instanceof Error ? err.message : "We could not submit your application.";
      setError(message);
      toast(message, "error");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_300px]">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-brand-700">Applying for</p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight">{job.title}</h1>
          <p className="mt-1 text-slate-500">{job.client}</p>
        </div>

        <form onSubmit={submit} className="space-y-5 rounded-3xl border border-slate-200 bg-white p-7">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold">
              Full name
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="e.g. Amina Nakato" />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="you@example.com" />
            </label>
            <label className="block text-sm font-semibold">
              Phone <span className="font-normal text-slate-400">(optional)</span>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} placeholder="+256 7xx xxx xxx" />
            </label>
            <label className="block text-sm font-semibold">
              Location <span className="font-normal text-slate-400">(optional)</span>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={input} placeholder="Kampala" />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Your experience and CV
            <span className="mt-0.5 block text-xs font-normal text-slate-500">
              Paste your CV, or simply describe what you have done. Formatting does not count against you.
            </span>
            <textarea
              required
              minLength={50}
              rows={12}
              value={form.cv_text}
              onChange={(e) => setForm({ ...form, cv_text: e.target.value })}
              className={`${input} leading-relaxed`}
              placeholder="e.g. For 4 years I ran stock and daily sales records at my family's shop in Kisenyi. I also coordinated 30 volunteers for a community clean-up..."
            />
            <span className="mt-1 block text-right text-xs font-normal text-slate-400">{form.cv_text.length} characters (50 minimum)</span>
          </label>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {busy ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner />
                Submitting your application...
              </span>
            ) : (
              "Submit application"
            )}
          </button>
          <p className="text-center text-xs leading-relaxed text-slate-500">
            By applying you agree that Donswift recruiters can review your profile for this and other suitable roles. You can
            decline any invitation.
          </p>
        </form>
      </div>

      <aside className="space-y-4 lg:pt-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold">Don&apos;t leave out</h2>
          <p className="mt-1 text-sm text-slate-500">These count as real experience here.</p>
          <ul className="mt-4 space-y-2.5 text-sm text-slate-700">
            {PROMPTS.map((p) => (
              <li key={p} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl bg-brand-50 p-6 text-sm leading-relaxed text-brand-700">
          <p className="font-bold">What happens next</p>
          <p className="mt-2">You get a private portal to track your status, see why you match, and take a short skills check.</p>
        </div>
      </aside>
    </div>
  );
}
