import { cloneImageData } from "../image/canvasUtils";

/**
 * Floyd-Steinberg error-diffusion dithering.
 *
 * Quantizes each pixel and spreads the quantization error to neighbours:
 *   right       → 7/16
 *   bottom-left → 3/16
 *   bottom      → 5/16
 *   bottom-right→ 1/16
 *
 * @param imageData  Source ImageData (not mutated)
 * @param numColors  Number of evenly-spaced grayscale levels (2–256)
 * @returns          New ImageData with dithering applied
 */
export function floydSteinberg(
    imageData: ImageData,
    numColors: number = 2
): ImageData {
    const out = cloneImageData(imageData);
    const data = out.data;
    const { width, height } = out;

    // Build a flat grayscale buffer for error diffusion (avoids RGBA channel confusion)
    const gray = new Float32Array(width * height);

    for (let i = 0; i < width * height; i++) {
        const r = data[i * 4];
        const g = data[i * 4 + 1];
        const b = data[i * 4 + 2];
        // Luminance-weighted grayscale
        gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    }

    const step = 255 / (numColors - 1);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = y * width + x;
            const oldVal = gray[idx];
            const newVal = Math.round(oldVal / step) * step;
            const err = oldVal - newVal;

            gray[idx] = newVal;

            // Distribute error
            if (x + 1 < width) gray[idx + 1] += err * 7 / 16;
            if (y + 1 < height && x - 1 >= 0) gray[idx + width - 1] += err * 3 / 16;
            if (y + 1 < height) gray[idx + width] += err * 5 / 16;
            if (y + 1 < height && x + 1 < width) gray[idx + width + 1] += err * 1 / 16;
        }
    }

    // Write back to RGBA
    for (let i = 0; i < width * height; i++) {
        const v = Math.max(0, Math.min(255, Math.round(gray[i])));
        data[i * 4] = v;
        data[i * 4 + 1] = v;
        data[i * 4 + 2] = v;
        // alpha unchanged
    }

    return out;
}
