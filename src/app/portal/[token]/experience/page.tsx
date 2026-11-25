import { api } from "@/lib/api";
import ExperienceManager from "./ExperienceManager";

export const dynamic = "force-dynamic";

export default async function ExperiencePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const profile = await api.profile(token);
  return <ExperienceManager token={token} initial={profile} />;
}
