"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  ["", "Dashboard"],
  ["/profile", "Talent Profile"],
  ["/skills", "My Skills"],
  ["/experience", "Projects & Experience"],
  ["/assessments", "Assessments"],
  ["/opportunities", "Opportunities"],
  ["/applications", "My Applications"],
  ["/notifications", "Notifications"],
  ["/settings", "Settings"],
] as const;

export default function PortalNav({ token }: { token: string }) {
  const path = usePathname();
  const base = `/portal/${token}`;
  return (
    <nav className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0" aria-label="Candidate portal">
      <ul className="flex min-w-max gap-1 rounded-2xl border border-slate-200 bg-white p-1.5">
        {TABS.map(([href, label]) => {
          const full = base + href;
          const active = href === "" ? path === base : path.startsWith(full);
          return (
            <li key={href}>
              <Link
                href={full}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  active ? "bg-ink text-white" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
