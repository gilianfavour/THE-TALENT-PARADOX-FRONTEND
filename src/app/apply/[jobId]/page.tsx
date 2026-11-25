import { api } from "@/lib/api";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";

export default async function ApplyPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = await params;
  const job = await api.job(jobId);
  return <ApplyForm job={{ id: job.id, title: job.title, client: job.client }} />;
}
