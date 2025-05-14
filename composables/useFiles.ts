import usePocketBase from './usePocketbase';
import type { RecordModel } from 'pocketbase';

export default function useFiles() {
  const pb = usePocketBase();

  /**
   * Upload file and return URL
   */
  async function uploadFile(file: File, collection: string, recordId: string, field: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append(field, file);
      
      const record = await pb.collection(collection).update(recordId, formData);
      return pb.files.getUrl(record, record[field]);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  /**
   * Get full URL for a file
   */
  function getFileUrl(record: RecordModel, filename: string): string {
    return pb.files.getUrl(record, filename);
  }

  return {
    uploadFile,
    getFileUrl
  };
}