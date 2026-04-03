import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const status = req.nextUrl.searchParams.get("status") || "PENDING";
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const reports = await db.report.findMany({
      where: { status: status as "PENDING" | "RESOLVED" | "DISMISSED" },
      orderBy: { createdAt: "desc" },
      take: 21,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        reporter: { select: { id: true, name: true, username: true } },
        ruleset: { select: { id: true, title: true, slug: true, author: { select: { name: true, username: true } } } },
      },
    });

    const hasNext = reports.length > 20;
    if (hasNext) reports.pop();

    return success({
      reports,
      nextCursor: hasNext && reports.length > 0 ? reports[reports.length - 1].id : undefined,
    });
  } catch {
    return errors.internal();
  }
}
