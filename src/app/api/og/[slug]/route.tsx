import { ImageResponse } from "next/og";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const ruleset = await db.ruleset.findUnique({
    where: { slug },
    select: {
      title: true, description: true, platform: true, type: true,
      price: true, avgRating: true, downloadCount: true,
      author: { select: { name: true } },
    },
  });

  if (!ruleset) {
    return new ImageResponse(
      (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#0a0a0a", color: "#e5e5e5", fontFamily: "monospace", fontSize: 48 }}>
          Ruleset
        </div>
      ),
      { width: 1200, height: 630 },
    );
  }

  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#0a0a0a", padding: 60 }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ color: "#22c55e", fontSize: 14, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: 2 }}>
              {ruleset.platform} &bull; {ruleset.type}
            </span>
          </div>
          <h1 style={{ color: "#e5e5e5", fontSize: 52, fontFamily: "monospace", margin: 0, lineHeight: 1.2 }}>
            {ruleset.title}
          </h1>
          <p style={{ color: "#a3a3a3", fontSize: 22, fontFamily: "monospace", marginTop: 16, lineHeight: 1.4 }}>
            {ruleset.description.slice(0, 120)}{ruleset.description.length > 120 ? "..." : ""}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#737373", fontSize: 18, fontFamily: "monospace" }}>
            <span>by {ruleset.author.name}</span>
            <span>{ruleset.downloadCount} downloads</span>
            {ruleset.avgRating > 0 && <span>&#9733; {ruleset.avgRating.toFixed(1)}</span>}
          </div>
          <span style={{ color: "#22c55e", fontSize: 28, fontWeight: "bold", fontFamily: "monospace" }}>
            {ruleset.price === 0 ? "Free" : `$${ruleset.price.toFixed(2)}`}
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
