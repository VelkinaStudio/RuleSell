import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RulesetCardData } from "@/types";

export function RulesetCard({ ruleset }: { ruleset: RulesetCardData }) {
  return (
    <div className="card-hover p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link href={`/r/${ruleset.slug}`} className="block">
            <h3 className="text-sm font-semibold text-text-primary truncate hover:text-accent-green transition-colors">
              {ruleset.title}
            </h3>
          </Link>
          <Link href={`/u/${ruleset.author.username}`} className="text-xs text-text-tertiary hover:text-text-secondary">
            {ruleset.author.name}
          </Link>
        </div>
        <span className="text-sm font-semibold text-accent-green whitespace-nowrap">
          {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
        </span>
      </div>

      <p className="text-xs text-text-secondary line-clamp-2">{ruleset.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="default">{ruleset.platform}</Badge>
        <Badge variant="default">{ruleset.type}</Badge>
        {ruleset.tags.slice(0, 2).map((tag) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge variant="purple">{tag}</Badge>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs text-text-tertiary">
        <span>{ruleset.voteCount} votes</span>
        <span>{ruleset.downloadCount} downloads</span>
        {ruleset.avgRating > 0 && (
          <span>
            {"★".repeat(Math.round(ruleset.avgRating))} {ruleset.avgRating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
