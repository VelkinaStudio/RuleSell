import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ruleset.ai";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rulesets = await db.ruleset.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  const users = await db.user.findMany({
    where: { rulesets: { some: { status: "PUBLISHED" } } },
    select: { username: true },
    take: 5000,
  });

  const tags = await db.tag.findMany({
    where: { usageCount: { gt: 0 } },
    select: { name: true },
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/search`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/trending`, changeFrequency: "hourly", priority: 0.8 },
    ...rulesets.map((r) => ({
      url: `${BASE_URL}/r/${r.slug}`,
      lastModified: r.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...users.map((u) => ({
      url: `${BASE_URL}/u/${u.username}`,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })),
    ...tags.map((t) => ({
      url: `${BASE_URL}/tags/${encodeURIComponent(t.name)}`,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
  ];
}
