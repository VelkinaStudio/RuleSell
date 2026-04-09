import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const adminReportSchema = z.object({
  status: z.enum(["RESOLVED", "DISMISSED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const body = await req.json();
    const parsed = adminReportSchema.safeParse(body);
    if (!parsed.success) return errors.validation("Status must be RESOLVED or DISMISSED");
    const { status } = parsed.data;

    const updated = await db.report.update({
      where: { id },
      data: {
        status,
        resolvedById: session.user.id,
        resolvedAt: new Date(),
      },
      select: { id: true, status: true, resolvedAt: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}
