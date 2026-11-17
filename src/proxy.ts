import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ROLE_HOME } from "@/lib/roles";

const DASHBOARD_PREFIXES = Object.values(ROLE_HOME);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // cv_role is a client-side UX cookie written by auth-store after the
  // backend verifies the role (login / refresh + /user/me). It only routes —
  // DashboardShell re-verifies the role after hydration and the API
  // authorizes every request, so this is never a security boundary.
  const role = request.cookies.get("cv_role")?.value;

  const isDashboardRoute = DASHBOARD_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isDashboardRoute && !role) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && role && ROLE_HOME[role]) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  if (isDashboardRoute && role) {
    const ownHome = ROLE_HOME[role];
    if (!ownHome || !pathname.startsWith(ownHome)) {
      return NextResponse.redirect(new URL(ownHome ?? "/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/department-admin/:path*",
    "/registrar/:path*",
    "/finance-admin/:path*",
    "/super-admin/:path*",
    "/login",
    "/register",
  ],
};
