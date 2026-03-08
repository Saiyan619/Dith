import { cloneImageData } from "../image/canvasUtils";

/**
 * Atkinson dithering.
 *
 * Spreads 1/8 of error to 6 neighbours (only 6/8 total — intentionally lighter):
 *   right+1, right+2          (same row)
 *   bottom-left, bottom, bottom-right (next row)
 *   bottom-bottom (two rows down, centre)
 *
 * Produces a slightly lighter, more halftone-like look than Floyd-Steinberg.
 *
 * @param imageData  Source ImageData (not mutated)
 * @param numColors  Number of evenly-spaced grayscale levels (2–256)
 * @returns          New ImageData with dithering applied
 */
export function atkinson(
    imageData: ImageData,
    numColors: number = 2
): ImageData {
    const out = cloneImageData(imageData);
    const data = out.data;
    const { width, height } = out;

    const gray = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    const step = 255 / (numColors - 1);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const oldVal = gray[idx];
            const newVal = Math.round(oldVal / step) * step;
            const err = (oldVal - newVal) / 8;

            gray[idx] = newVal;

            // Same row
            if (x + 1 < width) gray[idx + 1] += err;
            if (x + 2 < width) gray[idx + 2] += err;
            // Next row
            if (y + 1 < height && x - 1 >= 0) gray[idx + width - 1] += err;
            if (y + 1 < height) gray[idx + width] += err;
            if (y + 1 < height && x + 1 < width) gray[idx + width + 1] += err;
            // Two rows down
            if (y + 2 < height) gray[idx + width * 2] += err;
        }
    }

    for (let i = 0; i < width * height; i++) {
        const v = Math.max(0, Math.min(255, Math.round(gray[i])));
        data[i * 4] = v;
        data[i * 4 + 1] = v;
        data[i * 4 + 2] = v;
    }

    return out;
}
