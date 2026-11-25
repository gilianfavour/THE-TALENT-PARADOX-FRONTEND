"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, job_id: job.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Could not submit");
      router.push(`/portal/${data.token}?welcome=1`);
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600">Applying for</p>
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-sm text-slate-500">{job.client}</p>
      </div>

      <form onSubmit={submit} className="space-y-4 rounded-xl border bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Full name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Your name" />
          </label>
          <label className="text-sm font-medium">
            Email
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="you@email.com" />
          </label>
          <label className="text-sm font-medium">
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="07..." />
          </label>
          <label className="text-sm font-medium">
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="mt-1 w-full rounded-lg border px-3 py-2" placeholder="Dar es Salaam" />
          </label>
        </div>
        <label className="block text-sm font-medium">
          Paste your CV (or describe your experience)
          <textarea required value={form.cv_text} onChange={(e) => setForm({ ...form, cv_text: e.target.value })}
            rows={10} className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-xs"
            placeholder="Paste your CV here. No fancy formatting needed - we read for substance." />
        </label>
        {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white disabled:opacity-60">
          {busy ? "Submitting..." : "Submit application"}
        </button>
        <p className="text-xs text-slate-400">
          We parse your CV for skills, then invite you to a short skills check. Your portal link appears after submission.
        </p>
      </form>
    </div>
  );
}
