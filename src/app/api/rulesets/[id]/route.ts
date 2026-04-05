import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { getRulesetById } from "@/lib/rulesets/queries";
import { resolveAccessState, canViewFullContent } from "@/lib/rulesets/access";
import { updateRulesetSchema } from "@/lib/validations/rulesets";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    const ruleset = await getRulesetById(id);

    if (!ruleset) return errors.notFound("Ruleset not found");

    const accessState = await resolveAccessState(
      ruleset.id,
      ruleset.authorId,
      ruleset.price,
      session?.user?.id,
    );

    const showFull = canViewFullContent(accessState);

    return success({
      ...ruleset,
      accessState,
      versions: showFull ? ruleset.versions : [],
      createdAt: ruleset.createdAt.toISOString(),
      updatedAt: ruleset.updatedAt.toISOString(),
    });
  } catch {
    return errors.internal();
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can edit");

    const body = await req.json();

    const parsed = updateRulesetSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { title, description, previewContent, type, platform, category, price, status } = parsed.data;

    const updated = await db.ruleset.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(previewContent !== undefined && { previewContent }),
        ...(type !== undefined && { type }),
        ...(platform !== undefined && { platform }),
        ...(category !== undefined && { category }),
        ...(price !== undefined && { price }),
        ...(status !== undefined && { status }),
      },
      select: { id: true, slug: true, title: true, status: true, updatedAt: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({ where: { id }, select: { authorId: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can delete");

    await db.ruleset.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });

    return success({ message: "Ruleset archived" });
  } catch {
    return errors.internal();
  }
}
