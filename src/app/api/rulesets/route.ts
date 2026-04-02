import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, list, errors } from "@/lib/api/response";
import { paginationFromCursor } from "@/lib/api/response";
import { listRulesets } from "@/lib/rulesets/queries";
import { slugify } from "@/lib/slugify";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const sp = req.nextUrl.searchParams;

    const result = await listRulesets(
      {
        platform: sp.get("platform") || undefined,
        type: sp.get("type") || undefined,
        category: sp.get("category") || undefined,
        minPrice: sp.has("minPrice") ? Number(sp.get("minPrice")) : undefined,
        maxPrice: sp.has("maxPrice") ? Number(sp.get("maxPrice")) : undefined,
        minRating: sp.has("minRating") ? Number(sp.get("minRating")) : undefined,
        tagNames: sp.get("tags") ? sp.get("tags")!.split(",") : undefined,
        sort: (sp.get("sort") as "newest" | "trending" | "most_voted" | "most_downloaded") || "newest",
        cursor: sp.get("cursor") || undefined,
        pageSize: sp.has("pageSize") ? Number(sp.get("pageSize")) : 20,
      },
      session?.user?.id,
    );

    return list(result.data, paginationFromCursor(result.total, 20, result.nextCursor));
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { title, description, previewContent, type, platform, category, price, content, tags } = body;

    if (!title || !description || !previewContent || !type || !platform || !category) {
      return errors.validation("Missing required fields");
    }

    let slug = slugify(title);
    const existing = await db.ruleset.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const ruleset = await db.ruleset.create({
      data: {
        title,
        slug,
        description,
        previewContent,
        type,
        platform,
        category,
        price: price || 0,
        authorId: session.user.id,
        status: "DRAFT",
        versions: content
          ? { create: { version: "1.0.0", fullContent: content } }
          : undefined,
      },
      select: { id: true, slug: true, title: true, status: true },
    });

    // Handle tags
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags as string[]) {
        const normalized = tagName.toLowerCase().trim();
        if (!normalized) continue;
        const tag = await db.tag.upsert({
          where: { name: normalized },
          create: { name: normalized, usageCount: 1 },
          update: { usageCount: { increment: 1 } },
        });
        await db.rulesetTag.create({
          data: { rulesetId: ruleset.id, tagId: tag.id },
        });
      }
    }

    return success(ruleset, 201);
  } catch {
    return errors.internal();
  }
}
