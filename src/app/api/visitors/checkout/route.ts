import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const passCode: string | undefined = body?.passCode?.trim().toUpperCase();

    if (!passCode) {
      return NextResponse.json({ error: "A visitor pass code is required" }, { status: 400 });
    }

    const visitor = await prisma.visitor.findUnique({ where: { passCode } });

    if (!visitor) {
      return NextResponse.json({ error: `Pass "${passCode}" not found.` }, { status: 404 });
    }

    if (visitor.checkedOutAt) {
      return NextResponse.json({ error: `${visitor.name} already checked out.` }, { status: 409 });
    }

    const updated = await prisma.visitor.update({
      where: { id: visitor.id },
      data: { checkedOutAt: new Date() },
    });

    return NextResponse.json({ visitor: updated });
  } catch (err) {
    console.error("Visitor check-out error", err);
    return NextResponse.json({ error: "Could not check out this visitor." }, { status: 500 });
  }
}
