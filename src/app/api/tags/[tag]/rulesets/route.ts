import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { list, errors } from "@/lib/api/response";
import { paginationFromCursor } from "@/lib/api/response";
import { listRulesets } from "@/lib/rulesets/queries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tag: string }> },
) {
  try {
    const { tag } = await params;
    const session = await auth();
    const sp = req.nextUrl.searchParams;

    const result = await listRulesets(
      {
        tagNames: [decodeURIComponent(tag)],
        sort: (sp.get("sort") as "newest" | "trending" | "most_voted" | "most_downloaded") || "newest",
        cursor: sp.get("cursor") || undefined,
        pageSize: 20,
      },
      session?.user?.id,
    );

    return list(result.data, paginationFromCursor(result.total, 20, result.nextCursor));
  } catch {
    return errors.internal();
  }
}
