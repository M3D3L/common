import usePocketBase from './usePocketbase'
import { useCacheUtils } from './cacheUtils'
import type { ListResult, RecordModel } from 'pocketbase'

export default function useCollection() {
  const pb = usePocketBase()
  const { get, set, getCacheKey } = useCacheUtils({
    ttl: 60 * 60 * 1000, // 1 hour
    namespace: 'pb',
  })

  /**
   * Generic fetch function for any collection with caching
   */
  async function fetchCollection(
    collection: string,
    page = 1,
    perPage = 10,
    filter = '',
    sort = '-created',
    expand = '',
    excludeFields: string[] = []
  ): Promise<ListResult<RecordModel>> {
    const cacheKey = getCacheKey('fetchCollection', {
      collection,
      page,
      perPage,
      filter,
      sort,
      expand,
      excludeFields: excludeFields.join(','),
    })

    const cached = get<ListResult<RecordModel>>(cacheKey)
    if (cached) return cached

    try {
      const response = await pb.collection(collection).getList(page, perPage, {
        filter,
        sort,
        expand,
      })

      if (excludeFields.length) {
        response.items = response.items.map((item: Record<string, any>) => {
          const clone = { ...item }
          for (const field of excludeFields) {
            delete clone[field]
          }
          return clone
        })
      }

      set(cacheKey, response)
      return response
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error)
      throw error
    }
  }

  /**
   * Fetch a single record by ID with caching
   */
  async function fetchRecord(
    collection: string,
    id: string | number
  ): Promise<RecordModel> {
    const stringId = id.toString()
    const cacheKey = getCacheKey('fetchRecord', { collection, id: stringId })

    const cached = get<RecordModel>(cacheKey)
    if (cached) return cached

    try {
      const record = await pb.collection(collection).getOne(stringId)
      set(cacheKey, record)
      return record
    } catch (error) {
      console.error(`Error fetching ${collection} record ${stringId}:`, error)
      throw new Error(`Failed to fetch ${collection} record`)
    }
  }

  return {
    fetchCollection,
    fetchRecord,
    pb,
  }
}
