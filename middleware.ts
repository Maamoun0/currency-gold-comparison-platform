import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth";
import { securityMiddleware } from "@/middleware/security";

const protectedRoutes = ["/dashboard", "/admin", "/alerts"];
const publicRoutes = ["/login", "/register", "/"];

export default async function middleware(req: NextRequest) {
  // 1. Run Security Middleware first
  const securityResponse = await securityMiddleware(req);
  if (securityResponse.status === 429) return securityResponse;

  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = req.cookies.get("session")?.value;
  const session = cookie ? await decrypt(cookie).catch(() => null) : null;

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session && path !== "/") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return securityResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
