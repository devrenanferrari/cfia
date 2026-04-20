import { type NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/home") {
    const token = await getToken({ req: request }).catch(() => null);
    if (token) {
      if (token.role === "ADMIN") return NextResponse.redirect(new URL("/admin", request.url));
      if (token.role === "INSTRUCTOR") return NextResponse.redirect(new URL("/instrutor", request.url));
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
