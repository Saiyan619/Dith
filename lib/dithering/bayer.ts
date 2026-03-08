import { cloneImageData } from "../image/canvasUtils";

/**
 * Pre-computed normalized Bayer matrices.
 * Values are in the range [0, 1).
 */
const BAYER_2x2: readonly number[] = [
    0 / 4, 2 / 4,
    3 / 4, 1 / 4,
];

const BAYER_4x4: readonly number[] = [
    0 / 16, 8 / 16, 2 / 16, 10 / 16,
    12 / 16, 4 / 16, 14 / 16, 6 / 16,
    3 / 16, 11 / 16, 1 / 16, 9 / 16,
    15 / 16, 7 / 16, 13 / 16, 5 / 16,
];

const BAYER_8x8: readonly number[] = [
    0 / 64, 32 / 64, 8 / 64, 40 / 64, 2 / 64, 34 / 64, 10 / 64, 42 / 64,
    48 / 64, 16 / 64, 56 / 64, 24 / 64, 50 / 64, 18 / 64, 58 / 64, 26 / 64,
    12 / 64, 44 / 64, 4 / 64, 36 / 64, 14 / 64, 46 / 64, 6 / 64, 38 / 64,
    60 / 64, 28 / 64, 52 / 64, 20 / 64, 62 / 64, 30 / 64, 54 / 64, 22 / 64,
    3 / 64, 35 / 64, 11 / 64, 43 / 64, 1 / 64, 33 / 64, 9 / 64, 41 / 64,
    51 / 64, 19 / 64, 59 / 64, 27 / 64, 49 / 64, 17 / 64, 57 / 64, 25 / 64,
    15 / 64, 47 / 64, 7 / 64, 39 / 64, 13 / 64, 45 / 64, 5 / 64, 37 / 64,
    63 / 64, 31 / 64, 55 / 64, 23 / 64, 61 / 64, 29 / 64, 53 / 64, 21 / 64,
];

type BayerSize = 2 | 4 | 8;

/**
 * Bayer ordered dithering.
 *
 * Threshold dithering using a repeating Bayer matrix — no error diffusion.
 * Produces a regular, cross-hatched pattern with no directional bias.
 *
 * @param imageData   Source ImageData (not mutated)
 * @param matrixSize  2, 4, or 8 — size of the Bayer matrix tile
 * @param numColors   Number of evenly-spaced grayscale levels (2–256)
 * @returns           New ImageData with dithering applied
 */
export function bayer(
    imageData: ImageData,
    matrixSize: BayerSize = 4,
    numColors: number = 2
): ImageData {
    const out = cloneImageData(imageData);
    const data = out.data;
    const { width, height } = out;

    const matrix =
        matrixSize === 2 ? BAYER_2x2 :
            matrixSize === 8 ? BAYER_8x8 :
                BAYER_4x4;

    const step = 255 / (numColors - 1);

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            // Threshold offset from Bayer matrix
            const threshold = (matrix[(y % matrixSize) * matrixSize + (x % matrixSize)] - 0.5) * step;
            const adjusted = lum + threshold;
            const quantized = Math.round(adjusted / step) * step;
            const v = Math.max(0, Math.min(255, Math.round(quantized)));

            data[i] = v;
            data[i + 1] = v;
            data[i + 2] = v;
        }
    }

    return out;
}
