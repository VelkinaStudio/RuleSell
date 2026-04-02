import { db } from "@/lib/db";
import { success, errors } from "@/lib/api/response";

export async function GET() {
  try {
    const tags = await db.tag.findMany({
      orderBy: { usageCount: "desc" },
      take: 100,
      select: { id: true, name: true, usageCount: true },
    });
    return success(tags);
  } catch {
    return errors.internal();
  }
}
