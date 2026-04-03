import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { verifyObjectExists, getMimeType } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId, versionId, storageKey, filename, format } = body;

    if (!rulesetId || !versionId || !storageKey || !filename || !format) {
      return errors.validation("rulesetId, versionId, storageKey, filename, and format are required");
    }

    // Verify ownership
    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can upload files");

    // Verify object exists in R2
    const { exists, sizeBytes } = await verifyObjectExists(storageKey);
    if (!exists) return errors.notFound("File not found in storage — upload may have failed");

    const mimeType = getMimeType(filename);

    // Create FileBundle record
    const fileBundle = await db.fileBundle.create({
      data: {
        rulesetVersionId: versionId,
        storageKey,
        filename,
        sizeBytes,
        mimeType,
        format,
      },
      select: { id: true, filename: true, sizeBytes: true, format: true },
    });

    return success(fileBundle, 201);
  } catch {
    return errors.internal();
  }
}
