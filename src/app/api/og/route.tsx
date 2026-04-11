import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

function clampTitle(t: string, max = 72) {
  if (t.length <= max) return t;
  return t.slice(0, max - 1).trimEnd() + "…";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = clampTitle(searchParams.get("title") || "Verified AI development assets", 72);
  const subtitle = clampTitle(
    searchParams.get("subtitle") || "Quality-scored. Security-scanned. Install in one command.",
    110,
  );
  const badge = searchParams.get("badge") || "";
  const rating = searchParams.get("rating") || "";
  const price = searchParams.get("price") || "";

  const BRAND = "#FFD166";
  const BG = "#0B0B0E";
  const FG = "#F5F5F7";
  const MUTED = "#8A8A94";
  const BORDER = "#2A2A31";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(255, 209, 102, 0.08), transparent 45%), radial-gradient(circle at 85% 100%, rgba(255, 209, 102, 0.05), transparent 60%)",
          padding: "72px 80px",
          fontFamily: "Inter, system-ui, sans-serif",
          color: FG,
        }}
      >
        {/* Header — wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: BRAND,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0B0B0E",
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: -1,
            }}
          >
            R
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>
              RuleSell
            </div>
            <div style={{ fontSize: 16, color: MUTED, marginTop: 2 }}>
              The verified marketplace
            </div>
          </div>
        </div>

        {/* Center — headline */}
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1040 }}>
          {badge && (
            <div
              style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                background: "rgba(255, 209, 102, 0.12)",
                color: BRAND,
                border: `1px solid ${BRAND}`,
                borderRadius: 999,
                padding: "6px 16px",
                fontSize: 18,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 24,
              }}
            >
              {badge}
            </div>
          )}
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: -2,
              color: FG,
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.35,
              marginTop: 28,
              color: MUTED,
              maxWidth: 960,
            }}
          >
            {subtitle}
          </div>
        </div>

        {/* Footer — signals + url */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${BORDER}`,
            paddingTop: 24,
            fontSize: 22,
            color: MUTED,
          }}
        >
          <div style={{ display: "flex", gap: 28 }}>
            {rating && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: BRAND }}>★</span>
                <span style={{ color: FG, fontWeight: 600 }}>{rating}</span>
              </div>
            )}
            {price && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: FG, fontWeight: 600 }}>{price}</span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>Verified</span>
              <span>·</span>
              <span>Quality scored</span>
              <span>·</span>
              <span>Scanned</span>
            </div>
          </div>
          <div style={{ color: FG, fontWeight: 600 }}>rulesell.vercel.app</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
