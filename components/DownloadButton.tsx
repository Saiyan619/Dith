"use client";

import { downloadAsPNG } from "@/lib/utils/downloadImage";

interface DownloadButtonProps {
    dataURL: string | null;
    originalFileName?: string;
}

function buildFileName(original?: string): string {
    if (!original) return "dithered";
    return `dithered-${original.replace(/\.[^/.]+$/, "")}`;
}

export function DownloadButton({ dataURL, originalFileName }: DownloadButtonProps) {
    const disabled = !dataURL;

    return (
        <button
            id="download-button"
            type="button"
            disabled={disabled}
            aria-label="Download processed image as PNG"
            onClick={() => {
                if (dataURL) downloadAsPNG(dataURL, buildFileName(originalFileName));
            }}
            className="brut-btn"
            style={{
                opacity: disabled ? 0.25 : 1,
                cursor: disabled ? "not-allowed" : "crosshair",
            }}
        >
            ↓ DOWNLOAD PNG
        </button>
    );
}
