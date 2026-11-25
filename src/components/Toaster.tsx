"use client";

import { useEffect, useState } from "react";

type Kind = "success" | "error" | "info";
type Toast = { id: number; message: string; kind: Kind };

const EVENT = "tb-toast";

/** Fire a toast from any client component: toast("Saved", "success"). */
export function toast(message: string, kind: Kind = "success") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<Omit<Toast, "id">>(EVENT, { detail: { message, kind } }));
}

const STYLE: Record<Kind, string> = {
  success: "bg-ink text-white",
  error: "bg-brand-600 text-white",
  info: "bg-white text-ink ring-1 ring-slate-200",
};

function Icon({ kind }: { kind: Kind }) {
  if (kind === "error") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v5m0 3h.01M10.3 3.9 2.6 17.2A2 2 0 0 0 4.3 20h15.4a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 shrink-0 ${kind === "success" ? "text-brand-500" : "text-brand-600"}`} fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
      {kind === "success" ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8h.01M11 12h1v5h1" />
      )}
    </svg>
  );
}

export default function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    let seq = 0;
    const onToast = (e: Event) => {
      const { message, kind } = (e as CustomEvent<Omit<Toast, "id">>).detail;
      const id = ++seq + Date.now();
      setItems((xs) => [...xs.slice(-3), { id, message, kind }]);
      window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 4200);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:right-6 sm:left-auto sm:items-end">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`tb-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold shadow-[0_18px_40px_-12px_rgba(10,10,10,0.45)] ${STYLE[t.kind]}`}
        >
          <Icon kind={t.kind} />
          <p className="flex-1 leading-snug">{t.message}</p>
          <button
            onClick={() => setItems((xs) => xs.filter((x) => x.id !== t.id))}
            className="-mr-1 rounded-md px-1.5 text-base leading-none opacity-60 transition hover:opacity-100"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

/** Shows a toast once when a page loads, e.g. after a redirect. */
export function FlashToast({ message, kind = "success" }: { message: string; kind?: Kind }) {
  useEffect(() => {
    toast(message, kind);
  }, [message, kind]);
  return null;
}
