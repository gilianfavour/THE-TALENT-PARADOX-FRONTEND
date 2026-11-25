import { api } from "@/lib/api";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const p = await api.profile(token);
  return <SettingsForm token={token} initial={p.candidate} />;
}
