"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";

interface SaveButtonProps {
  rulesetId: string;
  initialSaved: boolean;
}

export function SaveButton({ rulesetId, initialSaved }: SaveButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);

  async function handleSave() {
    if (!session?.user) { router.push("/login"); return; }

    const prev = saved;
    setSaved(!saved);

    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rulesetId }),
      });

      if (!res.ok) {
        setSaved(prev);
        toast("Failed to update", "error");
      }
    } catch {
      setSaved(prev);
      toast("Failed to update", "error");
    }
  }

  return (
    <button
      onClick={handleSave}
      className={`text-sm transition-colors ${saved ? "text-accent-green" : "text-text-tertiary hover:text-text-secondary"}`}
      title={saved ? "Remove from saved" : "Save for later"}
    >
      <svg className="w-5 h-5" fill={saved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    </button>
  );
}
