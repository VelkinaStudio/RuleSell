import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Derive the allowed dev origin host from NEXT_PUBLIC_APP_URL so that
// tunneling the dev server (e.g. Cloudflare quick tunnel) works without
// editing code — just update the env var and restart `next dev`.
const devOriginHost = (() => {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url || !/^https?:\/\//.test(url)) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
})();

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: devOriginHost ? [devOriginHost] : [],
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
