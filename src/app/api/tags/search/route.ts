import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q");
    if (!q || q.length < 1) return success([]);

    const tags = await db.tag.findMany({
      where: { name: { startsWith: q.toLowerCase() } },
      orderBy: { usageCount: "desc" },
      take: 10,
      select: { id: true, name: true, usageCount: true },
    });

    return success(tags);
  } catch {
    return errors.internal();
  }
}
