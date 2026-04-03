import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { success, errors } from "@/lib/api/response";
import { getPurchaseStatus } from "@/lib/purchases/queries";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rulesetId = req.nextUrl.searchParams.get("rulesetId");
    if (!rulesetId) return errors.validation("rulesetId is required");

    const result = await getPurchaseStatus(session.user.id, rulesetId);
    return success(result);
  } catch {
    return errors.internal();
  }
}
