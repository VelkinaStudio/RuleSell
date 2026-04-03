import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RulesetCardData } from "@/types";

export function RulesetCard({ ruleset }: { ruleset: RulesetCardData }) {
  return (
    <Link href={`/r/${ruleset.slug}`} className="block group">
      <div className="card-hover p-5 space-y-3 relative overflow-hidden">
        {/* Subtle top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-green/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-accent-green transition-colors duration-200">
              {ruleset.title}
            </h3>
            <span className="text-xs text-text-tertiary">
              {ruleset.author.name}
            </span>
          </div>
          <span className={`text-sm font-bold whitespace-nowrap ${ruleset.price === 0 ? "text-accent-green" : "text-text-primary"}`}>
            {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
          </span>
        </div>

        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{ruleset.description}</p>

        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant="default">{ruleset.platform}</Badge>
          <Badge variant="default">{ruleset.type}</Badge>
          {ruleset.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="purple">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-[11px] text-text-tertiary pt-1 border-t border-border-primary/50">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            {ruleset.voteCount}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {ruleset.downloadCount}
          </span>
          {ruleset.avgRating > 0 && (
            <span className="flex items-center gap-1 text-accent-amber">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {ruleset.avgRating.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
