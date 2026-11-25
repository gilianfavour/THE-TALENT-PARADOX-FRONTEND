import type { Metadata } from "next";
import { Manrope, Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import SignOutButton from "@/components/SignOutButton";
import { sessionToken } from "@/lib/session";
import "./globals.css";
import Toaster from "@/components/Toaster";

const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display-face" });

export const metadata: Metadata = {
  title: "TalentBridge by Donswift | Discover. Verify. Connect.",
  description: "Because the best candidate is not always the one with the best CV.",
};

const NAV = [
  ["/vacancies", "Vacancies"],
  ["/platform", "Platform"],
  ["/how-it-works", "How it works"],
  ["/recruiters", "Recruiters"],
  ["/fairness", "Fairness"],
  ["/help", "Help"],
] as const;

const FOOTER: { title: string; links: [string, string][] }[] = [
  { title: "Candidates", links: [["/vacancies", "Open vacancies"], ["/register", "Create an account"], ["/login", "Sign in"], ["/portal", "My portal"], ["/graduates", "Graduate pathway"], ["/how-it-works", "How it works"], ["/faq", "FAQ"], ["/help", "Help assistant"]] },
  { title: "Platform", links: [["/platform", "Overview"], ["/platform/discover", "Discover"], ["/platform/verify", "Verify"], ["/platform/connect", "Connect"], ["/fairness", "Fairness"]] },
  { title: "Donswift", links: [["/about", "About"], ["/recruiters", "For recruiters"], ["/employers", "For employers"], ["/contact", "Contact"], ["/privacy", "Privacy"], ["/terms", "Terms"]] },
];

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const signedIn = Boolean(await sessionToken());
  return (
    <html lang="en" className={`h-full ${body.variable} ${display.variable}`}>
      <body className="flex min-h-full flex-col bg-paper text-ink antialiased">
        <ScrollReveal />
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur transition-shadow duration-300">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
            <Link href="/" aria-label="TalentBridge home">
              <Logo />
            </Link>
            <nav className="flex items-center gap-1 text-sm font-semibold text-slate-600">
              {NAV.map(([href, label]) => (
                <Link key={href} href={href} className="hidden rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-ink lg:inline">
                  {label}
                </Link>
              ))}
              {signedIn ? (
                <>
                  <Link href="/portal" className="ml-1 hidden rounded-lg border border-slate-300 bg-white px-4 py-2 text-ink transition hover:border-slate-400 sm:inline">
                    My portal
                  </Link>
                  <SignOutButton className="hidden rounded-lg px-3 py-2 transition hover:bg-slate-100 hover:text-ink xl:inline" />
                </>
              ) : (
                <Link href="/login" className="ml-1 hidden rounded-lg border border-slate-300 bg-white px-4 py-2 text-ink transition hover:border-slate-400 sm:inline">
                  Sign in
                </Link>
              )}
              <Link href="/vacancies" className="tb-sheen ml-1 hidden rounded-lg bg-brand-600 px-4 py-2 text-white shadow-sm transition hover:bg-brand-700 sm:inline-block">
                Find a role
              </Link>
              <details className="group relative lg:hidden">
                <summary className="ml-1 flex cursor-pointer list-none items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-ink">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                  Menu
                </summary>
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  {[...NAV, ["/graduates", "Graduates"], ["/employers", "Employers"], ["/faq", "FAQ"], signedIn ? ["/portal", "My portal"] : ["/login", "Sign in"], ...(signedIn ? [] : [["/register", "Create account"]])].map(([href, label]) => (
                    <Link key={href} href={href} className="block rounded-xl px-4 py-2.5 hover:bg-slate-100 hover:text-ink">
                      {label}
                    </Link>
                  ))}
                  <Link href="/vacancies" className="mt-1 block rounded-xl bg-brand-600 px-4 py-2.5 text-center text-white">Find a role</Link>
                  {signedIn && <SignOutButton className="mt-1 block w-full rounded-xl px-4 py-2.5 text-left hover:bg-slate-100 hover:text-ink" />}
                </div>
              </details>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10">{children}</main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <div>
              <Logo />
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
                Discover. Verify. Connect. Because the best candidate is not always the one with the best CV.
              </p>
              <p className="mt-4 text-xs leading-relaxed text-slate-400">Donswift Company Ltd, Kampala, Uganda. Built with the Data Protection and Privacy Act, 2019 in mind.</p>
            </div>
            {FOOTER.map((col) => (
              <div key={col.title} className="text-sm">
                <p className="font-bold text-ink">{col.title}</p>
                <ul className="mt-3 space-y-2 text-slate-500">
                  {col.links.map(([href, label]) => (
                    <li key={href}><Link href={href} className="transition hover:text-brand-700">{label}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100">
            <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-slate-400">&copy; {new Date().getFullYear()} Donswift Company Ltd. AI discovers and supports. Humans make the decisions.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
