import type { RecordModel } from "pocketbase";
import {
  compressImage,
  type ImageCompressionOptions,
} from "@common/composables/useImageCompression";

const COLLECTION = "Images";
const FILE_FIELD = "field";
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_SOURCE_FILE_SIZE = 20 * 1024 * 1024;
const DEFAULT_IMAGE_OPTIONS: ImageCompressionOptions = {
  format: "webp",
  maxSizeMB: 1,
  maxWidthOrHeight: 1600,
  quality: 0.8,
};

export interface ImageMetadata {
  title?: string | null;
  source?: string | null;
  sourceKey?: string | null;
}

export default function useImages() {
  const { createItem, getFileUrl, updateItem } = usePocketBaseCore();

  function validateImage(file: File, maxSize = MAX_SOURCE_FILE_SIZE) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} no es una imagen valida`);
    }
    if (file.size > maxSize) {
      throw new Error(
        `${file.name} supera el limite de ${Math.round(maxSize / 1024 / 1024)} MB`,
      );
    }
  }

  async function optimizeImage(
    file: File,
    fileName: string,
    options: ImageCompressionOptions = {},
  ) {
    validateImage(file);
    const optimized = await compressImage(file, {
      ...DEFAULT_IMAGE_OPTIONS,
      ...options,
      fileName,
    });
    validateImage(optimized, MAX_FILE_SIZE);
    return optimized;
  }

  function imageUrl(record: RecordModel) {
    const url = getFileUrl(record, record[FILE_FIELD]);
    if (/^https?:\/\//i.test(url) || !import.meta.client) return url;
    return new URL(url, window.location.origin).href;
  }

  function appendMetadata(formData: FormData, metadata: ImageMetadata) {
    const values = {
      title: metadata.title?.trim(),
      source: metadata.source?.trim(),
      source_key: metadata.sourceKey?.trim(),
    };

    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
  }

  function fileFromTitle(file: File, title?: string | null) {
    if (!title?.trim()) return file;

    const baseName = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 100);
    const extension = file.name.includes(".")
      ? file.name.split(".").pop()?.toLowerCase()
      : file.type.split("/").pop()?.toLowerCase();

    if (!baseName || !extension) return file;
    return new File([file], `${baseName}.${extension}`, {
      type: file.type,
      lastModified: file.lastModified,
    });
  }

  async function uploadImage(
    file: File,
    metadata: ImageMetadata = {},
    options: ImageCompressionOptions = {},
  ): Promise<string> {
    const title = metadata.title?.trim() || file.name.replace(/\.[^.]+$/, "");
    const optimized = await optimizeImage(file, title, options);
    const namedFile = fileFromTitle(optimized, title);
    const formData = new FormData();
    formData.append(FILE_FIELD, namedFile);
    appendMetadata(formData, {
      ...metadata,
      title,
    });
    const record = await createItem(COLLECTION, formData as any);
    return imageUrl(record);
  }

  async function replaceImage(
    record: RecordModel,
    file: File,
    options: ImageCompressionOptions = {},
  ): Promise<string> {
    const title =
      record.title?.trim() || record[FILE_FIELD].replace(/\.[^.]+$/, "");
    const optimized = await optimizeImage(file, title, options);
    const formData = new FormData();
    formData.append(FILE_FIELD, optimized);
    const updated = await updateItem(COLLECTION, record.id, formData as any);
    return imageUrl(updated);
  }

  return {
    collection: COLLECTION,
    fileField: FILE_FIELD,
    imageUrl,
    replaceImage,
    uploadImage,
    validateImage,
  };
}
