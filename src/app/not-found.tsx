import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-display text-6xl font-bold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold">This page does not exist</h1>
      <p className="mt-2 text-slate-600">The link may be old, or the vacancy may have closed.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
          Go home
        </Link>
        <Link href="/vacancies" className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold">
          See vacancies
        </Link>
      </div>
    </div>
  );
}
