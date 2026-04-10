import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { rateLimitWrite } from "@/lib/rate-limit";
import { reportSchema } from "@/lib/validations/engagement";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const rl = await rateLimitWrite(`reports:${session.user.id}`);
    if (!rl.ok) return errors.rateLimited();

    const body = await req.json();

    const parsed = reportSchema.safeParse(body);
    if (!parsed.success) {
      return errors.validation("Validation failed", {
        issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      });
    }
    const { rulesetId, reason, details } = parsed.data;

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
