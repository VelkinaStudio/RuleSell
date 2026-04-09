"use client";

import { useTranslations } from "next-intl";

import { CollectionCard } from "@/components/marketplace/collection-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { useCollections } from "@/hooks/use-collections";

export default function CollectionsPage() {
  const t = useTranslations("collections");
  const { data, error, isLoading, mutate } = useCollections();

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-base text-fg-muted">{t("subtitle")}</p>
      </header>

      {error && (
        <ErrorState message={(error as Error)?.message} retry={() => mutate()} />
      )}

      {isLoading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-xl border border-border-soft bg-bg-surface/60"
            />
          ))}
        </div>
      )}

      {!isLoading && !error && data && (
        data.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("empty.title")}
            description={t("empty.description")}
          />
        )
      )}
    </div>
  );
}
