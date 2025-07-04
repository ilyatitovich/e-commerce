import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";

const protectedRoutes = ["/", "/user/profile"];
const authRoutes = ["/auth/login", "/auth/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedRoute = protectedRoutes.includes(pathname);
  const isAuthRoute = authRoutes.includes(pathname);

  const token = req.cookies.get("token")?.value;
  const isTokenValid = token ? await verifyAuthToken(token) : false;

  if (isTokenValid && isAuthRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isTokenValid && isProtectedRoute) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/user/:path*", "/auth/:path*"],
};
