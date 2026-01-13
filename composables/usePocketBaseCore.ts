import { useRuntimeConfig } from "#app";
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
  const runtimeConfig = useRuntimeConfig();

  const isDev = runtimeConfig.public.environment === "development";

  const user = pb.authStore.model;
  const isValid = pb.authStore.isValid;

  const isUserVerified = (): boolean => {
    return pb.authStore.isValid && pb.authStore.model?.verified === true;
  };

  /**
   * Safe Logger: Only attempts to find Pinia on the client and when Pinia is initialized
   */
  const logQuery = async (key: string, data: any) => {
    if (process.client && isDev) {
      try {
        // Check if Pinia is available before importing
        const { getActivePinia } = await import("pinia");
        if (!getActivePinia()) {
          // Pinia not yet initialized, skip logging
          return;
        }

        // Dynamic import ensures the store is never touched by the server
        const { useDebugStore } = await import("~/store/debug");
        const debugStore = useDebugStore();
        debugStore.addQuery(key, data);
      } catch (e) {
        console.warn("DebugStore could not be initialized", e);
      }
    }
  };

  const fetchCollection = async (
    collection: string,
    page = 1,
    perPage = 10,
    filter = "",
    sort = "-created",
    expand: string | null = null,
    fields: string[] | null = null,
    ignoreCache: boolean = false,
    options: any = {} // New parameter to handle request overrides
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

    if (cached && !ignoreCache) {
      logQuery(`${cacheKey} (cache)`, cached);
      return cached;
    }

    try {
      // Determine the request key:
      // 1. If options.requestKey is explicitly provided (even if null), use it.
      // 2. Otherwise, use your standard default key.
      const requestKey = options.hasOwnProperty("requestKey")
        ? options.requestKey
        : `list_${collection}`;

      const response = await pb.collection(collection).getList(page, perPage, {
        filter,
        sort,
        expand: expand ?? undefined,
        requestKey: requestKey,
        ...options,
      });

      if (fields) {
        response.items = response.items.map((item) =>
          Object.fromEntries(
            Object.entries(item).filter(([k]) => fields.includes(k))
          )
        ) as any;
      }

      setCache(cacheKey, response);
      logQuery(`${cacheKey} (network)`, response);

      return response;
    } catch (error: any) {
      // Re-throw if it's an intentional cancellation from the SDK
      if (error.isAbort) throw error;

      // Provide a more descriptive error for debugging
      console.error(`PocketBase Fetch Error (${collection}):`, error);
      throw new Error(`Failed to fetch ${collection}: ${error.message}`);
    }
  };

  const fetchRecord = async (
    collection: string,
    id: string | number
  ): Promise<RecordModel> => {
    const stringId = id.toString();
    const cacheKey = getCacheKey("fetchRecord", { collection, id: stringId });

    const cached = getCache<RecordModel>(cacheKey);
    if (cached) return cached;

    try {
      const record = await pb.collection(collection).getOne(stringId, {
        requestKey: `record_${collection}_${stringId}`,
      });

      setCache(cacheKey, record);
      return record;
    } catch (error: any) {
      if (error.isAbort) throw error;
      throw new Error(`Failed to fetch ${collection} record`);
    }
  };

  const createItem = async (
    collection: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    const record = await pb.collection(collection).create(data);
    invalidateCollectionCache(collection);
    return record;
  };

  const updateItem = async (
    collection: string,
    id: string,
    data: Record<string, any>
  ): Promise<RecordModel> => {
    const record = await pb.collection(collection).update(id, data);
    invalidateCollectionCache(collection);
    clearCache(getCacheKey("fetchRecord", { collection, id }));
    return record;
  };

  const deleteItem = async (
    collection: string,
    id: string
  ): Promise<boolean> => {
    await pb.collection(collection).delete(id);
    invalidateCollectionCache(collection);
    clearCache(getCacheKey("fetchRecord", { collection, id }));
    return true;
  };

  const uploadFile = async (
    file: File,
    collection: string,
    recordId: string,
    field: string
  ): Promise<RecordModel> => {
    const formData = new FormData();
    formData.append(field, file);
    const record = await pb.collection(collection).update(recordId, formData);
    invalidateCollectionCache(collection);
    return record;
  };

  const invalidateCollectionCache = (collection: string) => {
    if (typeof clearCachePattern === "function") {
      clearCachePattern(collection);
    }
  };

  const getFileUrl = (record: RecordModel, filename: string): string => {
    return pb.files.getURL(record, filename);
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
    getFileUrl,
  };
}
