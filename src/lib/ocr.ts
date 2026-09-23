import { createWorker } from "tesseract.js";
import { cleanPlateText } from "./utils";

/**
 * Runs OCR on a captured photo (data URL) and returns the best-guess
 * license plate string. This is a real OCR pass, not a scripted match -
 * accuracy depends on the photo quality, just like a real ANPR camera.
 */
export async function recognizePlate(imageDataUrl: string): Promise<{
  rawText: string;
  plate: string;
}> {
  const worker = await createWorker("eng");
  try {
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    });
    const {
      data: { text },
    } = await worker.recognize(imageDataUrl);
    const plate = cleanPlateText(text);
    return { rawText: text, plate };
  } finally {
    await worker.terminate();
  }
}
