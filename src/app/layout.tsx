import type { Metadata } from "next";
import { Manrope, Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face" });

export const metadata: Metadata = {
  title: "TalentBridge by Donswift | Discover. Verify. Connect.",
  description: "Because the best candidate is not always the one with the best CV.",
};

function Logo() {
  return (
    <span className="flex items-center gap-2.5">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden>
        <rect width="32" height="32" rx="9" className="fill-brand-600" />
        <path d="M6 21c3.5-7 16.5-7 20 0" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <path d="M10 21v-3.2M16 21v-5.5M22 21v-3.2" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="16" cy="9.5" r="2.4" className="fill-white" />
      </svg>
      <span className="font-display text-lg font-bold tracking-tight text-ink">TalentBridge</span>
    </span>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${body.variable} ${display.variable}`}>
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" aria-label="TalentBridge home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold text-slate-600">
              {[
                ["/vacancies", "Vacancies"],
                ["/how-it-works", "How it works"],
                ["/recruiters", "For recruiters"],
                ["/fairness", "Fairness"],
                ["/help", "Help"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="hidden rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-ink lg:inline">
                  {label}
                </Link>
              ))}
              <Link href="/vacancies" className="rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-ink lg:hidden">
                Vacancies
              </Link>
              <Link href="/portal" className="ml-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-ink transition hover:border-slate-400">
                My portal
              </Link>
              <Link href="/vacancies" className="ml-1 hidden rounded-lg bg-brand-600 px-4 py-2 text-white shadow-sm transition hover:bg-brand-700 sm:inline">
                Find a role
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
                Because the best candidate is not always the one with the best CV.
              </p>
            </div>
            <div className="text-sm">
              <p className="font-bold text-ink">Candidates</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><Link href="/vacancies" className="hover:text-brand-700">Open vacancies</Link></li>
                <li><Link href="/portal" className="hover:text-brand-700">My portal</Link></li>
                <li><Link href="/how-it-works" className="hover:text-brand-700">How it works</Link></li>
                <li><Link href="/help" className="hover:text-brand-700">Help centre</Link></li>
              </ul>
            </div>
            <div className="text-sm">
              <p className="font-bold text-ink">Donswift</p>
              <ul className="mt-3 space-y-2 text-slate-500">
                <li><Link href="/recruiters" className="hover:text-brand-700">For recruiters</Link></li>
                <li><Link href="/fairness" className="hover:text-brand-700">Fairness and privacy</Link></li>
              </ul>
            </div>
            <div className="text-sm text-slate-500">
              <p className="font-bold text-ink">Donswift Company Ltd</p>
              <p className="mt-3 leading-relaxed">Kampala, Uganda. Built with the Data Protection and Privacy Act, 2019 in mind.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
