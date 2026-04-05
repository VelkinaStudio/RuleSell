import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { rateLimit } from "@/lib/rate-limit";
import { slugify } from "@/lib/slugify";
import { createDiscussionSchema } from "@/lib/validations/discussions";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const category = sp.get("category") || undefined;
    const cursor = sp.get("cursor") || undefined;
    const pageSize = 20;

    const where = category ? { category } : {};

    const discussions = await db.discussion.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
        _count: { select: { replies: true } },
      },
    });

    const hasNext = discussions.length > pageSize;
    if (hasNext) discussions.pop();

    return success({
      discussions,
      nextCursor: hasNext && discussions.length > 0 ? discussions[discussions.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rl = rateLimit(`discussions:${session.user.id}`, 5, 60 * 1000); // 5 per minute
    if (!rl.ok) return errors.rateLimited();

    const body = await req.json();

    const parsed = createDiscussionSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { title, bodyText, category, rulesetId } = parsed.data;

    let slug = slugify(title);
    const existing = await db.discussion.findUnique({
      where: { category_slug: { category, slug } },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const discussion = await db.discussion.create({
      data: {
        title,
        slug,
        body: bodyText,
        category,
        authorId: session.user.id,
        rulesetId: rulesetId ?? null,
      },
      include: {
        author: { select: { id: true, username: true, name: true, avatar: true } },
      },
    });

    return success(discussion, 201);
  } catch {
    return errors.internal();
  }
}
