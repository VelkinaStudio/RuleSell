import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const createVersionSchema = z.object({
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must be semver (e.g. 1.0.0)"),
  fullContent: z.string().min(1).max(500_000),
  changelog: z.string().max(5000).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can add versions");

    const body = await req.json();
    const parsed = createVersionSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { version, fullContent, changelog } = parsed.data;

    const existing = await db.rulesetVersion.findUnique({
      where: { rulesetId_version: { rulesetId: id, version } },
    });
    if (existing) return errors.conflict("Version already exists");

    const created = await db.rulesetVersion.create({
      data: { rulesetId: id, version, fullContent, changelog },
      select: { id: true, version: true, createdAt: true },
    });

    return success(created, 201);
  } catch {
    return errors.internal();
  }
}
