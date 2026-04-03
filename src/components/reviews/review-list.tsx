import { StarRating } from "@/components/reviews/star-rating";
import { Badge } from "@/components/ui/badge";

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  user: { username: string; name: string };
}

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  if (reviews.length === 0) {
    return <p className="text-sm text-text-tertiary">No reviews yet</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <StarRating value={r.rating} readonly size="sm" />
            {r.isVerifiedPurchase && <Badge variant="green">Verified Purchase</Badge>}
          </div>
          <p className="text-sm text-text-secondary whitespace-pre-wrap mb-2">{r.comment}</p>
          <div className="flex items-center gap-2 text-xs text-text-tertiary">
            <span>{r.user.name}</span>
            <span>&middot;</span>
            <span>{new Date(r.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
