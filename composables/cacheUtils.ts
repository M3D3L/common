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
  debug = false,
}: CacheOptions = {}) => {
  const cache = new Map<string, CacheEntry<any>>()
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
    log('SET', key, value)
  }

  const get = <T>(key: string): T | null => {
    const entry = cache.get(key)
    if (!entry) {
      log('MISS', key)
      return null
    }
    if (entry.expiry < Date.now()) {
      log('EXPIRED', key)
      cache.delete(key)
      return null
    }
    log('HIT', key)
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
