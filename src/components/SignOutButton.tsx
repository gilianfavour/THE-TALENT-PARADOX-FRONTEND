"use client";

import { useRouter } from "next/navigation";
import { toast } from "@/components/Toaster";

export default function SignOutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  async function signOut() {
    await fetch("/api/session", { method: "DELETE" }).catch(() => null);
    toast("You are signed out.");
    router.push("/");
    router.refresh();
  }
  return (
    <button type="button" onClick={signOut} className={className}>
      Sign out
    </button>
  );
}
