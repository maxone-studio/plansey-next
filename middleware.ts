import createMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

// Routes that require authentication
const protectedRoutes = ["/planner", "/vendor", "/storyteller", "/settings"];
// Routes only for guests (not logged in)
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Strip locale prefix for route matching
  const pathnameWithoutLocale = pathname.replace(/^\/(de|en)/, "") || "/";

  // Create Supabase client for session check
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users away from protected routes
  const isProtected = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );
  if (isProtected && !user) {
    const locale = pathname.match(/^\/(de|en)/)?.[1] ?? "de";
    return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
  }

  // Redirect authenticated users away from auth routes
  const isAuthRoute = authRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );
  if (isAuthRoute && user) {
    const locale = pathname.match(/^\/(de|en)/)?.[1] ?? "de";
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  // Apply next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
