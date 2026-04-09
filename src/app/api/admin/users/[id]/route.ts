import type { NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const adminUserSchema = z.object({
  role: z.enum(["USER", "PRO", "ADMIN"]).optional(),
  sellerStatus: z.enum(["NONE", "PENDING", "ACTIVE", "SUSPENDED"]).optional(),
}).refine((d) => d.role || d.sellerStatus, { message: "No valid fields to update" });

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const body = await req.json();
    const parsed = adminUserSchema.safeParse(body);
    if (!parsed.success) return errors.validation("No valid fields to update");

    const data: Record<string, string> = {};
    if (parsed.data.role) data.role = parsed.data.role;
    if (parsed.data.sellerStatus) data.sellerStatus = parsed.data.sellerStatus;

    const updated = await db.user.update({
      where: { id },
      data,
      select: { id: true, name: true, username: true, role: true, sellerStatus: true },
    });

    return success(updated);
  } catch {
    return errors.internal();
  }
}
