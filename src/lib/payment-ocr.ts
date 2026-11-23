/**
 * Free, in-browser payment-screenshot reading with Tesseract.js (no AI credits, no server cost).
 * Loaded from jsDelivr on demand so it adds nothing to the main bundle; preloadOcr() warms it
 * up while the buyer is still on the checkout page, so the check is quick when they upload.
 */
import {
  amountsInText,
  textHasPayeeAccount,
  textHasPayeeName,
  type ScreenshotReading,
} from "@/lib/payment-verify";

const TESSERACT_SRC = "https://cdn.jsdelivr.net/npm/tesseract.js@7.0.0/dist/tesseract.min.js";
const UNAVAILABLE: ScreenshotReading = {
  available: false,
  nameFound: false,
  accountFound: false,
  amounts: [],
};

type OcrWorker = { recognize: (img: Blob) => Promise<{ data: { text: string } }> };
type TesseractGlobal = { createWorker: (lang: string) => Promise<OcrWorker> };

let workerPromise: Promise<OcrWorker> | null = null;

function loadScript(): Promise<TesseractGlobal> {
  const w = window as unknown as { Tesseract?: TesseractGlobal };
  if (w.Tesseract) return Promise.resolve(w.Tesseract);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = TESSERACT_SRC;
    s.async = true;
    s.crossOrigin = "anonymous";
    s.onload = () => (w.Tesseract ? resolve(w.Tesseract) : reject(new Error("Tesseract missing")));
    s.onerror = () => reject(new Error("Tesseract failed to load"));
    document.head.appendChild(s);
  });
}

function getWorker(): Promise<OcrWorker> {
  if (!workerPromise) {
    workerPromise = loadScript()
      .then((T) => T.createWorker("eng"))
      .catch((err) => {
        workerPromise = null; // allow a retry on the next attempt
        throw err;
      });
  }
  return workerPromise;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}

/** Start downloading the OCR engine in the background (call on checkout page load). */
export function preloadOcr(): void {
  if (typeof window === "undefined") return;
  getWorker().catch(() => {
    /* will retry when a screenshot is picked */
  });
}

/** Read a screenshot. Never throws — returns { available: false } if OCR can't run. */
export async function readPaymentScreenshot(image: Blob): Promise<ScreenshotReading> {
  try {
    const worker = await withTimeout(getWorker(), 25_000);
    const { data } = await withTimeout(worker.recognize(image), 25_000);
    const text = data.text ?? "";
    return {
      available: true,
      nameFound: textHasPayeeName(text),
      accountFound: textHasPayeeAccount(text),
      amounts: amountsInText(text),
    };
  } catch (err) {
    console.error("[payment-ocr] could not read screenshot", err);
    return UNAVAILABLE;
  }
}
