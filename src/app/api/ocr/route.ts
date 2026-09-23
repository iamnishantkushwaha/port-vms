import { NextRequest, NextResponse } from "next/server";
import { recognizePlate } from "@/lib/ocr";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageDataUrl: string | undefined = body?.imageDataUrl;
    if (!imageDataUrl) {
      return NextResponse.json({ error: "imageDataUrl is required" }, { status: 400 });
    }
    const { rawText, plate } = await recognizePlate(imageDataUrl);
    return NextResponse.json({ rawText, plate });
  } catch (err) {
    console.error("OCR error", err);
    return NextResponse.json({ error: "OCR failed. Try a clearer photo." }, { status: 500 });
  }
}
