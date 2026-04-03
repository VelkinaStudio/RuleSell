import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;
    const role = req.nextUrl.searchParams.get("role") || undefined;
    const q = req.nextUrl.searchParams.get("q") || undefined;

    const where = {
      ...(role && { role: role as "USER" | "PRO" | "ADMIN" }),
      ...(q && {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { username: { contains: q, mode: "insensitive" as const } },
        ],
      }),
    };

    const users = await db.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 21,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      select: {
        id: true, name: true, username: true, email: true, role: true,
        sellerStatus: true, totalEarnings: true, createdAt: true,
        _count: { select: { rulesets: true, purchases: true } },
      },
    });

    const hasNext = users.length > 20;
    if (hasNext) users.pop();

    return success({
      users,
      nextCursor: hasNext && users.length > 0 ? users[users.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}
