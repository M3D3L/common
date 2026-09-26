import type { RecordModel } from "pocketbase";

const COLLECTION = "Images";
const FILE_FIELD = "field";
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

  async function uploadImage(file: File): Promise<string> {
    validateImage(file);
    const formData = new FormData();
    formData.append(FILE_FIELD, file);
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
