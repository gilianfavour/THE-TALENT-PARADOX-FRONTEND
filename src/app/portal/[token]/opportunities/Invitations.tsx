"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "@/components/Toaster";
import Spinner from "@/components/Spinner";
import { api, type Invitation } from "@/lib/api";

export default function Invitations({ token, initial }: { token: string; initial: Invitation[] }) {
  const [items, setItems] = useState(initial);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  async function respond(id: number, decision: "accept" | "decline") {
    setBusy(id);
    try {
      const res = await api.respond(token, id, decision);
      setItems((xs) => xs.map((x) => (x.id === id ? { ...x, status: res.status as Invitation["status"] } : x)));
      setNote(res.message);
      toast(res.message, decision === "accept" ? "success" : "info");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Your answer was not saved. Try again.";
      setNote(message);
      toast(message, "error");
    } finally {
      setBusy(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No invitations yet. When a recruiter approves another role for you, it appears here.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {note && <p className="rounded-2xl bg-brand-50 px-5 py-3 text-sm font-semibold text-brand-700">{note}</p>}
      {items.map((i) => (
        <article key={i.id} className="rounded-3xl border-2 border-brand-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="rounded-full bg-brand-600 px-3 py-1 text-xs font-bold text-white">Recruiter invitation</span>
              <h2 className="mt-3 font-display text-2xl font-bold">{i.title}</h2>
              <p className="text-sm text-slate-500">{[i.client, i.location, i.deadline && `Closes ${i.deadline}`].filter(Boolean).join(" | ")}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-4xl font-bold text-brand-700">{i.score}</p>
              <p className="text-xs text-slate-400">compatibility</p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-paper p-4">
              <p className="text-sm font-bold">Why we think you fit</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">{i.reasons.map((r) => <li key={r}>{r}</li>)}</ul>
            </div>
            <div className="rounded-2xl bg-paper p-4">
              <p className="text-sm font-bold">Not yet demonstrated</p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                {i.gaps.length ? i.gaps.map((g) => <li key={g}>{g}</li>) : <li>Nothing major. A skills check would still help.</li>}
              </ul>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {i.status === "invited" ? (
              <>
                <button disabled={busy === i.id} onClick={() => respond(i.id, "accept")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white hover:bg-brand-700 disabled:opacity-60">{busy === i.id && <Spinner />}Yes, consider me</button>
                <button disabled={busy === i.id} onClick={() => respond(i.id, "decline")} className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-bold hover:border-slate-400 disabled:opacity-60">No, thanks</button>
              </>
            ) : (
              <span className={`rounded-full px-4 py-2 text-sm font-bold ${i.status === "accepted" ? "bg-brand-50 text-brand-700" : "bg-slate-100 text-slate-600"}`}>
                {i.status === "accepted" ? "Accepted. A recruiter will be in touch." : "Declined. Your other applications are unaffected."}
              </span>
            )}
            <Link href={`/jobs/${i.job_id}`} className="text-sm font-bold text-slate-600 hover:text-ink">View vacancy</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
