import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RulesetCardData } from "@/types";

export function RulesetCard({ ruleset }: { ruleset: RulesetCardData }) {
  const isNew = Date.now() - new Date(ruleset.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000;
  const isFree = ruleset.price === 0;

  return (
    <Link href={`/r/${ruleset.slug}`} className="block group">
      <div className="card-hover p-5 h-full flex flex-col relative overflow-hidden">

        {/* Hover accent line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent-green/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Badges */}
        <div className="flex items-center gap-1.5 mb-3 empty:mb-0 min-h-0">
          {isNew && <Badge variant="green">New</Badge>}
          {ruleset.trendingScore > 0 && <Badge variant="amber">Trending</Badge>}
          {ruleset.avgRating >= 4.5 && ruleset.ratingCount >= 2 && (
            <Badge variant="purple">Top Rated</Badge>
          )}
        </div>

        {/* Title + Price */}
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <h3 className="text-[15px] font-semibold text-text-primary leading-snug group-hover:text-accent-green transition-colors line-clamp-2">
            {ruleset.title}
          </h3>
          <span className={`text-base font-bold font-mono whitespace-nowrap shrink-0 ${
            isFree ? "text-accent-green" : "text-text-primary"
          }`}>
            {isFree ? "Free" : `$${ruleset.price.toFixed(2)}`}
          </span>
        </div>

        {/* Author */}
        <p className="text-xs text-text-tertiary mb-3">by {ruleset.author.name}</p>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
          {ruleset.description}
        </p>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Badge>{ruleset.platform}</Badge>
          <Badge>{ruleset.type}</Badge>
          {ruleset.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="purple">{tag}</Badge>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-text-tertiary pt-3 border-t border-border-primary">
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 15l7-7 7 7" /></svg>
            {ruleset.voteCount}
          </span>
          <span className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {ruleset.downloadCount.toLocaleString()}
          </span>
          {ruleset.avgRating > 0 && (
            <span className="flex items-center gap-1.5 text-accent-amber">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              {ruleset.avgRating.toFixed(1)}
              {ruleset.ratingCount > 0 && (
                <span className="text-text-tertiary">({ruleset.ratingCount})</span>
              )}
            </span>
          )}
          <span className="ml-auto text-accent-green opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-medium">
            View &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
