import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const badgeCode: string | undefined = body?.badgeCode?.trim();

    if (!badgeCode) {
      return NextResponse.json({ error: "A badge code is required" }, { status: 400 });
    }

    const employee = await prisma.employee.findUnique({
      where: { badgeCode },
    });

    if (!employee) {
      return NextResponse.json({ error: `Badge "${badgeCode}" not recognized.` }, { status: 404 });
    }

    const lastLog = await prisma.accessLog.findFirst({
      where: { employeeId: employee.id },
      orderBy: { timestamp: "desc" },
    });

    const direction = lastLog?.direction === "in" ? "out" : "in";

    const log = await prisma.accessLog.create({
      data: {
        personType: "employee",
        employeeId: employee.id,
        direction,
        method: "badge",
      },
      include: { employee: true },
    });

    return NextResponse.json({ log });
  } catch (err) {
    console.error("Access log error", err);
    return NextResponse.json({ error: "Could not log this sign-in." }, { status: 500 });
  }
}
