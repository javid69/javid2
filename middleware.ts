import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/auth/error", "/properties", "/about", "/contact"];
const authRoutes = ["/auth/signin", "/auth/signup"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = publicRoutes.some((route) => nextUrl.pathname === route || nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAgentRoute = nextUrl.pathname.startsWith("/agent");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = nextUrl.pathname + nextUrl.search;
    const signInUrl = new URL("/auth/signin", nextUrl);
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  if (isLoggedIn) {
    if (isDashboardRoute && !userRole) {
      return NextResponse.redirect(new URL("/auth/signin", nextUrl));
    }

    if (isAgentRoute && userRole !== "AGENT" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }

    if (isAdminRoute && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
