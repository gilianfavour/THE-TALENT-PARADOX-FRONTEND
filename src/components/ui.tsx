import Link from "next/link";
import type { EvidenceLevel } from "@/lib/api";

export function PageHero({ eyebrow, title, intro, children }: { eyebrow?: string; title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <header className="max-w-3xl">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">{eyebrow}</p>}
      <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">{title}</h1>
      {intro && <p className="mt-4 text-lg leading-relaxed text-slate-600">{intro}</p>}
      {children && <div className="mt-7 flex flex-wrap gap-3">{children}</div>}
    </header>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 ${className}`}>{children}</section>;
}

export function Btn({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "ghost" | "light" }) {
  const styles = {
    primary: "tb-sheen bg-brand-600 text-white shadow-sm hover:bg-brand-700",
    ghost: "border border-slate-300 bg-white text-ink hover:border-slate-400",
    light: "bg-white text-brand-700 hover:bg-brand-50",
  }[variant];
  return (
    <Link href={href} className={`inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition ${styles}`}>
      {children}
    </Link>
  );
}

export function Check() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

export function FeatureGrid({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <div key={p.t} className="rounded-3xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60">
          <Check />
          <h3 className="mt-4 font-display text-lg font-bold">{p.t}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.d}</p>
        </div>
      ))}
    </div>
  );
}

export function CtaBand({ title, text, href, label }: { title: string; text: string; href: string; label: string }) {
  return (
    <section className="tb-sheen tb-sheen-soft flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-8 text-white sm:p-10">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl font-bold">{title}</h2>
        <p className="mt-2 leading-relaxed text-zinc-300">{text}</p>
      </div>
      <Btn href={href} variant="light">{label}</Btn>
    </section>
  );
}

export const LEVEL_STYLE: Record<EvidenceLevel, string> = {
  self_reported: "bg-slate-100 text-slate-600 ring-slate-200",
  ai_inferred: "bg-zinc-100 text-zinc-800 ring-zinc-300",
  evidence_supported: "bg-amber-50 text-amber-800 ring-amber-200",
  assessed: "bg-brand-50 text-brand-700 ring-brand-200",
  human_validated: "bg-brand-600 text-white ring-brand-600",
};

export function LevelBadge({ level, label }: { level: EvidenceLevel; label: string }) {
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ring-1 ${LEVEL_STYLE[level]}`}>{label}</span>;
}

export function Empty({ title, text, href, label }: { title: string; text: string; href?: string; label?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-paper p-8 text-center">
      <p className="font-display text-lg font-bold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{text}</p>
      {href && label && (
        <Link href={href} className="mt-4 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-700">
          {label}
        </Link>
      )}
    </div>
  );
}

export function scoreTone(score: number) {
  return score >= 70 ? "text-brand-700" : score >= 45 ? "text-zinc-900" : "text-slate-500";
}
