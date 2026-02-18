import { auth } from "@/lib/auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = [
  "/planner",
  "/vendor",
  "/storyteller",
  "/dashboard",
  "/settings",
];

// Routes only for guests (redirect if logged in)
const authRoutes = ["/auth/login", "/auth/register"];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(de|en)/, "") || "/";

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  if (isProtectedRoute || isAuthRoute) {
    const session = await auth();

    if (isProtectedRoute && !session) {
      // Redirect to login
      const locale = pathname.match(/^\/(de|en)/)?.[1] ?? "de";
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?callbackUrl=${pathname}`, req.url)
      );
    }

    if (isAuthRoute && session) {
      // Redirect logged-in users away from auth pages
      const locale = pathname.match(/^\/(de|en)/)?.[1] ?? "de";
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
    }
  }

  // Apply i18n middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
