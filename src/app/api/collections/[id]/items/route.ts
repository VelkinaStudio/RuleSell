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

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    const body = await req.json();
    const { rulesetId } = body;
    if (!rulesetId) return errors.validation("rulesetId is required");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    const count = await db.collectionItem.count({ where: { collectionId: id } });

    await db.collectionItem.create({
      data: { collectionId: id, rulesetId, position: count },
    });

    return success({ added: true });
  } catch {
    return errors.internal();
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    const rulesetId = req.nextUrl.searchParams.get("rulesetId");
    if (!rulesetId) return errors.validation("rulesetId is required");

    await db.collectionItem.delete({
      where: { collectionId_rulesetId: { collectionId: id, rulesetId } },
    });

    return success({ removed: true });
  } catch {
    return errors.internal();
  }
}
