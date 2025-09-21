import { useCacheUtils } from './cacheUtils'

// Create and export a single instance of the cache utilities
export const cache = useCacheUtils({
  // 1 hour
  ttl: 60 * 60 * 1000,
  namespace: 'pb',
  // Set to true if you want to see cache debug logs
  debug: false,
})

// You can also export individual methods if you prefer
export const getCacheKey = cache.getCacheKey
export const setCache = cache.set
export const getCache = cache.get
export const deleteCache = cache.del
export const clearExpiredCache = cache.clearExpired
export const clearAllCache = cache.clearAll