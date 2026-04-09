import { auth } from "@/lib/auth";

import type { User } from "@/types";

export interface Session {
  user: User | null;
  expires: string;
}

/**
 * Server-side session getter. Wraps NextAuth's `auth()` and maps
 * the result into the Session shape the frontend expects.
 */
export async function getSession(): Promise<Session> {
  const session = await auth();

  if (!session?.user) {
    return { user: null, expires: "" };
  }

  const u = session.user;
  return {
    user: {
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
    },
    expires: session.expires ?? "",
  };
}

// Re-export types so existing imports don't break
export type { User };
