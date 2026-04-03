"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (!session?.user) { router.push("/login"); return; }

    setLoading(true);
    const prev = following;
    setFollowing(!following);

    try {
      const res = await fetch("/api/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        setFollowing(prev);
        toast("Failed to update follow", "error");
      }
    } catch {
      setFollowing(prev);
      toast("Failed to update follow", "error");
    }
    setLoading(false);
  }

  return (
    <Button
      onClick={handleFollow}
      variant={following ? "outline" : "primary"}
      size="sm"
      disabled={loading}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
