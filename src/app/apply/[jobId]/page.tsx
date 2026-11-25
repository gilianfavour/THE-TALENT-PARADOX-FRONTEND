import { api } from "@/lib/api";
import { currentUser } from "@/lib/session";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const [job, user] = await Promise.all([api.job(jobId), currentUser()]);
  return (
    <ApplyForm
      job={{ id: job.id, title: job.title, client: job.client }}
      user={user ? { token: user.token, name: user.name, email: user.email } : null}
    />
  );
}
