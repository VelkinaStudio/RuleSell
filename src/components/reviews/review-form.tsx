"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/reviews/star-rating";
import { toast } from "@/components/ui/toast";

interface ReviewFormProps {
  rulesetId: string;
}

export function ReviewForm({ rulesetId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) { toast("Please select a rating", "warning"); return; }

    setLoading(true);
    const res = await fetch(`/api/rulesets/${rulesetId}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, comment }),
    });

    setLoading(false);
    if (res.ok) {
      toast("Review submitted", "success");
      setRating(0);
      setComment("");
      router.refresh();
    } else {
      const err = await res.json();
      toast(err.error?.message || "Failed to submit review", "error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <StarRating value={rating} onChange={setRating} />
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your review..."
        rows={3}
        required
        className="w-full px-3 py-2 rounded-md text-sm bg-bg-tertiary border border-border-primary text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent-green transition-colors"
      />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
