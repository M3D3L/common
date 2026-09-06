import imageCompression from "browser-image-compression";

export type ImageOutputFormat = "webp" | "jpeg" | "png" | "heic";

export interface ImageCompressionOptions {
  format?: ImageOutputFormat;
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  quality?: number;
  fileName?: string;
}

const extensionFor = (format: ImageOutputFormat) =>
  format === "jpeg" ? "jpg" : format;

const cleanBaseName = (name: string) =>
  name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "image";

export async function compressImage(
  file: File,
  options: ImageCompressionOptions = {},
): Promise<File> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files can be compressed");
  }

  const format = options.format ?? "webp";
  const mimeType = `image/${format}`;
  const compressed = await imageCompression(file, {
    maxSizeMB: options.maxSizeMB ?? 1,
    maxWidthOrHeight: options.maxWidthOrHeight ?? 1920,
    initialQuality: options.quality ?? 0.8,
    fileType: mimeType,
    useWebWorker: true,
  });
  const baseName = cleanBaseName(options.fileName || file.name);

  return new File([compressed], `${baseName}.${extensionFor(format)}`, {
    type: mimeType,
    lastModified: Date.now(),
  });
}

export default function useImageCompression() {
  return { compressImage };
}
