import { db } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";

const CARD_SELECT = {
  id: true,
  title: true,
  slug: true,
  description: true,
  previewContent: true,
  type: true,
  platform: true,
  category: true,
  price: true,
  currency: true,
  downloadCount: true,
  viewCount: true,
  avgRating: true,
  ratingCount: true,
  trendingScore: true,
  status: true,
  createdAt: true,
  authorId: true,
  author: {
    select: { id: true, username: true, name: true, avatar: true },
  },
  tags: {
    select: { tag: { select: { name: true } } },
  },
  _count: { select: { votes: true } },
} satisfies Prisma.RulesetSelect;

export type RulesetCardRow = Prisma.RulesetGetPayload<{ select: typeof CARD_SELECT }>;

export function formatCardData(row: RulesetCardRow, userId?: string, votedIds?: Set<string>) {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    previewContent: row.previewContent,
    type: row.type,
    platform: row.platform,
    category: row.category,
    price: row.price,
    currency: row.currency,
    downloadCount: row.downloadCount,
    viewCount: row.viewCount,
    avgRating: row.avgRating,
    ratingCount: row.ratingCount,
    trendingScore: row.trendingScore,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    author: row.author,
    tags: row.tags.map((t) => t.tag.name),
    voteCount: row._count.votes,
    hasVoted: votedIds ? votedIds.has(row.id) : false,
  };
}

export interface ListRulesetsOptions {
  status?: string;
  platform?: string;
  type?: string;
  category?: string;
  authorId?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  tagNames?: string[];
  sort?: "newest" | "trending" | "most_voted" | "most_downloaded";
  cursor?: string;
  pageSize?: number;
}

export async function listRulesets(opts: ListRulesetsOptions, userId?: string) {
  const pageSize = opts.pageSize || 20;

  const where: Prisma.RulesetWhereInput = {
    status: (opts.status as Prisma.EnumRulesetStatusFilter["equals"]) || "PUBLISHED",
  };

  if (opts.platform) where.platform = opts.platform as Prisma.EnumPlatformFilter["equals"];
  if (opts.type) where.type = opts.type as Prisma.EnumRulesetTypeFilter["equals"];
  if (opts.category) where.category = opts.category;
  if (opts.authorId) where.authorId = opts.authorId;
  if (opts.minPrice !== undefined || opts.maxPrice !== undefined) {
    where.price = {};
    if (opts.minPrice !== undefined) where.price.gte = opts.minPrice;
    if (opts.maxPrice !== undefined) where.price.lte = opts.maxPrice;
  }
  if (opts.minRating !== undefined) {
    where.avgRating = { gte: opts.minRating };
  }
  if (opts.tagNames && opts.tagNames.length > 0) {
    where.tags = { some: { tag: { name: { in: opts.tagNames } } } };
  }

  const orderBy: Prisma.RulesetOrderByWithRelationInput =
    opts.sort === "trending" ? { trendingScore: "desc" }
    : opts.sort === "most_voted" ? { votes: { _count: "desc" } }
    : opts.sort === "most_downloaded" ? { downloadCount: "desc" }
    : { createdAt: "desc" };

  const [rows, total] = await Promise.all([
    db.ruleset.findMany({
      where,
      select: CARD_SELECT,
      orderBy,
      take: pageSize + 1,
      ...(opts.cursor ? { cursor: { id: opts.cursor }, skip: 1 } : {}),
    }),
    db.ruleset.count({ where }),
  ]);

  const hasNext = rows.length > pageSize;
  if (hasNext) rows.pop();

  // Batch-load user's votes
  let votedIds = new Set<string>();
  if (userId && rows.length > 0) {
    const votes = await db.vote.findMany({
      where: { userId, rulesetId: { in: rows.map((r) => r.id) } },
      select: { rulesetId: true },
    });
    votedIds = new Set(votes.map((v) => v.rulesetId));
  }

  const data = rows.map((r) => formatCardData(r, userId, votedIds));
  const nextCursor = hasNext && rows.length > 0 ? rows[rows.length - 1].id : undefined;

  return { data, total, nextCursor };
}

export async function getRulesetBySlug(slug: string) {
  return db.ruleset.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, username: true, name: true, avatar: true, bio: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
      versions: { orderBy: { createdAt: "desc" }, take: 5, include: { fileBundles: true } },
      _count: { select: { votes: true, reviews: true } },
    },
  });
}

export async function getRulesetById(id: string) {
  return db.ruleset.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, username: true, name: true, avatar: true } },
      tags: { select: { tag: { select: { id: true, name: true } } } },
      versions: { orderBy: { createdAt: "desc" } },
      _count: { select: { votes: true, reviews: true } },
    },
  });
}
