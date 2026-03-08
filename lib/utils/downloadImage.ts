import { saveAs } from "file-saver";

/**
 * Convert a PNG data URL to a Blob and trigger a browser download.
 *
 * @param dataURL   The `canvas.toDataURL("image/png")` string
 * @param filename  Suggested filename (without extension)
 */
export function downloadAsPNG(dataURL: string, filename = "dithered"): void {
    // Strip the data-URI prefix to get the raw base64 string
    const base64 = dataURL.split(",")[1];
    if (!base64) throw new Error("Invalid data URL.");

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "image/png" });
    saveAs(blob, `${filename}.png`);
}
