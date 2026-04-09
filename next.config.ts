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

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: devOriginHost ? [devOriginHost] : [],
};

export default withNextIntl(nextConfig);
