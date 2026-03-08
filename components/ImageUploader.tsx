"use client";

import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";

const ACCEPTED_TYPES = {
    "image/png": [".png"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/webp": [".webp"],
};

const MAX_SIZE_BYTES = 10 * 1024 * 1024;

interface ImageUploaderProps {
    onImageUpload: (file: File) => void;
    onError?: (message: string) => void;
    onWarning?: (message: string) => void;
}

export function ImageUploader({
    onImageUpload,
    onError,
    onWarning,
}: ImageUploaderProps) {
    const onDrop = useCallback(
        (accepted: File[], rejected: FileRejection[]) => {
            if (rejected.length > 0) {
                const code = rejected[0].errors[0]?.code;
                if (code === "file-too-large")
                    onError?.("FILE TOO LARGE — max 10 MB");
                else if (code === "file-invalid-type")
                    onError?.("INVALID FORMAT — PNG, JPG, WebP only");
                else
                    onError?.("UPLOAD FAILED — try again");
                return;
            }
            if (!accepted.length) return;
            const file = accepted[0];
            if (file.size > MAX_SIZE_BYTES)
                onWarning?.(`LARGE FILE (${(file.size / 1024 / 1024).toFixed(1)} MB) — processing may be slow`);
            onImageUpload(file);
        },
        [onImageUpload, onError, onWarning]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } =
        useDropzone({
            onDrop,
            accept: ACCEPTED_TYPES,
            maxSize: MAX_SIZE_BYTES,
            multiple: false,
        });

    return (
        <div
            {...getRootProps()}
            id="image-uploader"
            style={{
                border: isDragReject
                    ? "2px solid #ff2d00"
                    : isDragActive
                        ? "2px solid #ffe600"
                        : "2px dashed rgba(240,237,230,0.25)",
                background: isDragReject
                    ? "rgba(255,45,0,0.04)"
                    : isDragActive
                        ? "rgba(255,230,0,0.05)"
                        : "transparent",
                boxShadow: isDragActive ? "5px 5px 0px #ffe600" : "none",
                padding: "60px 40px",
                cursor: "crosshair",
                transition: "all 80ms ease",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
                userSelect: "none",
            }}
        >
            <input
                {...getInputProps()}
                id="image-file-input"
                aria-label="Upload image"
            />

            {/* Glyphs */}
            <div
                style={{
                    fontSize: 48,
                    lineHeight: 1,
                    color: isDragReject ? "#ff2d00" : isDragActive ? "#ffe600" : "rgba(240,237,230,0.15)",
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    transition: "color 80ms",
                }}
            >
                {isDragReject ? "XX" : isDragActive ? "//" : "[]"}
            </div>

            <div
                style={{
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                }}
            >
                {isDragReject ? (
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            color: "#ff2d00",
                        }}
                        className="uppercase"
                    >
                        UNSUPPORTED FORMAT
                    </p>
                ) : isDragActive ? (
                    <p
                        style={{
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            color: "#ffe600",
                        }}
                        className="uppercase"
                    >
                        RELEASE TO UPLOAD
                    </p>
                ) : (
                    <>
                        <p
                            style={{
                                fontSize: 11,
                                fontWeight: 700,
                                letterSpacing: "0.15em",
                                color: "rgba(240,237,230,0.5)",
                            }}
                            className="uppercase"
                        >
                            DROP IMAGE HERE
                        </p>
                        <p
                            style={{
                                fontSize: 10,
                                letterSpacing: "0.1em",
                                color: "rgba(240,237,230,0.2)",
                                marginTop: 8,
                            }}
                            className="uppercase"
                        >
                            — or click to browse —
                        </p>
                        <p
                            style={{
                                fontSize: 9,
                                letterSpacing: "0.12em",
                                color: "rgba(240,237,230,0.15)",
                                marginTop: 6,
                            }}
                            className="uppercase"
                        >
                            PNG · JPG · WEBP · max 10 MB
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}
