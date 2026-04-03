import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function PATCH(
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
    const { name, description, isPublic } = body;

    const updated = await db.collection.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(isPublic !== undefined && { isPublic }),
      },
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

    const collection = await db.collection.findUnique({ where: { id } });
    if (!collection) return errors.notFound("Collection not found");
    if (collection.userId !== session.user.id) return errors.forbidden("Not your collection");

    await db.collection.delete({ where: { id } });
    return success({ message: "Collection deleted" });
  } catch {
    return errors.internal();
  }
}
