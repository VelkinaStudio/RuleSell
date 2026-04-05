import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { slugify } from "@/lib/slugify";
import { createBundleSchema } from "@/lib/validations/bundles";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const parsed = createBundleSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }

    const { title, description, price, rulesetIds } = parsed.data;

    // Verify all rulesets exist and belong to the user
    const rulesets = await db.ruleset.findMany({
      where: { id: { in: rulesetIds }, authorId: session.user.id },
      select: { id: true },
    });

    if (rulesets.length !== rulesetIds.length) {
      return errors.validation("Some rulesets not found or not owned by you");
    }

    let slug = slugify(title);
    const existing = await db.rulesetBundle.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const bundle = await db.rulesetBundle.create({
      data: {
        title,
        slug,
        description,
        price,
        authorId: session.user.id,
        items: {
          create: rulesetIds.map((rulesetId) => ({ rulesetId })),
        },
      },
      include: { _count: { select: { items: true } } },
    });

    return success(bundle, 201);
  } catch {
    return errors.internal();
  }
}
