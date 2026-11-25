import { api } from "@/lib/api";
import Notifications from "./Notifications";

export const dynamic = "force-dynamic";

export default async function NotificationsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const data = await api.notifications(token);
  return <Notifications token={token} initial={data} />;
}
