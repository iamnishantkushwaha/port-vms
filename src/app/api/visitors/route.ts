import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanPlateText, generatePassCode } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name: string | undefined = body?.name?.trim();
    const company: string | undefined = body?.company?.trim();
    const purpose: string | undefined = body?.purpose?.trim();
    const hostEmployeeId: string | undefined = body?.hostEmployeeId || undefined;
    const vehiclePlateRaw: string | undefined = body?.vehiclePlate?.trim();
    const idPhotoUrl: string | undefined = body?.idPhotoDataUrl || undefined;

    if (!name || !purpose) {
      return NextResponse.json({ error: "Name and purpose of visit are required" }, { status: 400 });
    }

    let passCode = generatePassCode();
    // Extremely unlikely collision, but guard anyway.
    for (let attempt = 0; attempt < 5; attempt++) {
      const existing = await prisma.visitor.findUnique({ where: { passCode } });
      if (!existing) break;
      passCode = generatePassCode();
    }

    const visitor = await prisma.visitor.create({
      data: {
        name,
        company,
        purpose,
        hostEmployeeId,
        vehiclePlate: vehiclePlateRaw ? cleanPlateText(vehiclePlateRaw) : undefined,
        idPhotoUrl,
        passCode,
      },
      include: { hostEmployee: true },
    });

    return NextResponse.json({ visitor });
  } catch (err) {
    console.error("Visitor check-in error", err);
    return NextResponse.json({ error: "Could not check in this visitor." }, { status: 500 });
  }
}
