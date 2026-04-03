import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { RulesetCardData } from "@/types";

export function RulesetCard({ ruleset }: { ruleset: RulesetCardData }) {
  return (
    <Link href={`/r/${ruleset.slug}`} className="block group">
      <div className="card-hover p-6 h-full flex flex-col">

        {/* Zone 1: Header — title + price (most important, largest) */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-[15px] font-semibold text-text-primary leading-snug group-hover:text-accent-green transition-colors line-clamp-2">
            {ruleset.title}
          </h3>
          <span className={`text-[15px] font-bold whitespace-nowrap shrink-0 ${ruleset.price === 0 ? "text-accent-green" : "text-text-primary"}`}>
            {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
          </span>
        </div>

        {/* Author — subdued, scannable */}
        <p className="text-xs text-text-tertiary mb-4">{ruleset.author.name}</p>

        {/* Zone 2: Body — description */}
        <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-5 flex-1">
          {ruleset.description}
        </p>

        {/* Zone 3: Footer — metadata (badges + stats) */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <Badge>{ruleset.platform}</Badge>
          <Badge>{ruleset.type}</Badge>
          {ruleset.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="purple">{tag}</Badge>
          ))}
        </div>

        <div className="flex items-center gap-5 text-xs text-text-tertiary pt-4 border-t border-border-primary">
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
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
