import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cleanPlateText } from "@/lib/utils";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plateInput: string | undefined = body?.plate;
    const direction: string = body?.direction === "out" ? "out" : "in";
    const photoUrl: string | undefined = body?.photoDataUrl;

    if (!plateInput || !plateInput.trim()) {
      return NextResponse.json({ error: "A plate number is required" }, { status: 400 });
    }

    const plate = cleanPlateText(plateInput);

    const employee = await prisma.employee.findUnique({
      where: { registeredPlate: plate },
    });

    let type: "employee" | "visitor" | "unknown" = "unknown";
    let visitorId: string | null = null;

    if (employee) {
      type = "employee";
    } else {
      const activeVisitor = await prisma.visitor.findFirst({
        where: { vehiclePlate: plate, checkedOutAt: null },
        orderBy: { checkedInAt: "desc" },
      });
      if (activeVisitor) {
        type = "visitor";
        visitorId = activeVisitor.id;
      }
    }

    const log = await prisma.vehicleLog.create({
      data: {
        plate,
        type,
        direction,
        photoUrl,
        employeeId: employee?.id,
        visitorId: visitorId ?? undefined,
      },
      include: { employee: true, visitor: true },
    });

    return NextResponse.json({ log });
  } catch (err) {
    console.error("Vehicle entry error", err);
    return NextResponse.json({ error: "Could not log this vehicle entry." }, { status: 500 });
  }
}
