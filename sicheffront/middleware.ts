import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // ❌ No hay token → fuera
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // ❌ No es ADMIN → fuera
  if (token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ ADMIN → continúa
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};