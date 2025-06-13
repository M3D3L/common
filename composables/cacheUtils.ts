type CacheEntry<T> = {
  value: T
  expiry: number
}

export type CacheOptions = {
  ttl?: number
  namespace?: string
  debug?: boolean
}

const DEFAULT_TTL = 3600 * 1000 // 1 hour
const DEFAULT_NAMESPACE = 'app-cache'

export const useCacheUtils = ({
  ttl = DEFAULT_TTL,
  namespace = DEFAULT_NAMESPACE,
  debug = false, // This will be overridden to true in cacheSingleton.ts for debugging
}: CacheOptions = {}) => {
  // This Map will now be created ONLY ONCE when cacheSingleton.ts is imported
  const cache = new Map<string, CacheEntry<any>>()

  // For debugging, confirm a new Map instance is created
  if (debug) {
    console.log('[cacheUtils] New cache Map instance created:', cache);
  }

  const prefix = `${namespace}|`

  const log = (...args: unknown[]) => {
    if (debug) console.log('[cache]', ...args)
  }

  const getCacheKey = (operation: string, params: Record<string, unknown> = {}) => {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => `${key}:${JSON.stringify(val)}`)
      .join('|')
    return `${prefix}${operation}|${paramString}`
  }

  const set = <T>(key: string, value: T, ttlOverride?: number): void => {
    const expiry = Date.now() + (ttlOverride ?? ttl)
    cache.set(key, { value, expiry })
    // Removed external console.log, relying on internal log for consistency
    console.log('SET', key, 'value:', value, 'expiry:', new Date(expiry).toISOString())
  }

  const get = <T>(key: string): T | null => {
    const entry = cache.get(key)
    if (!entry) {
      console.log('MISS', key)
      return null
    }
    if (entry.expiry < Date.now()) {
      console.log('EXPIRED', key)
      cache.delete(key)
      return null
    }
    console.log('HIT', key, 'value:', entry.value)
    return entry.value
  }

  const del = (key: string): void => {
    log('DELETE', key)
    cache.delete(key)
  }

  const clearExpired = (): void => {
    const now = Date.now()
    for (const [key, { expiry }] of cache.entries()) {
      if (expiry <= now) {
        log('CLEANUP', key)
        cache.delete(key)
      }
    }
  }

  const clearAll = (): void => {
    log('CLEAR ALL')
    cache.clear()
  }

  return {
    getCacheKey,
    set,
    get,
    del,
    clearExpired,
    clearAll,
  } as const
}