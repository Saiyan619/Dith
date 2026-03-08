"use client";

import Image from "next/image";

interface ImagePreviewProps {
    src: string;
    label: string;
    width: number;
    height: number;
    fileSize?: number;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)}MB`;
}

const isProcessed = (label: string) => label === "PROCESSED";

export function ImagePreview({
    src,
    label,
    width,
    height,
    fileSize,
}: ImagePreviewProps) {
    const processed = isProcessed(label);
    const accent = processed ? "#ffe600" : "#f0ede6";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0, width: "100%" }}>
            {/* ── Title bar ─────────────────────────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    border: `2px solid ${accent}`,
                    background: processed ? "#ffe600" : "transparent",
                }}
            >
                <span
                    style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.22em",
                        color: processed ? "#000" : accent,
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {label}
                </span>
                <span
                    style={{
                        fontSize: 8,
                        letterSpacing: "0.08em",
                        color: processed ? "rgba(0,0,0,0.5)" : "rgba(240,237,230,0.35)",
                        fontFamily: "var(--font-mono)",
                    }}
                >
                    {width > 0 ? `${width}×${height}` : "—"}
                    {fileSize !== undefined ? ` · ${formatSize(fileSize)}` : ""}
                </span>
            </div>

            {/* ── Image frame with corner ticks ─────────────────────────────── */}
            <div
                style={{
                    position: "relative",
                    border: `2px solid ${accent}`,
                    borderTop: "none",
                    /* offset shadow towards bottom-right in accent color */
                    boxShadow: processed
                        ? "6px 6px 0px #ffe600"
                        : "6px 6px 0px rgba(240,237,230,0.18)",
                    background: "#0a0a0a",
                    /* fixed height so images don't blow up tall */
                    height: 260,
                }}
            >
                {/* Corner ticks — top-left */}
                <Tick pos="tl" color={accent} />
                {/* Corner ticks — top-right */}
                <Tick pos="tr" color={accent} />
                {/* Corner ticks — bottom-left */}
                <Tick pos="bl" color={accent} />
                {/* Corner ticks — bottom-right */}
                <Tick pos="br" color={accent} />

                {/* Crosshair centre mark */}
                <CrosshairMark color={accent} />

                {/* The image itself */}
                <Image
                    src={src}
                    alt={label}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-contain"
                    unoptimized
                    style={{ padding: 10 }}
                />
            </div>

            {/* ── Coord bar below the frame ──────────────────────────────────── */}
            <div
                style={{
                    display: "flex",
                    gap: 16,
                    paddingTop: 6,
                    paddingLeft: 2,
                }}
            >
                <span
                    style={{
                        fontSize: 8,
                        letterSpacing: "0.12em",
                        color: "rgba(240,237,230,0.2)",
                        fontFamily: "var(--font-mono)",
                    }}
                    className="uppercase"
                >
                    {processed ? "// OUTPUT" : "// INPUT"}
                </span>
                {width > 0 && (
                    <span
                        style={{
                            fontSize: 8,
                            letterSpacing: "0.1em",
                            color: "rgba(240,237,230,0.14)",
                            fontFamily: "var(--font-mono)",
                        }}
                    >
                        {(width * height).toLocaleString()}px
                    </span>
                )}
            </div>
        </div>
    );
}

/* ── Corner tick mark ────────────────────────────────────────────────────── */

type TickPos = "tl" | "tr" | "bl" | "br";

function Tick({ pos, color }: { pos: TickPos; color: string }) {
    const size = 10; // px length of each arm
    const thickness = 2;
    const offset = -1; // overlap with border

    const base: React.CSSProperties = {
        position: "absolute",
        pointerEvents: "none",
        zIndex: 2,
    };

    const h: React.CSSProperties = {
        position: "absolute",
        width: size,
        height: thickness,
        background: color,
    };
    const v: React.CSSProperties = {
        position: "absolute",
        width: thickness,
        height: size,
        background: color,
    };

    const positions: Record<TickPos, { outer: React.CSSProperties; hPos: React.CSSProperties; vPos: React.CSSProperties }> = {
        tl: {
            outer: { top: offset, left: offset },
            hPos: { top: 0, left: 0 },
            vPos: { top: 0, left: 0 },
        },
        tr: {
            outer: { top: offset, right: offset },
            hPos: { top: 0, right: 0 },
            vPos: { top: 0, right: 0 },
        },
        bl: {
            outer: { bottom: offset, left: offset },
            hPos: { bottom: 0, left: 0 },
            vPos: { bottom: 0, left: 0 },
        },
        br: {
            outer: { bottom: offset, right: offset },
            hPos: { bottom: 0, right: 0 },
            vPos: { bottom: 0, right: 0 },
        },
    };

    const { outer, hPos, vPos } = positions[pos];

    return (
        <div style={{ ...base, ...outer }}>
            <div style={{ ...h, ...hPos }} />
            <div style={{ ...v, ...vPos }} />
        </div>
    );
}

/* ── Tiny centre crosshair ────────────────────────────────────────────────── */

function CrosshairMark({ color }: { color: string }) {
    return (
        <div
            style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
                zIndex: 1,
                opacity: 0.08,
            }}
        >
            {/* horizontal arm */}
            <div style={{ position: "absolute", width: 20, height: 1, background: color, top: 0, left: -10 }} />
            {/* vertical arm */}
            <div style={{ position: "absolute", width: 1, height: 20, background: color, top: -10, left: 0 }} />
        </div>
    );
}
