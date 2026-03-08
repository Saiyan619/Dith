export function EmptyProcessed({ isProcessing }: { isProcessing: boolean }) {
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
