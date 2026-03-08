/**
 * Canvas utilities for image processing.
 * All operations are client-side only (browser Canvas API).
 */

const MAX_WIDTH = 2000;

/**
 * Load pixel data from an HTMLImageElement into an ImageData object.
 * Automatically downscales images wider than MAX_WIDTH.
 */
export function getImageData(img: HTMLImageElement): ImageData {
    let { width, height } = img;

    // Auto-downscale if too wide
    if (width > MAX_WIDTH) {
        const ratio = MAX_WIDTH / width;
        width = MAX_WIDTH;
        height = Math.round(height * ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context.");

    ctx.drawImage(img, 0, 0, width, height);
    return ctx.getImageData(0, 0, width, height);
}

/**
 * Convert an ImageData object back to a PNG data URL.
 */
export function imageDataToDataURL(imageData: ImageData): string {
    const canvas = document.createElement("canvas");
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D canvas context.");

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL("image/png");
}

/**
 * Clone an ImageData so algorithms can mutate without touching the original.
 */
export function cloneImageData(imageData: ImageData): ImageData {
    return new ImageData(
        new Uint8ClampedArray(imageData.data),
        imageData.width,
        imageData.height
    );
}
