import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/settings"];
const adminPrefixes = ["/admin"];
const authPages = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // NextAuth JWT session cookie (set by next-auth with JWT strategy)
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  const isAuthenticated = !!sessionToken;

  // Protected routes: redirect to login if not authenticated
  const isProtected = protectedPrefixes.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes: redirect to login if not authenticated
  // Role-based authorization (ADMIN check) is handled in admin/layout.tsx
  const isAdmin = adminPrefixes.some((p) => pathname.startsWith(p));
  if (isAdmin && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Auth pages: redirect to dashboard if already authenticated
  const isAuthPage = authPages.includes(pathname);
  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard/overview", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
