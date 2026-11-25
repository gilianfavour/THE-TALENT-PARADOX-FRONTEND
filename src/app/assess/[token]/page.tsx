import { api } from "@/lib/api";
import Quiz from "./Quiz";

export const dynamic = "force-dynamic";

export default async function AssessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const questions = await api.assessmentQuestions(token);
  return <Quiz token={token} questions={questions} />;
}
