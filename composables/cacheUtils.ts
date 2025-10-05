type CacheEntry<T> = {
  value: T
  expiry: number
}

export type CacheOptions = {
  ttl?: number
  namespace?: string
  debug?: boolean
}

const DEFAULT_TTL = 3600 * 1000
const DEFAULT_NAMESPACE = 'app-cache'
const DB_NAME = 'cache-db'
const STORE_NAME = 'cache-store'

export const useCacheUtils = ({
  ttl = DEFAULT_TTL,
  namespace = DEFAULT_NAMESPACE,
  debug = false,
}: CacheOptions = {}) => {
  // In-memory cache for synchronous access
  const memoryCache = new Map<string, CacheEntry<any>>()
  let dbInitialized = false
  const prefix = `${namespace}|`

  // Initialize IndexedDB in the background
  const initDB = async () => {
    if (typeof window === 'undefined' || dbInitialized) return
    
    try {
      const request = indexedDB.open(DB_NAME, 1)
      
      request.onupgradeneeded = (event) => {
        const db = request.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' })
        }
      }
      
      const db = await new Promise<IDBDatabase>((resolve, reject) => {
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
      
      // Load all entries into memory
      const transaction = db.transaction(STORE_NAME, 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const requestAll = store.getAll()
      
      await new Promise<void>((resolve) => {
        requestAll.onsuccess = () => {
          const entries = requestAll.result as Array<{key: string, value: any, expiry: number}>
          const now = Date.now()
          
          entries.forEach(entry => {
            if (entry.expiry > now) {
              memoryCache.set(entry.key, { value: entry.value, expiry: entry.expiry })
            }
          })
          resolve()
        }
        requestAll.onerror = () => resolve()
      })
      
      dbInitialized = true
    } catch (error) {
      debug && console.error('IndexedDB initialization failed', error)
    }
  }

  // Start initialization (don't wait for it)
  initDB().catch(() => {})

  const getCacheKey = (operation: string, params: Record<string, unknown> = {}) => {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${key}:${JSON.stringify(val)}`)
      .join('|')
    return `${prefix}${operation}|${paramString}`
  }

  const set = <T>(key: string, value: T, ttlOverride?: number): void => {
    const expiry = Date.now() + (ttlOverride ?? ttl)
    const entry: CacheEntry<T> = { value, expiry }
    
    // Update memory cache
    memoryCache.set(key, entry)
    
    // Update IndexedDB in background
    if (typeof window !== 'undefined') {
      indexedDB.open(DB_NAME).onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.put({ key, ...entry }).onerror = () => {
          debug && console.error('Failed to persist cache entry')
        }
      }
    }
  }

  const get = <T>(key: string): T | null => {
    const entry = memoryCache.get(key)
    if (!entry) return null
    
    if (entry.expiry < Date.now()) {
      memoryCache.delete(key)
      // Delete from IndexedDB in background
      if (typeof window !== 'undefined') {
        indexedDB.open(DB_NAME).onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result
          const transaction = db.transaction(STORE_NAME, 'readwrite')
          const store = transaction.objectStore(STORE_NAME)
          store.delete(key)
        }
      }
      return null
    }
    
    return entry.value
  }

  const del = (key: string): void => {
    memoryCache.delete(key)
    // Delete from IndexedDB in background
    if (typeof window !== 'undefined') {
      indexedDB.open(DB_NAME).onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.delete(key)
      }
    }
  }

  const delPattern = (pattern: string): void => {
    // Delete all keys matching the pattern from memory cache
    const keysToDelete: string[] = []
    memoryCache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key)
      }
    })
    
    keysToDelete.forEach(key => memoryCache.delete(key))
    
    // Delete from IndexedDB in background
    if (typeof window !== 'undefined') {
      indexedDB.open(DB_NAME).onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        
        // Get all keys and delete matching ones
        const getAllRequest = store.getAllKeys()
        getAllRequest.onsuccess = () => {
          const allKeys = getAllRequest.result as string[]
          allKeys.forEach(key => {
            if (key.includes(pattern)) {
              store.delete(key)
            }
          })
        }
      }
    }
    
    if (debug) {
      console.log(`Cleared ${keysToDelete.length} cache entries matching pattern: ${pattern}`)
    }
  }

  const clearExpired = (): void => {
    const now = Date.now()
    memoryCache.forEach((entry, key) => {
      if (entry.expiry <= now) {
        memoryCache.delete(key)
      }
    })
    // IndexedDB will be cleaned up on next access
  }

  const clearAll = (): void => {
    memoryCache.clear()
    // Clear IndexedDB in background
    if (typeof window !== 'undefined') {
      indexedDB.open(DB_NAME).onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const transaction = db.transaction(STORE_NAME, 'readwrite')
        const store = transaction.objectStore(STORE_NAME)
        store.clear()
      }
    }
  }

  return {
    getCacheKey,
    set,
    get,
    del,
    delPattern,
    clearExpired,
    clearAll,
  } as const
}