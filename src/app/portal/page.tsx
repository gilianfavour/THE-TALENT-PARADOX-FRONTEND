import { redirect } from "next/navigation";
import { currentUser } from "@/lib/session";
import PortalEntry from "./PortalEntry";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  const user = await currentUser();
  if (user) redirect(`/portal/${user.token}`);
  return <PortalEntry />;
}
