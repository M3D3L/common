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

  // AUTH STATE
  const user = pb.authStore.model;
  const isValid = pb.authStore.isValid;

  const isUserVerified = (): boolean => {
    return pb.authStore.isValid && pb.authStore.model?.verified === true;
  };

  /**
   * Fetch list of records with Caching
   */
  const fetchCollection = async (
    collection: string,
    page = 1,
    perPage = 10,
    filter = "",
    sort = "-created",
    expand: string | null = null,
    fields: string[] | null = null,
    ignoreCache: boolean = false
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
   * Fetch a single record by ID
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

  const createItem = async (
    collection: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    try {
      const record = await pb.collection(collection).create(data);
      invalidateCollectionCache(collection);
      return record;
    } catch (error) {
      throw new Error(`Failed to create item in ${collection}`);
    }
  };

  const updateItem = async (
    collection: string,
    id: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    try {
      const record = await pb.collection(collection).update(id, data);
      invalidateCollectionCache(collection);
      clearCache(getCacheKey("fetchRecord", { collection, id }));
      return record;
    } catch (error) {
      throw new Error(`Failed to update item in ${collection}`);
    }
  };

  const deleteItem = async (
    collection: string,
    id: string
  ): Promise<boolean> => {
    try {
      await pb.collection(collection).delete(id);
      invalidateCollectionCache(collection);
      clearCache(getCacheKey("fetchRecord", { collection, id }));
      return true;
    } catch (error) {
      throw new Error(`Failed to delete item from ${collection}`);
    }
  };

  const uploadFile = async (
    file: File,
    collection: string,
    recordId: string,
    field: string
  ): Promise<RecordModel> => {
    try {
      const formData = new FormData();
      formData.append(field, file);
      const record = await pb.collection(collection).update(recordId, formData);
      invalidateCollectionCache(collection);
      return record;
    } catch (error) {
      throw new Error("Failed to upload file");
    }
  };

  const invalidateCollectionCache = (collection: string) => {
    if (typeof clearCachePattern === "function") {
      clearCachePattern(collection);
    }
  };

  return {
    user,
    isValid,
    fetchCollection,
    fetchRecord,
    createItem,
    updateItem,
    deleteItem,
    uploadFile,
    invalidateCollectionCache,
    isUserVerified,
  };
}
