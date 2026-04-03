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
    if (!session?.user || session.user.role !== "ADMIN") return errors.forbidden();

    const body = await req.json();
    const { role, sellerStatus } = body;

    const data: Record<string, string> = {};
    if (role && ["USER", "PRO", "ADMIN"].includes(role)) data.role = role;
    if (sellerStatus && ["NONE", "PENDING", "ACTIVE", "SUSPENDED"].includes(sellerStatus)) data.sellerStatus = sellerStatus;

    if (Object.keys(data).length === 0) return errors.validation("No valid fields to update");

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
