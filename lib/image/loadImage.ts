/**
 * Load a File object into an HTMLImageElement via FileReader.
 * Returns a Promise that resolves with the loaded image.
 */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const src = e.target?.result as string;
            if (!src) {
                reject(new Error("Failed to read file."));
                return;
            }

            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Failed to load image."));
            img.src = src;
        };

        reader.onerror = () => reject(new Error("FileReader error."));
        reader.readAsDataURL(file);
    });
}

/**
 * Convert a data URL into an HTMLImageElement.
 */
export function loadImageFromDataURL(dataURL: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error("Failed to load image from data URL."));
        img.src = dataURL;
    });
}
