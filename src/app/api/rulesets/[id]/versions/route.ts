import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

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
    const { version, fullContent, changelog } = body;

    if (!version || !fullContent) {
      return errors.validation("version and fullContent are required");
    }

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
