"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  hasNext: boolean;
  hasPrev?: boolean;
  nextCursor?: string;
  prevCursor?: string;
}

export function CursorPagination({ hasNext, nextCursor }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function loadMore() {
    if (!nextCursor) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("cursor", nextCursor);
    router.push(`?${params.toString()}`);
  }

  if (!hasNext) return null;

  return (
    <div className="flex justify-center py-6">
      <button
        onClick={loadMore}
        className="px-6 py-2 text-sm font-medium text-text-secondary border border-border-secondary rounded-md hover:border-border-hover hover:text-text-primary transition-colors"
      >
        Load more
      </button>
    </div>
  );
}
