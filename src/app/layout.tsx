import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecondLook - Beyond the CV",
  description: "Find the talent that CV screening keeps missing.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-slate-50 text-slate-900 antialiased">
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
            <a href="/" className="text-xl font-bold tracking-tight">
              <span className="text-indigo-600">Second</span>Look
              <span className="ml-2 align-middle text-xs font-medium text-slate-400">by Donswift</span>
            </a>
            <nav className="text-sm text-slate-500">Beyond the CV</nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-4 py-8">{children}</main>
        <footer className="mt-16 border-t bg-white py-6 text-center text-xs text-slate-400">
          SecondLook - where technology finds the talent that paper hides.
        </footer>
      </body>
    </html>
  );
}
