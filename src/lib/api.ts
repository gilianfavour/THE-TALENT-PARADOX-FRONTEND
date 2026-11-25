const API = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8500/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return res.json();
}

async function post<T>(path: string, body: unknown, method = "POST"): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method,
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
    behavioural_expectations?: string[];
    practical_tasks?: string[];
    mandatory_suggestions?: string[];
    engine?: string;
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
  unread_notifications?: number;
  open_invitations?: number;
}

export type EvidenceLevel = "self_reported" | "ai_inferred" | "evidence_supported" | "assessed" | "human_validated";

export interface TalentSkill {
  id: number;
  name: string;
  category: string | null;
  level: EvidenceLevel;
  level_label: string;
  years: number | null;
  score: number | null;
  source: string | null;
}

export interface Experience {
  id: number;
  type: string;
  type_label: string;
  title: string;
  organisation: string | null;
  description: string | null;
  evidence_url: string | null;
  started_on: string | null;
  ended_on: string | null;
  inferred_skills: string[];
}

export interface TalentProfile {
  candidate: {
    name: string;
    email: string;
    phone: string | null;
    location: string | null;
    headline: string | null;
    career_interests: string | null;
    talent_pool_visible: boolean;
    consent_rediscovery: boolean;
    flags: Record<string, unknown>;
  };
  completion: number;
  skills: TalentSkill[];
  levels: Record<EvidenceLevel, string>;
  experiences: Experience[];
  experience_types: Record<string, string>;
  ai?: { enabled: boolean; engine: string };
}

export interface MyApplication {
  id: number;
  job_id: number;
  job: string;
  client: string;
  status: string;
  status_label: string;
  score: number | null;
  explanations: string[];
  signals: string[];
  breakdown: { skills: number; experience: number; education: number; potential: number; max: number } | null;
  applied_at: string | null;
  updated_at: string | null;
}

export interface Invitation {
  id: number;
  job_id: number;
  title: string;
  client: string;
  location: string | null;
  deadline: string | null;
  score: number;
  reasons: string[];
  gaps: string[];
  status: "invited" | "accepted" | "declined";
}

export interface Opportunities {
  invitations: Invitation[];
  suggested: { job_id: number; title: string; client: string; deadline: string | null; score: number; signals: string[]; top_reasons: string[] }[];
}

export interface TaskCriterionResult {
  key: string;
  label: string;
  weight: number;
  points: number;
  status: "shown" | "partly" | "not_shown";
  feedback: string;
}

export interface TaskResult {
  status: "needs_review" | "validated";
  preliminary_score: number;
  final_score: number | null;
  criteria: TaskCriterionResult[];
  review_reason: string | null;
  engine?: string;
  reviewer: string | null;
  review_note: string | null;
  submitted_at: string | null;
  response: string;
}

export interface PracticalTask {
  slug: string;
  title: string;
  role: string;
  minutes: number;
  skills: string[];
  brief: string;
  scenario: string;
  criteria: { label: string; weight: number }[];
  job_id: number | null;
  job: string | null;
  why?: "applied" | "suggested";
  result: TaskResult | null;
}

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  read_at: string | null;
  created_at: string;
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
  profile: (token: string) => get<TalentProfile>(`/portal/${token}/profile`),
  updateProfile: (token: string, payload: Partial<TalentProfile["candidate"]>) =>
    post<TalentProfile>(`/portal/${token}/profile`, payload, "PATCH"),
  addExperience: (token: string, payload: Partial<Experience> & { type: string; title: string }) =>
    post<{ message: string; profile: TalentProfile }>(`/portal/${token}/experiences`, payload),
  deleteExperience: (token: string, id: number) => post<{ ok: boolean }>(`/portal/${token}/experiences/${id}`, {}, "DELETE"),
  myApplications: (token: string) => get<MyApplication[]>(`/portal/${token}/applications`),
  opportunities: (token: string) => get<Opportunities>(`/portal/${token}/opportunities`),
  respond: (token: string, id: number, decision: "accept" | "decline") =>
    post<{ status: string; message: string }>(`/portal/${token}/opportunities/${id}/respond`, { decision }),
  notifications: (token: string) => get<{ unread: number; items: NotificationItem[] }>(`/portal/${token}/notifications`),
  markRead: (token: string) => post<{ ok: boolean }>(`/portal/${token}/notifications/read`, {}),
  tasks: (token: string) => get<PracticalTask[]>(`/portal/${token}/tasks`),
  task: (token: string, slug: string, job?: string) => get<PracticalTask>(`/portal/${token}/tasks/${slug}${job ? `?job=${job}` : ""}`),
  submitTask: (token: string, slug: string, payload: { response: string; link?: string; job_id?: number | null }) =>
    post<{ message: string; result: TaskResult }>(`/portal/${token}/tasks/${slug}`, payload),
  setPassword: (token: string, payload: { current_password?: string; password: string; password_confirmation: string }) =>
    post<{ message: string; token: string }>(`/portal/${token}/password`, payload),
  stats: () => get<{ open_vacancies: number; candidates: number; skills_proven: number; rediscovered: number }>("/stats"),
  help: (q: string) => get<{ answer: string }>(`/help?q=${encodeURIComponent(q)}`),
};

export function fmtMoney(amount: number) {
  return "UGX " + amount.toLocaleString();
}
