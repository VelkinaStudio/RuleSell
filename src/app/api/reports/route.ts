import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

const VALID_REASONS = ["SPAM", "MALWARE", "COPYRIGHT", "INAPPROPRIATE", "OTHER"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId, reason, details } = body;

    if (!rulesetId || !reason) return errors.validation("rulesetId and reason are required");
    if (!VALID_REASONS.includes(reason)) return errors.validation("Invalid reason");

    const ruleset = await db.ruleset.findUnique({ where: { id: rulesetId }, select: { id: true } });
    if (!ruleset) return errors.notFound("Ruleset not found");

    // Rate limit: 5 reports per day per user
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reportsToday = await db.report.count({
      where: { reporterId: session.user.id, createdAt: { gte: today } },
    });
    if (reportsToday >= 5) return errors.rateLimited("Maximum 5 reports per day");

    const report = await db.report.create({
      data: {
        reporterId: session.user.id,
        rulesetId,
        reason,
        details: details || null,
      },
      select: { id: true, reason: true, createdAt: true },
    });

    return success(report, 201);
  } catch {
    return errors.internal();
  }
}
