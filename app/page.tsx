"use client";

import { useState, useCallback } from "react";

// ── Feature components
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { DitherControls, DEFAULT_SETTINGS, type DitherSettings } from "@/components/DitherControls";
import { DownloadButton } from "@/components/DownloadButton";

// ── UI primitives
import { SectionLabel } from "@/components/SectionLabel";
import { BrutAlert } from "@/components/BrutAlert";
import { EmptyProcessed } from "@/components/EmptyProcessed";

// ── Hooks
import { useCanvasProcessor } from "@/components/CanvasProcessor";

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  // ── Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });

  // ── Controls state
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);

  // ── Message state
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  // ── Processing state (via hook)
  const {
    processedDataURL,
    isProcessing,
    error: processingError,
    processedWidth,
    processedHeight,
    process,
    reset,
  } = useCanvasProcessor();

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleUpload = useCallback(
    (file: File) => {
      setUploadError(null);
      setUploadWarning(null);
      reset();

      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () => setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
        img.src = src;
        setOriginalSrc(src);
        setUploadedFile(file);
      };
      reader.readAsDataURL(file);
    },
    [reset]
  );

  const handleApply = useCallback(() => {
    if (!uploadedFile) return;
    process(uploadedFile, settings);
  }, [uploadedFile, settings, process]);

  const handleClear = useCallback(() => {
    setUploadedFile(null);
    setOriginalSrc(null);
    setOriginalDims({ w: 0, h: 0 });
    setUploadError(null);
    setUploadWarning(null);
    reset();
  }, [reset]);

  // ── Derived booleans
  const hasMessages = !!(uploadError || uploadWarning || processingError);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div style={{ fontFamily: "var(--font-mono)" }} className="min-h-screen bg-black text-[#f0ede6]">

      {/* ── HEADER ── */}
      <header style={{ borderBottom: "var(--border)" }} className="px-6 py-4 flex items-center justify-between">
        <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
          DITH
        </span>
        <p style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.35 }} className="hidden sm:block uppercase">
          Browser-based image dithering
        </p>
      </header>

      {/* ── MAIN ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-0">

        {/* [01] UPLOAD — shown only before an image is loaded */}
        {!originalSrc && (
          <section style={{ borderBottom: "var(--border)" }} className="pb-10">
            <SectionLabel index="01" title="UPLOAD" />
            <div className="mt-5">
              <ImageUploader
                onImageUpload={handleUpload}
                onError={setUploadError}
                onWarning={setUploadWarning}
              />
            </div>
          </section>
        )}

        {/* MESSAGES */}
        {hasMessages && (
          <div className="py-4 flex flex-col gap-2">
            {uploadError && <BrutAlert type="error" message={uploadError} onDismiss={() => setUploadError(null)} />}
            {uploadWarning && <BrutAlert type="warn" message={uploadWarning} onDismiss={() => setUploadWarning(null)} />}
            {processingError && <BrutAlert type="error" message={processingError} />}
          </div>
        )}

        {/* POST-UPLOAD SECTIONS */}
        {originalSrc && (
          <>
            {/* [01] PREVIEW */}
            <section style={{ borderBottom: "var(--border)" }} className="py-10">
              <SectionLabel index="01" title="PREVIEW" />
              <div style={{ display: "flex", flexDirection: "row", gap: 20, marginTop: 24, width: "100%", maxWidth: 560 }}>
                <div style={{ width: 265, flexShrink: 0 }}>
                  <ImagePreview
                    src={originalSrc}
                    label="ORIGINAL"
                    width={originalDims.w}
                    height={originalDims.h}
                    fileSize={uploadedFile?.size}
                  />
                </div>
                <div style={{ width: 265, flexShrink: 0 }}>
                  {processedDataURL
                    ? <ImagePreview src={processedDataURL} label="PROCESSED" width={processedWidth} height={processedHeight} />
                    : <EmptyProcessed isProcessing={isProcessing} />
                  }
                </div>
              </div>
            </section>

            {/* [02] CONTROLS */}
            <section style={{ borderBottom: "var(--border)" }} className="py-10">
              <SectionLabel index="02" title="CONTROLS" />
              <div className="mt-6">
                <DitherControls settings={settings} onChange={setSettings} disabled={isProcessing} />
              </div>
            </section>

            {/* [03] OUTPUT */}
            <section className="py-10">
              <SectionLabel index="03" title="OUTPUT" />
              <div className="mt-6 flex flex-wrap items-start gap-4">
                <button
                  id="apply-dither-button"
                  type="button"
                  onClick={handleApply}
                  disabled={isProcessing}
                  aria-label="Apply dithering"
                  className="brut-btn brut-btn-primary"
                >
                  {isProcessing ? "PROCESSING..." : "→ APPLY DITHER"}
                </button>

                <DownloadButton dataURL={processedDataURL} originalFileName={uploadedFile?.name} />

                <button
                  id="clear-button"
                  type="button"
                  onClick={handleClear}
                  className="brut-btn"
                  style={{ marginLeft: "auto" }}
                >
                  ← START OVER
                </button>
              </div>
            </section>
          </>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: "var(--border)", opacity: 0.25 }} className="px-6 py-3">
        <span style={{ fontSize: 9, letterSpacing: "0.15em" }} className="uppercase">
          PNG / JPG / WebP
        </span>
      </footer>

    </div>
  );
}
