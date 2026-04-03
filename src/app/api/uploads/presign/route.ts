import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";
import { validateFile, createPresignedUploadUrl, getMimeType } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const body = await req.json();
    const { rulesetId, versionId, filename, sizeBytes } = body;

    if (!rulesetId || !versionId || !filename || !sizeBytes) {
      return errors.validation("rulesetId, versionId, filename, and sizeBytes are required");
    }

    // Verify ownership
    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { authorId: true },
    });
    if (!ruleset) return errors.notFound("Ruleset not found");
    if (ruleset.authorId !== session.user.id) return errors.forbidden("Only the author can upload files");

    // Verify version exists
    const version = await db.rulesetVersion.findUnique({
      where: { id: versionId },
      select: { rulesetId: true },
    });
    if (!version || version.rulesetId !== rulesetId) return errors.notFound("Version not found");

    // Validate file
    const validation = validateFile(filename, sizeBytes);
    if (!validation.valid) return errors.validation(validation.error!);

    const { url, storageKey } = await createPresignedUploadUrl(rulesetId, versionId, filename);
    const mimeType = getMimeType(filename);

    return success({ url, storageKey, mimeType });
  } catch {
    return errors.internal();
  }
}
