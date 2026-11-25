"use client";

import Link from "next/link";
import { useState } from "react";
import { api, type NotificationItem } from "@/lib/api";

const ICON: Record<string, string> = { rediscovery: "R", application: "A", assessment: "S", interview: "I" };

export default function Notifications({ token, initial }: { token: string; initial: { unread: number; items: NotificationItem[] } }) {
  const [data, setData] = useState(initial);

  async function readAll() {
    await api.markRead(token).catch(() => null);
    setData((d) => ({ unread: 0, items: d.items.map((i) => ({ ...i, read_at: i.read_at ?? new Date().toISOString() })) }));
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-6 sm:p-8">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">{data.unread} unread</p>
        </div>
        {data.unread > 0 && (
          <button onClick={readAll} className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold hover:border-slate-400">Mark all as read</button>
        )}
      </header>
      <ul className="divide-y divide-slate-100">
        {data.items.length === 0 && <li className="p-8 text-center text-sm text-slate-500">You are all caught up.</li>}
        {data.items.map((n) => (
          <li key={n.id} className={`flex gap-4 p-6 ${n.read_at ? "" : "bg-brand-50/40"}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display font-bold ${n.read_at ? "bg-slate-100 text-slate-500" : "bg-brand-600 text-white"}`}>
              {ICON[n.type] ?? "N"}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-bold">{n.title}</p>
                <time className="text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</time>
              </div>
              {n.body && <p className="mt-1 text-sm leading-relaxed text-slate-600">{n.body}</p>}
              {n.link && <Link href={`/portal/${token}${n.link}`} className="mt-2 inline-block text-sm font-bold text-brand-700 hover:underline">Open</Link>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
