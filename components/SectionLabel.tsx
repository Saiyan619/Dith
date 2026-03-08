export function SectionLabel({
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
