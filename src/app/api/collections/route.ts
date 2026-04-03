import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const collections = await db.collection.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { items: true } } },
    });

    return success(collections);
  } catch {
    return errors.internal();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { name, description, isPublic } = body;

    if (!name) return errors.validation("Name is required");

    let slug = slugify(name);
    const existing = await db.collection.findUnique({
      where: { userId_slug: { userId: session.user.id, slug } },
    });
    if (existing) slug = `${slug}-${Date.now().toString(36)}`;

    const collection = await db.collection.create({
      data: {
        userId: session.user.id,
        name,
        slug,
        description: description || null,
        isPublic: isPublic !== false,
      },
    });

    return success(collection, 201);
  } catch {
    return errors.internal();
  }
}
