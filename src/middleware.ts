import { NextResponse, NextRequest } from "next/server";
import { env } from "@/lib/env";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  console.log(request);
  const token = await getToken({
    req: request,
    secret: env.AUTH_SECRET,
    salt: "",
  });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/dashboard/:path*", "/verify/:path*"],
};
