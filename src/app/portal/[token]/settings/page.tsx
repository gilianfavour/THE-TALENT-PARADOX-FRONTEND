import { api } from "@/lib/api";
import { portalOwner } from "@/lib/session";
import SettingsForm from "./SettingsForm";
import PasswordForm from "./PasswordForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [p, owner] = await Promise.all([api.profile(token), portalOwner(token)]);
  return (
    <div className="space-y-6">
      <PasswordForm token={token} hasPassword={Boolean(owner?.has_password)} email={p.candidate.email} />
      <SettingsForm token={token} initial={p.candidate} />
    </div>
  );
}
