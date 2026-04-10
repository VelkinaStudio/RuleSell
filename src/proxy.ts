import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { decode } from "next-auth/jwt";

import { isSanctioned } from "@/lib/compliance/sanctions";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const protectedPrefixes = ["/dashboard", "/settings"];
const adminPrefixes = ["/admin"];
const authPages = ["/login", "/signup", "/signin"];

/**
 * Combined edge middleware:
 * 1. Auth protection — redirects unauthenticated users from protected routes
 * 2. next-intl locale routing
 * 3. GPC (Sec-GPC: 1) cookie/header for CCPA opt-out
 * 4. OFAC geo-block hint cookie
 * 5. Resolved locale header
 */
export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip locale prefix for route matching (e.g. /en/dashboard → /dashboard)
  const locales = routing.locales as readonly string[];
  const segments = pathname.split("/").filter(Boolean);
  const firstSeg = segments[0] ?? "";
  const hasLocalePrefix = locales.includes(firstSeg);
  const pathWithoutLocale = hasLocalePrefix
    ? "/" + segments.slice(1).join("/")
    : pathname;

  // NextAuth JWT session cookie
  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ||
    req.cookies.get("__Secure-authjs.session-token")?.value;
  const isAuthenticated = !!sessionToken;

  // Protected routes → redirect to login
  const isProtected = protectedPrefixes.some((p) =>
    pathWithoutLocale.startsWith(p),
  );
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes → redirect to login, check role in JWT
  const isAdminRoute = adminPrefixes.some((p) => pathWithoutLocale.startsWith(p));
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    try {
      const secret = process.env.NEXTAUTH_SECRET;
      if (secret && sessionToken) {
        const token = await decode({ token: sessionToken, secret, salt: "" });
        if (!token || token.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      }
    } catch {
      // Decode failed — let the page-level check handle it
    }
  }

  // Auth pages → redirect to dashboard if already logged in
  const isAuthPage = authPages.some((p) => pathWithoutLocale === p);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/overview", req.url));
  }

  // Run next-intl locale routing
  const res = intlMiddleware(req);

  // Sec-GPC opt-out (CCPA § 1798.135 / CPRA)
  const gpc = req.headers.get("sec-gpc");
  if (gpc === "1") {
    res.cookies.set("gpc_honored", "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 365,
    });
    res.headers.set("x-gpc-honored", "1");
  }

  // OFAC geo-block hint
  const country = req.headers.get("x-vercel-ip-country") ?? "";
  if (country && isSanctioned(country)) {
    res.cookies.set("geo_restricted", "1", {
      path: "/",
      sameSite: "lax",
      httpOnly: false,
      maxAge: 60 * 60,
    });
  }

  // Resolved locale header
  const candidate = segments[0];
  const resolved = locales.includes(candidate ?? "")
    ? candidate
    : routing.defaultLocale;
  if (resolved) res.headers.set("x-resolved-locale", resolved);

  return res;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
