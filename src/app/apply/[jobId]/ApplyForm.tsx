"use client";

import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import Link from "next/link";

const input =
  "mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

const PROMPTS = [
  "Academic or personal projects",
  "Family business or informal work",
  "Volunteering and community work",
  "Internships or industrial training",
  "Skills you taught yourself",
];

export default function ApplyForm({
  job,
  user,
}: {
  job: { id: number; title: string; client: string };
  user: { token: string; name: string; email: string } | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: "", location: "", cv_text: "", password: "", password_confirmation: "" });
  const [needsSignIn, setNeedsSignIn] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [reading, setReading] = useState(false);

  async function uploadCv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setReading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/cv", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "We could not read that file.");
      setForm((f) => ({ ...f, cv_text: data.text }));
      setCvFile(file.name);
      toast("CV read. Check the text below and add anything it leaves out.");
    } catch (err) {
      toast(err instanceof Error ? err.message : "We could not read that file.", "error");
    } finally {
      setReading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...form,
          password: form.password || undefined,
          password_confirmation: form.password ? form.password_confirmation : undefined,
          session_token: user?.token,
          job_id: job.id,
        }),
      });
      const data = await res.json();
      if (res.status === 409 && data.needs_sign_in) setNeedsSignIn(true);
      if (!res.ok) {
        const first = data.errors ? (Object.values(data.errors)[0] as string[])[0] : null;
        throw new Error(first ?? data.message ?? "We could not submit your application. Check the fields and try again.");
      }
      if (data.has_account && !user) {
        await fetch("/api/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "adopt", token: data.token }) });
      }
      toast(data.has_account ? "Application submitted. You are signed in to your account." : "Application submitted. Opening your private portal.");
      router.push(`/portal/${data.token}?welcome=1`);
      router.refresh();
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
              <input required readOnly={Boolean(user)} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} placeholder="e.g. Amina Nakato" />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input required readOnly={Boolean(user)} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} placeholder="you@example.com" />
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

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-slate-300 bg-paper px-4 py-4">
            <div>
              <p className="text-sm font-semibold">Upload your CV <span className="font-normal text-slate-400">(PDF, Word or text)</span></p>
              <p className="text-xs text-slate-500">{cvFile ? `Read from ${cvFile}. Check and correct the text below.` : "We read it into the box below so you can check it before applying."}</p>
            </div>
            <label className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${reading ? "bg-slate-200 text-slate-500" : "bg-ink text-white hover:bg-zinc-800"}`}>
              {reading ? (
                <>
                  <Spinner /> Reading CV...
                </>
              ) : cvFile ? (
                "Replace file"
              ) : (
                "Choose file"
              )}
              <input type="file" accept=".pdf,.docx,.txt,application/pdf,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={uploadCv} disabled={reading} className="sr-only" />
            </label>
          </div>

          <label className="block text-sm font-semibold">
            Your experience and CV
            <span className="mt-0.5 block text-xs font-normal text-slate-500">
              Upload above, paste your CV, or simply describe what you have done. Formatting does not count against you.
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

          {user ? (
            <p className="rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
              Applying as <strong>{user.email}</strong>. This goes into your existing Talent Profile.
            </p>
          ) : (
            <div className="rounded-2xl border border-slate-200 p-4">
              <p className="text-sm font-semibold">Create an account <span className="font-normal text-slate-400">(optional, recommended)</span></p>
              <p className="mt-0.5 text-xs text-slate-500">
                Choose a password to sign in later with your email. Skip it and we give you a private portal link instead.{" "}
                <Link href={`/login?next=/apply/${job.id}`} className="font-bold text-brand-700 hover:underline">Already have an account? Sign in</Link>
              </p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <input type="password" minLength={8} autoComplete="new-password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={input} placeholder="Password (8+ characters)" />
                <input type="password" minLength={8} autoComplete="new-password" required={form.password.length > 0} value={form.password_confirmation} onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} className={input} placeholder="Confirm password" />
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}{" "}
              {needsSignIn && <Link href={`/login?next=/apply/${job.id}`} className="font-bold underline">Sign in to apply</Link>}
            </p>
          )}

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
