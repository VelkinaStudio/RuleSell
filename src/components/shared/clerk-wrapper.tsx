"use client";

import { ReactNode } from "react";

const isClerkConfigured =
  typeof window !== "undefined"
    ? !!document.querySelector("script[data-clerk-publishable-key]") ||
      !!window.__clerk_publishable_key
    : !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Re-export Clerk components conditionally
// When Clerk is not configured, Show renders based on "when" prop:
// "signed-out" = always show (assume not signed in)
// "signed-in" = never show

export function ClerkShow({
  when,
  children,
}: {
  when: "signed-in" | "signed-out";
  children: ReactNode;
}) {
  if (!isClerkConfigured) {
    // Without Clerk, assume user is signed out
    return when === "signed-out" ? <>{children}</> : null;
  }

  // Dynamically use Clerk's Show component
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Show } = require("@clerk/nextjs");
  return <Show when={when}>{children}</Show>;
}

export function ClerkUserButton() {
  if (!isClerkConfigured) return null;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { UserButton } = require("@clerk/nextjs");
  return (
    <UserButton
      appearance={{
        elements: { avatarBox: "h-8 w-8" },
      }}
    />
  );
}

// Augment window type for Clerk
declare global {
  interface Window {
    __clerk_publishable_key?: string;
  }
}
