import usePocketBase from './usePocketbase'
import { getCache, setCache, getCacheKey } from './cacheSingleton'
import type { ListResult, RecordModel } from 'pocketbase'

export default function usePocketBaseCore() {
  const pb = usePocketBase()

  const fetchCollection = async (
    collection: string,
    page = 1,
    perPage = 10,
    filter = '',
    sort = '-created',
    expand: string | null = null,
    fields: string[] | null = null,
  ): Promise<ListResult<RecordModel>> => {
    const cacheKey = getCacheKey('fetchCollection', {
      collection,
      page,
      perPage,
      filter,
      sort,
      expand,
      fields,
    })

    const cached = getCache<ListResult<RecordModel>>(cacheKey)
    if (cached) return cached

    try {
      const response = await pb.collection(collection).getList(page, perPage, {
        filter,
        sort,
        expand: expand ?? undefined,
        fields: fields?.join(','),
      })

      setCache(cacheKey, response)
      return response
    } catch (error) {
      console.error(`Error fetching ${collection}:`, error)
      throw new Error(`Failed to fetch ${collection}`)
    }
  }

  const fetchRecord = async (
    collection: string,
    id: string | number,
  ): Promise<RecordModel> => {
    const stringId = id.toString()
    const cacheKey = getCacheKey('fetchRecord', { collection, id: stringId })

    const cached = getCache<RecordModel>(cacheKey)
    if (cached) return cached

    try {
      const record = await pb.collection(collection).getOne(stringId)
      setCache(cacheKey, record)
      return record
    } catch (error) {
      console.error(`Error fetching ${collection} record ${stringId}:`, error)
      throw new Error(`Failed to fetch ${collection} record`)
    }
  }

  const createItem = async (
    collection: string,
    data: Record<string, any>,
  ): Promise<RecordModel> => {
    try {
      return await pb.collection(collection).create(data)
    } catch (error) {
      console.error(`Error creating item in ${collection}:`, error)
      throw new Error(`Failed to create item in ${collection}`)
    }
  }

  const updateItem = async (
    collection: string,
    id: string,
    data: Record<string, any>,
  ): Promise<RecordModel> => {
    try {
      return await pb.collection(collection).update(id, data)
    } catch (error) {
      console.error(`Error updating item in ${collection}:`, error)
      throw new Error(`Failed to update item in ${collection}`)
    }
  }

  const deleteItem = async (collection: string, id: string): Promise<boolean> => {
    try {
      await pb.collection(collection).delete(id)
      return true
    } catch (error) {
      console.error(`Error deleting item from ${collection}:`, error)
      throw new Error(`Failed to delete item from ${collection}`)
    }
  }

  const uploadFile = async (
    file: File,
    collection: string,
    recordId: string,
    field: string,
  ): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append(field, file)

      const record = await pb.collection(collection).update(recordId, formData)
      return pb.files.getUrl(record, record[field])
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  const getFileUrl = (record: RecordModel, filename: string): string =>
    pb.files.getUrl(record, filename)

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
