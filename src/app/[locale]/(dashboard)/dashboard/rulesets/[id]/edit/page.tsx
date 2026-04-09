"use client";

import { useParams } from "next/navigation";

import { PublishWizard } from "@/components/dashboard/publish-wizard";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useRulesetById } from "@/hooks/use-ruleset";

export default function EditRulesetPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const { data: ruleset, error, isLoading } = useRulesetById(id ?? null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton variant="hero" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  if (error || !ruleset) return <ErrorState />;

  return <PublishWizard id={id ?? "new"} initialDraft={ruleset} />;
}
