import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "port_vms_auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const userId: string | undefined = body?.userId;
  const password: string | undefined = body?.password;
  const expected = process.env.SITE_PASSWORD;
  // Optional — if SITE_USER isn't set, any non-empty ID is accepted
  // (the ID field is then just a label, not a second secret).
  const expectedUser = process.env.SITE_USER;

  // If no password is configured on the server, there's nothing to check
  // against — treat this as already-open (shouldn't normally be reachable
  // since the middleware won't redirect here in that case either).
  if (!expected) {
    return NextResponse.json({ ok: true });
  }

  if (!userId) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (expectedUser && userId !== expectedUser) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  if (!password || password !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // stay signed in for 30 days
  });
  return res;
}

export async function DELETE() {
  // Optional sign-out: clears the cookie so the next request is redirected
  // back to /login.
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
