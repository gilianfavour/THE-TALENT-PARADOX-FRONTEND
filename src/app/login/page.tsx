import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await currentUser();
  if (user) redirect(next && next.startsWith("/") ? next : `/portal/${user.token}`);

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 py-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Candidate account</p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-tight tracking-tight">Welcome back</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          Sign in to track your applications, see why you match, finish practical tasks and answer recruiter invitations.
        </p>
        <ul className="mt-8 space-y-3 text-sm text-slate-600">
          {["Live status on every application", "Your Talent Profile and proven skills", "Invitations to roles you did not apply for"].map((t) => (
            <li key={t} className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-brand-500" />{t}</li>
          ))}
        </ul>
      </div>
      <AuthForm mode="login" next={next} />
    </div>
  );
}
