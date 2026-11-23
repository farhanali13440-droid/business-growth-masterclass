import { supabase } from "@/integrations/supabase/client";
import { createScreenshotSignedUrl } from "@/lib/payment-screenshot.functions";

/** Shrink phone screenshots (often 3–5 MB) to a ~200 KB JPEG so upload + OCR are fast. */
export async function compressImage(file: File): Promise<Blob> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * scale);
    const h = Math.round(bmp.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    return blob && blob.size < file.size ? blob : file;
  } catch {
    return file;
  }
}

/** Upload to the payment-screenshots bucket; resolves to a long-lived signed URL (or path), or null on failure. */
export async function uploadScreenshot(blob: Blob, label: string): Promise<string | null> {
  try {
    const safe = label.replace(/[^a-z0-9]/gi, "_").slice(0, 40) || "upload";
    const path = `${Date.now()}-${safe}.jpg`;
    const { error } = await supabase.storage
      .from("payment-screenshots")
      .upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
    if (error) throw error;
    try {
      const { url } = await createScreenshotSignedUrl({ data: { path } });
      return url;
    } catch (e) {
      console.error("Signed URL creation failed", e);
      return path;
    }
  } catch (err) {
    console.error("Screenshot upload failed", err);
    return null;
  }
}
