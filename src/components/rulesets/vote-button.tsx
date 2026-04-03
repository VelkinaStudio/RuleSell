"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

interface VoteButtonProps {
  rulesetId: string;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({ rulesetId, initialVoted, initialCount }: VoteButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);

  async function handleVote() {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    // Optimistic update
    const prevVoted = voted;
    const prevCount = count;
    setVoted(!voted);
    setCount(voted ? count - 1 : count + 1);

    try {
      const res = await fetch("/api/votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (!res.ok) {
        // Rollback
        setVoted(prevVoted);
        setCount(prevCount);
        if (res.status === 401) {
          router.push("/login");
        } else {
          toast("Vote failed, try again", "error");
        }
      }
    } catch {
      setVoted(prevVoted);
      setCount(prevCount);
      toast("Vote failed, try again", "error");
    }
  }

  return (
    <button
      onClick={handleVote}
      className={[
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors",
        voted
          ? "border-accent-green/30 bg-accent-green-subtle text-accent-green"
          : "border-border-secondary text-text-secondary hover:border-border-hover hover:text-text-primary",
      ].join(" ")}
    >
      <svg className="w-4 h-4" fill={voted ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
      {count}
    </button>
  );
}
