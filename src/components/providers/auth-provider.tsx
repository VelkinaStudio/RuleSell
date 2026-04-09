"use client";

import { SessionProvider, useSession as useNextAuthSession } from "next-auth/react";
import { createContext, useContext, useMemo } from "react";

import type { User } from "@/types";

type Status = "loading" | "authenticated" | "unauthenticated";

export interface AppSession {
  user: User | null;
  expires: string;
}

interface AuthContextValue {
  data: AppSession;
  status: Status;
}

const AuthContext = createContext<AuthContextValue>({
  data: { user: null, expires: "" },
  status: "loading",
});

function AuthContextBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useNextAuthSession();

  const value = useMemo<AuthContextValue>(() => {
    if (status === "loading" || !session?.user) {
      return {
        data: { user: null, expires: session?.expires ?? "" },
        status: status === "loading" ? "unauthenticated" : status,
      };
    }

    const u = session.user;
    const mapped: User = {
      id: u.id ?? "",
      name: u.name ?? "",
      username: (u as Record<string, unknown>).username as string ?? "",
      email: u.email ?? "",
      avatar: u.image ?? null,
      role: ((u as Record<string, unknown>).role as User["role"]) ?? "USER",
      reputation: 0,
      level: "NEWCOMER",
      creatorMarks: [],
      joinedAt: "",
      isAdultConfirmed: false,
      countryOfResidence: "",
      preferredEnvironments: [],
    };

    return {
      data: { user: mapped, expires: session.expires ?? "" },
      status: "authenticated" as const,
    };
  }, [session, status]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthContextBridge>{children}</AuthContextBridge>
    </SessionProvider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
