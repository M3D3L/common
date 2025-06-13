// usePocketBaseCore.ts
import usePocketBase from './usePocketbase'
import { getCache, setCache, getCacheKey } from './cacheSingleton'
import type { ListResult, RecordModel } from 'pocketbase'

export default function usePocketBaseCore() {
  const pb = usePocketBase()

  async function fetchCollection(
    collection: string,
    page = 1,
    perPage = 10,
    filter = '',
    sort = '-created',
    expand = '',
    excludeFields: string[] = []
  ): Promise<ListResult<RecordModel>> {
    let cacheKey = getCacheKey('fetchCollection', {
      collection,
      page,
      perPage,
      filter,
      sort,
    })

    try {
      const cached = getCache<ListResult<RecordModel>>(cacheKey)

      if (cached) {
        console.log(`Returning cached data for ${collection} collection`)
        return cached
      }

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

      setCache(cacheKey, response) // Use setCache
      return response
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error)
      throw error
    }
  }

  async function fetchRecord(
    collection: string,
    id: string | number
  ): Promise<RecordModel> {
    const stringId = id.toString()
    const cacheKey = getCacheKey('fetchRecord', { collection, id: stringId })

    const cached = getCache<RecordModel>(cacheKey) // Use getCache
    if (cached) return cached

    try {
      const record = await pb.collection(collection).getOne(stringId)
      setCache(cacheKey, record) // Use setCache
      return record
    } catch (error) {
      console.error(`Error fetching ${collection} record ${stringId}:`, error)
      throw new Error(`Failed to fetch ${collection} record`)
    }
  }

  async function createItem(collection: string, data: Record<string, any>): Promise<RecordModel> {
    try {
      const item = await pb.collection(collection).create(data)
      return item
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error)
      throw new Error(`Failed to create item in ${collection}`)
    }
  }

  async function updateItem(collection: string, id: string, data: Record<string, any>): Promise<RecordModel> {
    try {
      const item = await pb.collection(collection).update(id, data)
      return item
    } catch (error) {
      console.error(`Error updating item in ${collection}:`, error)
      throw new Error(`Failed to update item in ${collection}`)
    }
  }

  async function deleteItem(collection: string, id: string): Promise<boolean> {
    try {
      await pb.collection(collection).delete(id)
      return true
    } catch (error) {
      console.error(`Error deleting item from ${collection}:`, error)
      throw new Error(`Failed to delete item from ${collection}`)
    }
  }

  async function uploadFile(file: File, collection: string, recordId: string, field: string): Promise<string> {
    try {
      const formData = new FormData()
      formData.append(field, file)

      const record = await pb.collection(collection).update(recordId, formData)
      return pb.files.getUrl(record, record[field])
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  function getFileUrl(record: RecordModel, filename: string): string {
    return pb.files.getUrl(record, filename)
  }

  return {
    fetchCollection,
    fetchRecord,
    createItem,
    updateItem,
    deleteItem,
    uploadFile,
    getFileUrl,
    getCacheKey,
  }
}
