import type { RecordModel } from "pocketbase";

const COLLECTION = "Images";
const FILE_FIELD = "field";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export interface ImageMetadata {
  title?: string | null;
  source?: string | null;
  sourceKey?: string | null;
}

export default function useImages() {
  const { createItem, getFileUrl, updateItem } = usePocketBaseCore();

  function validateImage(file: File) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`${file.name} no es una imagen valida`);
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`${file.name} supera el limite de 5 MB`);
    }
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
  ): Promise<string> {
    validateImage(file);
    const title = metadata.title?.trim() || file.name.replace(/\.[^.]+$/, "");
    const namedFile = fileFromTitle(file, title);
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
  ): Promise<string> {
    validateImage(file);
    const formData = new FormData();
    formData.append(FILE_FIELD, file, record[FILE_FIELD]);
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
