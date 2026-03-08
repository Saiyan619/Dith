"use client";

import { useCallback, useRef, useState } from "react";
import { floydSteinberg } from "@/lib/dithering/floydSteinberg";
import { atkinson } from "@/lib/dithering/atkinson";
import { bayer } from "@/lib/dithering/bayer";
import { loadImageFromFile } from "@/lib/image/loadImage";
import { getImageData, imageDataToDataURL } from "@/lib/image/canvasUtils";
import type { DitherSettings } from "@/components/DitherControls";

export interface ProcessorState {
    processedDataURL: string | null;
    isProcessing: boolean;
    error: string | null;
    processedWidth: number;
    processedHeight: number;
}

export function useCanvasProcessor() {
    const [state, setState] = useState<ProcessorState>({
        processedDataURL: null,
        isProcessing: false,
        error: null,
        processedWidth: 0,
        processedHeight: 0,
    });

    // Abort controller so we can cancel an in-flight operation
    const abortRef = useRef<AbortController | null>(null);

    const process = useCallback(
        async (file: File, settings: DitherSettings) => {
            // Cancel any previous run
            abortRef.current?.abort();
            const abort = new AbortController();
            abortRef.current = abort;

            setState((s) => ({ ...s, isProcessing: true, error: null }));

            try {
                // Step 1 — load the file into an Image element
                const img = await loadImageFromFile(file);
                if (abort.signal.aborted) return;

                // Step 2 — draw to canvas and extract pixel data (auto-downscales)
                const imageData = getImageData(img);
                if (abort.signal.aborted) return;

                // Step 3 — apply the chosen algorithm
                let processed: ImageData;
                switch (settings.algorithm) {
                    case "floyd-steinberg":
                        processed = floydSteinberg(imageData, settings.numColors);
                        break;
                    case "atkinson":
                        processed = atkinson(imageData, settings.numColors);
                        break;
                    case "bayer":
                        processed = bayer(imageData, settings.bayerSize, settings.numColors);
                        break;
                    default:
                        processed = floydSteinberg(imageData, settings.numColors);
                }

                if (abort.signal.aborted) return;

                // Step 4 — convert back to data URL
                const dataURL = imageDataToDataURL(processed);

                setState({
                    processedDataURL: dataURL,
                    isProcessing: false,
                    error: null,
                    processedWidth: processed.width,
                    processedHeight: processed.height,
                });
            } catch (err) {
                if (abort.signal.aborted) return;
                const message =
                    err instanceof Error ? err.message : "Unable to process image. Try a smaller file.";
                setState((s) => ({
                    ...s,
                    isProcessing: false,
                    error: message,
                }));
            }
        },
        []
    );

    const reset = useCallback(() => {
        abortRef.current?.abort();
        setState({
            processedDataURL: null,
            isProcessing: false,
            error: null,
            processedWidth: 0,
            processedHeight: 0,
        });
    }, []);

    return { ...state, process, reset };
}
