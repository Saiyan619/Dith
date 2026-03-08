"use client";

import { useState, useCallback } from "react";
import { ImageUploader } from "@/components/ImageUploader";
import { ImagePreview } from "@/components/ImagePreview";
import {
  DitherControls,
  DEFAULT_SETTINGS,
  type DitherSettings,
} from "@/components/DitherControls";
import { DownloadButton } from "@/components/DownloadButton";
import { useCanvasProcessor } from "@/components/CanvasProcessor";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [settings, setSettings] = useState<DitherSettings>(DEFAULT_SETTINGS);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);

  const {
    processedDataURL,
    isProcessing,
    error: processingError,
    processedWidth,
    processedHeight,
    process,
    reset,
  } = useCanvasProcessor();

  const handleUpload = useCallback(
    (file: File) => {
      setUploadError(null);
      setUploadWarning(null);
      reset();
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const img = new Image();
        img.onload = () =>
          setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
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

  return (
    <div
      style={{ fontFamily: "var(--font-mono)" }}
      className="min-h-screen bg-black text-[#f0ede6]"
    >
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <header
        style={{ borderBottom: "var(--border)" }}
        className="px-6 py-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <span
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1,
            }}
          >
            DITH
          </span>
        </div>
        <p
          style={{ fontSize: 10, letterSpacing: "0.15em", opacity: 0.35 }}
          className="hidden sm:block uppercase"
        >
          Browser-based image dithering
        </p>
      </header>

      {/* ── MAIN ────────────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-0">

        {/* ── UPLOAD ZONE ── */}
        {!originalSrc && (
          <section
            style={{ borderBottom: "var(--border)" }}
            className="pb-10"
          >
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

        {/* ── MESSAGES ── */}
        {(uploadError || uploadWarning || processingError) && (
          <div className="py-4 flex flex-col gap-2">
            {uploadError && (
              <BrutAlert
                type="error"
                message={uploadError}
                onDismiss={() => setUploadError(null)}
              />
            )}
            {uploadWarning && (
              <BrutAlert
                type="warn"
                message={uploadWarning}
                onDismiss={() => setUploadWarning(null)}
              />
            )}
            {processingError && (
              <BrutAlert type="error" message={processingError} />
            )}
          </div>
        )}

        {/* ── POST-UPLOAD CONTENT ── */}
        {originalSrc && (
          <>
            {/* ── PREVIEW SECTION ── */}
            <section
              style={{ borderBottom: "var(--border)" }}
              className="py-10"
            >
              <SectionLabel index="01" title="PREVIEW" />
              {/* ── side-by-side preview row: two fixed-width cards ── */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 20,
                  marginTop: 24,
                  width: "100%",
                  maxWidth: 560,
                }}
              >
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
                  {processedDataURL ? (
                    <ImagePreview
                      src={processedDataURL}
                      label="PROCESSED"
                      width={processedWidth}
                      height={processedHeight}
                    />
                  ) : (
                    <EmptyProcessed isProcessing={isProcessing} />
                  )}
                </div>
              </div>
            </section>

            {/* ── CONTROLS SECTION ── */}
            <section
              style={{ borderBottom: "var(--border)" }}
              className="py-10"
            >
              <SectionLabel index="02" title="CONTROLS" />
              <div className="mt-6">
                <DitherControls
                  settings={settings}
                  onChange={setSettings}
                  disabled={isProcessing}
                />
              </div>
            </section>

            {/* ── ACTIONS SECTION ── */}
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

                <DownloadButton
                  dataURL={processedDataURL}
                  originalFileName={uploadedFile?.name}
                />

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
      <footer
        style={{ borderTop: "var(--border)", opacity: 0.25 }}
        className="px-6 py-3 flex items-center justify-between"
      >
        <span style={{ fontSize: 9, letterSpacing: "0.15em" }} className="uppercase">
          PNG / JPG / WebP
        </span>
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────────────────── */

function SectionLabel({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: "#ffe600",
        }}
      >
        [{index}]
      </span>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.25em",
        }}
        className="uppercase"
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "rgba(240,237,230,0.12)" }} />
    </div>
  );
}

function EmptyProcessed({ isProcessing }: { isProcessing: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* title bar — mirrors ImagePreview */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 10px",
          border: "2px solid rgba(240,237,230,0.18)",
        }}
      >
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "rgba(240,237,230,0.18)",
            fontFamily: "var(--font-mono)",
          }}
        >
          PROCESSED
        </span>
        <span
          style={{
            fontSize: 8,
            color: "rgba(240,237,230,0.1)",
            fontFamily: "var(--font-mono)",
          }}
        >
          —
        </span>
      </div>

      {/* body */}
      <div
        style={{
          border: "2px dashed rgba(240,237,230,0.12)",
          borderTop: "none",
          height: 260,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isProcessing ? (
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "#ffe600",
              fontFamily: "var(--font-mono)",
            }}
            className="uppercase animate-pulse"
          >
            // PROCESSING...
          </span>
        ) : (
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.15em",
              color: "rgba(240,237,230,0.15)",
              fontFamily: "var(--font-mono)",
            }}
            className="uppercase"
          >
            AWAITING RENDER
          </span>
        )}
      </div>

      {/* coord bar */}
      <div style={{ paddingTop: 6, paddingLeft: 2 }}>
        <span
          style={{
            fontSize: 8,
            letterSpacing: "0.12em",
            color: "rgba(240,237,230,0.1)",
            fontFamily: "var(--font-mono)",
          }}
          className="uppercase"
        >
          // OUTPUT
        </span>
      </div>
    </div>
  );
}

function BrutAlert({
  type,
  message,
  onDismiss,
}: {
  type: "error" | "warn";
  message: string;
  onDismiss?: () => void;
}) {
  const color = type === "error" ? "#ff2d00" : "#ffe600";
  return (
    <div
      role="alert"
      style={{
        border: `2px solid ${color}`,
        padding: "10px 14px",
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        fontSize: 11,
        letterSpacing: "0.05em",
        color: color,
      }}
    >
      <span style={{ fontWeight: 700 }}>
        {type === "error" ? "!! ERR" : "!! WARN"}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss"
          style={{
            background: "none",
            border: "none",
            color: color,
            cursor: "pointer",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          [X]
        </button>
      )}
    </div>
  );
}
