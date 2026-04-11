import type { Metadata } from "next";

import { db } from "@/lib/db";
import {
  jsonLdScript,
  makeBreadcrumbSchema,
  makeRulesetProductSchema,
} from "@/lib/seo/json-ld";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://rulesell.vercel.app";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string; locale: string }>;
}

async function loadRuleset(slug: string) {
  try {
    return await db.ruleset.findUnique({
      where: { slug },
      select: {
        title: true,
        slug: true,
        description: true,
        category: true,
        price: true,
        currency: true,
        avgRating: true,
        ratingCount: true,
        downloadCount: true,
        createdAt: true,
        updatedAt: true,
        status: true,
        author: {
          select: { username: true, name: true },
        },
      },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ruleset = await loadRuleset(slug);

  if (!ruleset || ruleset.status !== "PUBLISHED") {
    return {
      title: "Ruleset not found",
      robots: { index: false, follow: false },
    };
  }

  const authorName = ruleset.author.name || ruleset.author.username;
  const priceText = ruleset.price > 0 ? `$${ruleset.price.toFixed(2)}` : "Free";
  const ratingText =
    ruleset.ratingCount > 0
      ? `★ ${ruleset.avgRating.toFixed(1)} (${ruleset.ratingCount})`
      : "";

  const description =
    ruleset.description.length > 160
      ? `${ruleset.description.slice(0, 157)}...`
      : ruleset.description;

  const ogParams = new URLSearchParams({
    title: ruleset.title,
    subtitle: `${authorName} · ${ruleset.category}`,
    badge: "Verified",
    rating: ratingText,
    price: priceText,
  });
  const ogImage = `/api/og?${ogParams.toString()}`;

  return {
    title: ruleset.title,
    description,
    alternates: {
      canonical: `/r/${ruleset.slug}`,
    },
    openGraph: {
      type: "article",
      title: `${ruleset.title} · RuleSell`,
      description,
      url: `/r/${ruleset.slug}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ruleset.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${ruleset.title} · RuleSell`,
      description,
      images: [ogImage],
    },
  };
}

export default async function RulesetLayout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const ruleset = await loadRuleset(slug);

  const jsonLd: Array<{ key: string; data: unknown }> = [];

  if (ruleset && ruleset.status === "PUBLISHED") {
    jsonLd.push({
      key: "product",
      data: makeRulesetProductSchema({
        title: ruleset.title,
        slug: ruleset.slug,
        description: ruleset.description,
        category: ruleset.category,
        price: ruleset.price,
        currency: ruleset.currency,
        avgRating: ruleset.avgRating,
        ratingCount: ruleset.ratingCount,
        downloadCount: ruleset.downloadCount,
        author: {
          username: ruleset.author.username,
          displayName: ruleset.author.name,
        },
        createdAt: ruleset.createdAt,
        updatedAt: ruleset.updatedAt,
      }),
    });
    jsonLd.push({
      key: "breadcrumb",
      data: makeBreadcrumbSchema([
        { name: "RuleSell", url: SITE_URL },
        { name: "Browse", url: `${SITE_URL}/browse` },
        { name: ruleset.category, url: `${SITE_URL}/category/${ruleset.category.toLowerCase()}` },
        { name: ruleset.title, url: `${SITE_URL}/r/${ruleset.slug}` },
      ]),
    });
  }

  return (
    <>
      {jsonLd.map((entry) => (
        <script
          key={entry.key}
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLdScript(entry.data)}
        />
      ))}
      {children}
    </>
  );
}
