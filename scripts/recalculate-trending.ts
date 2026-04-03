/**
 * Trending score recalculation cron job.
 * Run every 15 minutes via Railway cron.
 *
 * Formula:
 *   score = (votes_7d × 3 + purchases_7d × 5 + downloads_7d × 2 + views_7d × 0.1) × decay_factor
 *   decay_factor = 1 / (1 + hours_since_last_event × 0.01)
 *
 * Usage: npx tsx scripts/recalculate-trending.ts
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

const WEIGHTS = {
  VOTE: 3,
  PURCHASE: 5,
  DOWNLOAD: 2,
  VIEW: 0.1,
};

async function recalculateTrending() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Get all rulesets with events in the last 7 days
  const rulesetsWithEvents = await db.rulesetEvent.groupBy({
    by: ["rulesetId", "type"],
    where: { createdAt: { gte: sevenDaysAgo } },
    _count: true,
  });

  // Group by ruleset
  const scores = new Map<string, { weighted: number; lastEvent: Date }>();

  for (const row of rulesetsWithEvents) {
    const weight = WEIGHTS[row.type as keyof typeof WEIGHTS] || 0;
    const existing = scores.get(row.rulesetId) || { weighted: 0, lastEvent: new Date(0) };
    existing.weighted += row._count * weight;
    scores.set(row.rulesetId, existing);
  }

  // Get most recent event time per ruleset
  const lastEvents = await db.rulesetEvent.groupBy({
    by: ["rulesetId"],
    where: { createdAt: { gte: sevenDaysAgo } },
    _max: { createdAt: true },
  });

  for (const row of lastEvents) {
    const existing = scores.get(row.rulesetId);
    if (existing && row._max.createdAt) {
      existing.lastEvent = row._max.createdAt;
    }
  }

  // Calculate final scores and update
  const now = Date.now();
  let updated = 0;

  for (const [rulesetId, data] of scores) {
    const hoursSinceLastEvent = (now - data.lastEvent.getTime()) / (1000 * 60 * 60);
    const decayFactor = 1 / (1 + hoursSinceLastEvent * 0.01);
    const trendingScore = data.weighted * decayFactor;

    await db.ruleset.update({
      where: { id: rulesetId },
      data: { trendingScore },
    });
    updated++;
  }

  // Zero out scores for rulesets with no recent events
  await db.ruleset.updateMany({
    where: {
      trendingScore: { gt: 0 },
      id: { notIn: [...scores.keys()] },
    },
    data: { trendingScore: 0 },
  });

  console.log(`Trending scores updated for ${updated} rulesets`);
}

recalculateTrending()
  .catch(console.error)
  .finally(() => {
    pool.end();
  });
