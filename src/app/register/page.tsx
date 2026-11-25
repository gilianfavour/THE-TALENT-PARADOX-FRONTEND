import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { currentUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const user = await currentUser();
  if (user) redirect(`/portal/${user.token}`);

  return (
    <div className="mx-auto grid max-w-5xl items-center gap-12 py-6 lg:grid-cols-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-600">Join the talent pool</p>
        <h1 className="mt-3 font-display text-5xl font-bold leading-tight tracking-tight">Let recruiters discover what you can do</h1>
        <p className="mt-4 text-lg leading-relaxed text-slate-600">
          One profile for every application. Add projects, family business work, volunteering and self-taught skills, prove them in
          short practical tasks, and get matched to roles you might never have found.
        </p>
        <p className="mt-6 rounded-2xl bg-paper p-4 text-sm leading-relaxed text-slate-500">
          You stay in control: choose whether recruiters can find you and whether you can be considered for other roles. Built with
          Uganda&apos;s Data Protection and Privacy Act, 2019 in mind.
        </p>
      </div>
      <AuthForm mode="register" next={next} />
    </div>
  );
}
