import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "port_vms_auth";

// A single shared-password gate for the whole demo site. Set SITE_PASSWORD
// (locally in .env, and in Vercel → Project Settings → Environment
// Variables) to turn it on. If SITE_PASSWORD is not set, the site behaves
// exactly as before — fully open, no login required.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow the login page itself and its API route through, so people
  // can actually reach the form that lets them in.
  if (pathname === "/login" || pathname === "/api/login") {
    return NextResponse.next();
  }

  const expected = process.env.SITE_PASSWORD;

  // No password configured — don't lock anyone out.
  if (!expected) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  if (cookie === expected) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

// Run on every page and API route except Next's internal static/image
// assets and the favicon — those need to load before login too.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
