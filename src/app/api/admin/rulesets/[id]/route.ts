import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const adminRulesetSchema = z.object({
  status: z.enum(["PUBLISHED", "ARCHIVED", "FLAGGED", "DRAFT"]),
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
    const parsed = adminRulesetSchema.safeParse(body);
    if (!parsed.success) return errors.validation("Invalid status");

    const updated = await db.ruleset.update({
      where: { id },
      data: { status: parsed.data.status },
      select: { id: true, title: true, status: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}
