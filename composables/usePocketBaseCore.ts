import usePocketBase from "./usePocketbase";
import {
  getCache,
  setCache,
  getCacheKey,
  clearCache,
  clearCachePattern,
} from "./cacheSingleton";
import type { ListResult, RecordModel } from "pocketbase";

export default function usePocketBaseCore() {
  const pb = usePocketBase();

  const isUserVerified = (): boolean => {
    return pb.authStore.isValid && pb.authStore.model?.verified === true;
  };

  /**
   * Fetch list of records
   */
  const fetchCollection = async (
    collection: string,
    page = 1,
    perPage = 10,
    filter = "",
    sort = "-created",
    expand: string | null = null,
    fields: string[] | null = null,
    ignoreCache: Boolean = false
  ): Promise<ListResult<RecordModel>> => {
    const cacheKey = getCacheKey("fetchCollection", {
      collection,
      page,
      perPage,
      filter,
      sort,
      expand,
      fields,
    });

    const cached = getCache<ListResult<RecordModel>>(cacheKey);

    if (cached && !ignoreCache) return cached;

    try {
      const response = await pb.collection(collection).getList(page, perPage, {
        filter,
        sort,
        expand: expand ?? undefined,
      });

      // Optional client-side field filtering
      if (fields) {
        response.items = response.items.map((item) =>
          Object.fromEntries(
            Object.entries(item).filter(([k]) => fields.includes(k))
          )
        ) as any;
      }

      setCache(cacheKey, response);
      return response;
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error);
      throw new Error(`Failed to fetch ${collection}`);
    }
  };

  /**
   * Fetch a single record
   */
  const fetchRecord = async (
    collection: string,
    id: string | number
  ): Promise<RecordModel> => {
    const stringId = id.toString();
    const cacheKey = getCacheKey("fetchRecord", { collection, id: stringId });

    const cached = getCache<RecordModel>(cacheKey);
    if (cached) return cached;

    try {
      const record = await pb.collection(collection).getOne(stringId);
      setCache(cacheKey, record);
      return record;
    } catch (error) {
      console.error(`Error fetching ${collection} record ${stringId}:`, error);
      throw new Error(`Failed to fetch ${collection} record`);
    }
  };

  /**
   * Create record
   */
  const createItem = async (
    collection: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    try {
      const record = await pb.collection(collection).create(data);
      invalidateCollectionCache(collection);
      return record;
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error);
      throw new Error(`Failed to create item in ${collection}`);
    }
  };

  /**
   * Update record
   */
  const updateItem = async (
    collection: string,
    id: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    try {
      const record = await pb.collection(collection).update(id, data);

      invalidateCollectionCache(collection);
      const recordCacheKey = getCacheKey("fetchRecord", { collection, id });
      clearCache(recordCacheKey);

      return record;
    } catch (error) {
      console.error(`Error updating item in ${collection}:`, error);
      throw new Error(`Failed to update item in ${collection}`);
    }
  };

  /**
   * Delete record
   */
  const deleteItem = async (
    collection: string,
    id: string
  ): Promise<boolean> => {
    try {
      await pb.collection(collection).delete(id);

      invalidateCollectionCache(collection);
      const recordCacheKey = getCacheKey("fetchRecord", { collection, id });
      clearCache(recordCacheKey);

      return true;
    } catch (error) {
      console.error(`Error deleting item from ${collection}:`, error);
      throw new Error(`Failed to delete item from ${collection}`);
    }
  };

  /**
   * Upload a file to a record field
   */
  const uploadFile = async (
    file: File,
    collection: string,
    recordId: string,
    field: string
  ): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append(field, file);

      const record = await pb.collection(collection).update(recordId, formData);

      invalidateCollectionCache(collection);
      const recordCacheKey = getCacheKey("fetchRecord", {
        collection,
        id: recordId,
      });
      clearCache(recordCacheKey);

      return pb.files.getUrl(record, record[field]);
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file");
    }
  };

  /**
   * Build file URL from record + filename
   */
  const getFileUrl = (record: RecordModel, filename: string): string =>
    pb.files.getUrl(record, filename);

  /**
   * Toggle user email visibility
   */
  const toggleEmailVisibility = async (
    id: string,
    isVisible: boolean
  ): Promise<RecordModel> => {
    try {
      const record = await pb.collection("users").update(id, {
        emailVisibility: isVisible,
      });

      invalidateCollectionCache("users");
      return record;
    } catch (err) {
      console.error("Failed to toggle email visibility:", err);
      throw err;
    }
  };

  /**
   * Invalidate all cache entries for a given collection
   */
  const invalidateCollectionCache = (collection: string) => {
    if (typeof clearCachePattern === "function") {
      // We search for the collection name specifically.
      // Since getCacheKey uses JSON.stringify, 'properties' becomes '"properties"'
      // Using just the string name is usually safer for .includes()
      clearCachePattern(collection);

      if (import.meta.env.DEV) {
        console.log(`Invalidating all cache entries containing: ${collection}`);
      }
    }
  };

  return {
    fetchCollection,
    fetchRecord,
    createItem,
    updateItem,
    deleteItem,
    uploadFile,
    getFileUrl,
    getCacheKey,
    toggleEmailVisibility,
    invalidateCollectionCache,
    isUserVerified,
    currentUser: pb.authStore.model,
  };
}
