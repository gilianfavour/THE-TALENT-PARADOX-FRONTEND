import { redirect } from "next/navigation";
import PortalNav from "./PortalNav";
import { portalOwner, sessionToken } from "@/lib/session";

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;

  // once a candidate has an account, their portal needs them signed in
  const [owner, session] = await Promise.all([portalOwner(token), sessionToken()]);
  if (owner?.has_password && session !== token) {
    redirect(`/login?next=${encodeURIComponent(`/portal/${token}`)}`);
  }

  return (
    <div className="space-y-8">
      {owner && !owner.has_password && (
        <a href={`/portal/${token}/settings#account`} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-brand-200 bg-brand-50 px-5 py-3 text-sm text-brand-700 transition hover:border-brand-500">
          <span><strong className="font-bold">Secure your portal.</strong> Set a password so you can sign in with your email on any device.</span>
          <span className="font-bold">Set password &rarr;</span>
        </a>
      )}
      <PortalNav token={token} />
      {children}
    </div>
  );
}
