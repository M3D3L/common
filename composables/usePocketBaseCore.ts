import { useRuntimeConfig } from "#app";
import usePocketBase from "./usePocketbase";
import { useDebugStore } from "~/store/debug";
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
  const debugStore = useDebugStore();
  const runtimeConfig = useRuntimeConfig();

  const isDev = runtimeConfig.public.environment === "development";

  const user = pb.authStore.model;
  const isValid = pb.authStore.isValid;

  const isUserVerified = (): boolean => {
    return pb.authStore.isValid && pb.authStore.model?.verified === true;
  };

  /**
   * Fetch list of records
   * Logs cache hits and network requests ONLY in development
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

    if (cached && !ignoreCache) {
      if (isDev) {
        debugStore.addQuery(`${cacheKey} (cache)`, cached);
      }
      return cached;
    }

    try {
      const response = await pb.collection(collection).getList(page, perPage, {
        filter,
        sort,
        expand: expand ?? undefined,
        requestKey: `list_${collection}`,
      });

      if (fields) {
        response.items = response.items.map((item) =>
          Object.fromEntries(
            Object.entries(item).filter(([k]) => fields.includes(k))
          )
        ) as any;
      }

      setCache(cacheKey, response);

      if (isDev) {
        debugStore.addQuery(`${cacheKey} (network)`, response);
      }

      return response;
    } catch (error: any) {
      if (error.isAbort) throw error;
      throw new Error(`Failed to fetch ${collection}`);
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
    return pb.files.getUrl(record, filename);
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
