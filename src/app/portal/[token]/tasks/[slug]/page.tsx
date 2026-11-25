import Link from "next/link";
import { api } from "@/lib/api";
import TaskWorkspace from "./TaskWorkspace";

export const dynamic = "force-dynamic";

export default async function TaskPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string; slug: string }>;
  searchParams: Promise<{ job?: string }>;
}) {
  const { token, slug } = await params;
  const { job } = await searchParams;
  const task = await api.task(token, slug, job);

  return (
    <div className="space-y-6">
      <Link href={`/portal/${token}/assessments`} className="text-sm font-bold text-slate-500 hover:text-ink">&larr; All assessments</Link>
      <TaskWorkspace token={token} task={task} />
    </div>
  );
}
