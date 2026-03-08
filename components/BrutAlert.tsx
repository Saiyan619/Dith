export function BrutAlert({
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
                color,
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
                        color,
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
