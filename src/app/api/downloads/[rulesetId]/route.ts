import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { errors } from "@/lib/api/response";
import { resolveAccessState } from "@/lib/rulesets/access";
import { createPresignedDownloadUrl } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ rulesetId: string }> },
) {
  try {
    const { rulesetId } = await params;
    const session = await auth();
    if (!session?.user) return errors.unauthorized();

    const ruleset = await db.ruleset.findUnique({
      where: { id: rulesetId },
      select: { id: true, authorId: true, price: true },
    });

    if (!ruleset) return errors.notFound("Ruleset not found");

    // Verify access
    const accessState = await resolveAccessState(
      ruleset.id, ruleset.authorId, ruleset.price, session.user.id,
    );

    const canDownload = ["AUTHOR", "PURCHASED", "SUBSCRIPTION_ACTIVE", "FREE_DOWNLOAD"].includes(accessState);
    if (!canDownload) {
      return errors.forbidden("Purchase required to download this ruleset");
    }

    // Resolve version
    const versionId = req.nextUrl.searchParams.get("versionId");
    let version;

    if (versionId) {
      version = await db.rulesetVersion.findUnique({
        where: { id: versionId },
        include: { fileBundles: true },
      });
      if (!version || version.rulesetId !== rulesetId) {
        return errors.notFound("Version not found");
      }
    } else {
      version = await db.rulesetVersion.findFirst({
        where: { rulesetId },
        orderBy: { createdAt: "desc" },
        include: { fileBundles: true },
      });
    }

    if (!version) return errors.notFound("No versions found");
    if (version.fileBundles.length === 0) return errors.notFound("No files in this version");

    const fileBundle = version.fileBundles[0];
    const downloadUrl = await createPresignedDownloadUrl(fileBundle.storageKey);

    // Log download event
    await db.rulesetEvent.create({
      data: { rulesetId, type: "DOWNLOAD" },
    });
    await db.ruleset.update({
      where: { id: rulesetId },
      data: { downloadCount: { increment: 1 } },
    });

    // 302 redirect — never expose URL directly
    return new Response(null, {
      status: 302,
      headers: { Location: downloadUrl },
    });
  } catch {
    return errors.internal();
  }
}
