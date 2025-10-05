import { useCacheUtils } from './cacheUtils'

// Create a singleton instance of the cache
const cache = useCacheUtils({
  ttl: 3600 * 1000, // 1 hour
  namespace: 'pocketbase-cache',
  debug: import.meta.env.DEV,
})

// Export simple wrapper functions for convenience
export const getCacheKey = cache.getCacheKey
export const setCache = cache.set
export const getCache = cache.get
export const clearCache = cache.del
export const clearCachePattern = cache.delPattern
export const clearExpiredCache = cache.clearExpired
export const clearAllCache = cache.clearAll

// Export the cache instance for advanced usage
export default cache