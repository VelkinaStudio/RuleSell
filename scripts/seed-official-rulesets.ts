#!/usr/bin/env tsx
/**
 * seed-official-rulesets.ts
 *
 * Loads the 10 first-party "Official" rulesets from docs/content/official-rulesets/
 * into the database. Safe to re-run — upserts by slug.
 *
 * Requires:
 *   - DATABASE_URL in env
 *   - An existing user with username "rulesell" to own the listings (or the
 *     script creates one)
 *
 * Usage:
 *   npx tsx scripts/seed-official-rulesets.ts
 *   DRY_RUN=1 npx tsx scripts/seed-official-rulesets.ts
 */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { db } from "../src/lib/db";

const DRY_RUN = process.env.DRY_RUN === "1";
const CONTENT_DIR = path.join(__dirname, "..", "docs", "content", "official-rulesets");
const OWNER_USERNAME = "rulesell";

interface ListingFile {
  slug: string;
  title: string;
  type: string;
  platform: string;
  category: string;
  price: number;
  currency: string;
  license: string;
  tags: string[];
  description: string;
  previewContent: string;
  body: string;
  hook: string;
  qualityScoreExpected: number;
}

async function ensureOwner() {
  let owner = await db.user.findUnique({ where: { username: OWNER_USERNAME } });
  if (!owner) {
    if (DRY_RUN) {
      console.log(`[dry-run] would create owner user ${OWNER_USERNAME}`);
      return { id: "dry-run-owner-id" };
    }
    owner = await db.user.create({
      data: {
        email: "official@rulesell.dev",
        name: "RuleSell Official",
        username: OWNER_USERNAME,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });
    console.log(`✓ Created owner user: ${owner.username}`);
  }
  return owner;
}

function readListings(): ListingFile[] {
  const files = readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".json") && !f.startsWith("README"))
    .sort();

  return files.map((filename) => {
    const fullPath = path.join(CONTENT_DIR, filename);
    const raw = readFileSync(fullPath, "utf-8");
    try {
      return JSON.parse(raw) as ListingFile;
    } catch (err) {
      throw new Error(`Failed to parse ${filename}: ${err}`);
    }
  });
}

async function seedOne(listing: ListingFile, ownerId: string) {
  const existing = await db.ruleset.findUnique({ where: { slug: listing.slug } });

  const data = {
    title: listing.title,
    slug: listing.slug,
    description: listing.description,
    previewContent: listing.previewContent,
    type: listing.type as any,
    platform: listing.platform as any,
    category: listing.category,
    price: listing.price,
    currency: listing.currency,
    authorId: ownerId,
    status: "PUBLISHED" as const,
  };

  if (existing) {
    if (DRY_RUN) {
      console.log(`[dry-run] would UPDATE ${listing.slug}`);
      return;
    }
    await db.ruleset.update({
      where: { slug: listing.slug },
      data,
    });
    console.log(`✓ Updated: ${listing.slug}`);
  } else {
    if (DRY_RUN) {
      console.log(`[dry-run] would CREATE ${listing.slug}`);
      return;
    }
    const created = await db.ruleset.create({
      data: {
        ...data,
        versions: {
          create: {
            version: "1.0.0",
            fullContent: listing.body,
            changelog: "Initial Official release",
          },
        },
      },
    });
    console.log(`✓ Created: ${created.slug}`);
  }
}

async function main() {
  console.log(`Seeding Official rulesets from ${CONTENT_DIR}`);
  if (DRY_RUN) console.log("DRY RUN mode — no database writes");

  const listings = readListings();
  console.log(`Found ${listings.length} listing(s)`);

  const owner = await ensureOwner();

  for (const listing of listings) {
    try {
      await seedOne(listing, owner.id);
    } catch (err) {
      console.error(`✗ Failed ${listing.slug}:`, err);
    }
  }

  console.log("Done.");
  await db.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
