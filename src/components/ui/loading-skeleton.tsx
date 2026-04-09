import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

type Variant = "card" | "list-row" | "hero" | "detail";

interface LoadingSkeletonProps {
  variant: Variant;
  count?: number;
  className?: string;
}

function CardSkeleton() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border-soft bg-bg-surface p-4">
      <Skeleton className="h-11 w-11 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md border border-border-soft bg-bg-surface px-3 py-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

function HeroSkeleton() {
  return (
    <div className="space-y-4 rounded-xl border border-border-soft bg-bg-surface p-6">
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
      <Skeleton className="h-40 w-full rounded-lg" />
    </div>
  );
}

const VARIANTS = {
  card: CardSkeleton,
  "list-row": ListRowSkeleton,
  hero: HeroSkeleton,
  detail: DetailSkeleton,
} as const;

export function LoadingSkeleton({ variant, count = 1, className }: LoadingSkeletonProps) {
  const Comp = VARIANTS[variant];
  return (
    <div className={cn("space-y-3", className)} aria-busy aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <Comp key={i} />
      ))}
    </div>
  );
}
