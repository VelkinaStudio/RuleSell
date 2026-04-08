"use client";

// Placeholder kept for layout compatibility during the frontend rewrite.
// Still enforces authentication via next-auth so gated routes work.

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  if (status === "loading") return null;
  return <>{children}</>;
}
