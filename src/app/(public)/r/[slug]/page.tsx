import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getRulesetBySlug } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";
import { VoteButton } from "@/components/rulesets/vote-button";
import { BuyButton } from "@/components/rulesets/buy-button";
import { DownloadButton } from "@/components/rulesets/download-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ruleset = await getRulesetBySlug(slug);
  if (!ruleset) return { title: "Not Found — Ruleset" };
  return {
    title: `${ruleset.title} — Ruleset`,
    description: ruleset.description,
  };
}

export default async function RulesetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const ruleset = await getRulesetBySlug(slug);

  if (!ruleset || ruleset.status === "ARCHIVED") notFound();

  const accessState = await resolveAccessState(
    ruleset.id, ruleset.authorId, ruleset.price, session?.user?.id,
  );
  const showFull = canViewFullContent(accessState);

  let hasVoted = false;
  if (session?.user) {
    const vote = await db.vote.findUnique({
      where: { userId_rulesetId: { userId: session.user.id, rulesetId: ruleset.id } },
    });
    hasVoted = !!vote;
  }

  // Log view event
  await db.rulesetEvent.create({ data: { rulesetId: ruleset.id, type: "VIEW" } });
  await db.ruleset.update({ where: { id: ruleset.id }, data: { viewCount: { increment: 1 } } });

  const latestVersion = ruleset.versions[0];

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">{ruleset.title}</h1>
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Link href={`/u/${ruleset.author.username}`} className="hover:text-accent-green">
              {ruleset.author.name}
            </Link>
            <span>&middot;</span>
            <span>{new Date(ruleset.createdAt).toLocaleDateString()}</span>
            {latestVersion && (
              <>
                <span>&middot;</span>
                <span>v{latestVersion.version}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <VoteButton
            rulesetId={ruleset.id}
            initialVoted={hasVoted}
            initialCount={ruleset._count.votes}
          />
          {accessState === "AUTHOR" && (
            <Link href={`/dashboard/rulesets/${ruleset.id}/edit`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        <Badge variant="green">{ruleset.platform}</Badge>
        <Badge variant="default">{ruleset.type}</Badge>
        <Badge variant="default">{ruleset.category}</Badge>
        {ruleset.tags.map((t) => (
          <Link key={t.tag.id} href={`/tags/${t.tag.name}`}>
            <Badge variant="purple">{t.tag.name}</Badge>
          </Link>
        ))}
        <span className="text-sm font-semibold text-accent-green ml-auto">
          {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
        </span>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-sm text-text-tertiary mb-6 pb-6 border-b border-border-primary">
        <span>{ruleset.downloadCount} downloads</span>
        <span>{ruleset.viewCount} views</span>
        <span>{ruleset._count.reviews} reviews</span>
        {ruleset.avgRating > 0 && <span>&#9733; {ruleset.avgRating.toFixed(1)}</span>}
      </div>

      {/* Description */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">About</h2>
        <p className="text-text-secondary whitespace-pre-wrap">{ruleset.description}</p>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          {showFull ? "Content" : "Preview"}
        </h2>
        <div className="bg-bg-tertiary border border-border-primary rounded-lg p-4 font-mono text-sm text-text-secondary overflow-x-auto whitespace-pre-wrap">
          {showFull && latestVersion
            ? latestVersion.fullContent
            : ruleset.previewContent}
        </div>
        {!showFull && (
          <div className="mt-4 text-center">
            {accessState === "PUBLIC" && !session?.user ? (
              <Link href="/login">
                <Button>{ruleset.price > 0 ? "Sign in to buy" : "Sign in to download"}</Button>
              </Link>
            ) : (
              <BuyButton rulesetId={ruleset.id} price={ruleset.price} accessState={accessState} />
            )}
          </div>
        )}
        {showFull && latestVersion && latestVersion.fileBundles && latestVersion.fileBundles.length > 0 && (
          <div className="mt-4">
            <DownloadButton
              rulesetId={ruleset.id}
              versionId={latestVersion.id}
              hasFiles={latestVersion.fileBundles.length > 0}
            />
          </div>
        )}
      </div>

      {/* Version history (author only) */}
      {accessState === "AUTHOR" && ruleset.versions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-2">Versions</h2>
          <div className="space-y-2">
            {ruleset.versions.map((v) => (
              <div key={v.id} className="card p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-text-primary">v{v.version}</span>
                  {v.changelog && (
                    <p className="text-xs text-text-tertiary mt-0.5">{v.changelog}</p>
                  )}
                </div>
                <span className="text-xs text-text-tertiary">
                  {new Date(v.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
