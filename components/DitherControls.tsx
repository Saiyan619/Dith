"use client";

export type DitherAlgorithm = "floyd-steinberg" | "atkinson" | "bayer";
export type BayerSize = 2 | 4 | 8;
export type ColorCount = 2 | 4 | 8 | 16;

export interface DitherSettings {
    algorithm: DitherAlgorithm;
    numColors: ColorCount;
    bayerSize: BayerSize;
}

export const DEFAULT_SETTINGS: DitherSettings = {
    algorithm: "floyd-steinberg",
    numColors: 2,
    bayerSize: 4,
};

interface DitherControlsProps {
    settings: DitherSettings;
    onChange: (s: DitherSettings) => void;
    disabled?: boolean;
}

// ── Reusable brutalist toggle row ────────────────────────────────────────────

interface ToggleRowProps<T extends string | number> {
    id: string;
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
    disabled?: boolean;
    style?: React.CSSProperties;
}

function ToggleRow<T extends string | number>({
    id,
    label,
    value,
    options,
    onChange,
    disabled,
    style,
}: ToggleRowProps<T>) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "stretch",
                border: "var(--border)",
                opacity: disabled ? 0.4 : 1,
                ...style,
            }}
        >
            {/* Label column */}
            <div
                style={{
                    borderRight: "var(--border)",
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    minWidth: 180,
                    background: "rgba(240,237,230,0.03)",
                }}
            >
                <span
                    style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.2em",
                        color: "#ffe600",
                    }}
                    className="uppercase"
                >
                    {label}
                </span>
            </div>

            {/* Button group */}
            <div style={{ display: "flex", flex: 1 }}>
                {options.map((opt, i) => {
                    const isActive = opt.value === value;
                    return (
                        <button
                            key={String(opt.value)}
                            id={`${id}-${opt.value}`}
                            type="button"
                            aria-pressed={isActive}
                            onClick={() => !disabled && onChange(opt.value)}
                            disabled={disabled}
                            style={{
                                flex: 1,
                                borderRight:
                                    i < options.length - 1 ? "var(--border)" : "none",
                                padding: "10px 8px",
                                background: isActive ? "#ffe600" : "transparent",
                                color: isActive ? "#000" : "rgba(240,237,230,0.45)",
                                fontFamily: "var(--font-mono)",
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.12em",
                                cursor: disabled ? "not-allowed" : "crosshair",
                                border: "none",
                                transition: "background 80ms, color 80ms",
                                boxShadow: isActive ? "inset 0 0 0 0" : "none",
                            }}
                            className="uppercase"
                            onMouseEnter={(e) => {
                                if (!isActive && !disabled)
                                    (e.currentTarget as HTMLButtonElement).style.color = "#f0ede6";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive && !disabled)
                                    (e.currentTarget as HTMLButtonElement).style.color =
                                        "rgba(240,237,230,0.45)";
                            }}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ── Options ──────────────────────────────────────────────────────────────────

const ALGO_OPTIONS: { value: DitherAlgorithm; label: string }[] = [
    { value: "floyd-steinberg", label: "Floyd-Steinberg" },
    { value: "atkinson", label: "Atkinson" },
    { value: "bayer", label: "Bayer" },
];

const COLOR_OPTIONS: { value: ColorCount; label: string }[] = [
    { value: 2, label: "2" },
    { value: 4, label: "4" },
    { value: 8, label: "8" },
    { value: 16, label: "16" },
];

const BAYER_OPTIONS: { value: BayerSize; label: string }[] = [
    { value: 2, label: "2×2" },
    { value: 4, label: "4×4" },
    { value: 8, label: "8×8" },
];

// ── Main component ────────────────────────────────────────────────────────────

export function DitherControls({
    settings,
    onChange,
    disabled,
}: DitherControlsProps) {
    const set = <K extends keyof DitherSettings>(k: K, v: DitherSettings[K]) =>
        onChange({ ...settings, [k]: v });

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <ToggleRow
                id="algorithm"
                label="ALGORITHM"
                value={settings.algorithm}
                options={ALGO_OPTIONS}
                onChange={(v) => set("algorithm", v)}
                disabled={disabled}
            />
            <ToggleRow
                id="colors"
                label="COLORS"
                value={settings.numColors}
                options={COLOR_OPTIONS}
                onChange={(v) => set("numColors", v as ColorCount)}
                disabled={disabled}
                style={{ marginTop: -2 }}
            />
            {settings.algorithm === "bayer" && (
                <ToggleRow
                    id="bayer-size"
                    label="BAYER MATRIX"
                    value={settings.bayerSize}
                    options={BAYER_OPTIONS}
                    onChange={(v) => set("bayerSize", v as BayerSize)}
                    disabled={disabled}
                    style={{ marginTop: -2 }}
                />
            )}
        </div>
    );
}
