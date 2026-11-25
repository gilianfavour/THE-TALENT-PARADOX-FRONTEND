const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8500/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? `API ${res.status}`);
  }
  return res.json();
}

export interface JobSummary {
  id: number;
  title: string;
  client: string;
  location: string;
  type: string;
  salary: [number, number] | null;
  deadline: string | null;
  summary: string | null;
}

export interface JobDetail extends JobSummary {
  description: string;
  requirements: {
    required_skills: { name: string; importance: string }[];
    preferred_skills: { name: string; importance: string }[];
    years_min: number | null;
    education_min: string | null;
  } | null;
}

export interface PortalData {
  candidate: { name: string; email: string; headline: string | null; status: string };
  skills: {
    claimed: { name: string; years: number | null; evidence: string | null }[];
    demonstrated: { name: string; score: number }[];
  };
  applications: {
    job: string;
    client: string;
    status: string;
    score: number | null;
    explanations: string[];
    signals: string[];
    better_fit: { title: string; score: number; client: string } | null;
  }[];
  suggested_jobs: { job_id: number; title: string; client: string; score: number; signals: string[]; top_reasons: string[] }[];
}

export interface AssessmentQuestion {
  id: number;
  skill_id: number;
  skill: string;
  question: string;
  options: string[];
}

export const api = {
  jobs: () => get<JobSummary[]>("/jobs"),
  job: (id: string) => get<JobDetail>(`/jobs/${id}`),
  apply: (payload: { job_id: number; name: string; email: string; phone?: string; location?: string; cv_text: string }) =>
    post<{ message: string; portal_url: string; token: string; initial_match: { score: number; signals: string[] } }>("/applications", payload),
  portal: (token: string) => get<PortalData>(`/portal/${token}`),
  assessmentQuestions: (token: string) => get<AssessmentQuestion[]>(`/portal/${token}/assessment`),
  submitAssessment: (token: string, payload: { answers: { question_id: number; answer_index: number }[] }) =>
    post<{ overall_score: number; message: string }>(`/portal/${token}/assessment`, payload),
  help: (q: string) => get<{ answer: string }>(`/help?q=${encodeURIComponent(q)}`),
};

export function fmtMoney(amount: number) {
  return "UGX " + amount.toLocaleString();
}
