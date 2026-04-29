import { type DependencyList, useEffect, useState } from 'react'

const asyncDataCache = new Map<string, unknown>()
const asyncDataPromises = new Map<string, Promise<unknown>>()

function serializeDependency(value: unknown) {
  if (value === null || value === undefined) {
    return String(value)
  }

  const valueType = typeof value
  if (valueType === 'string' || valueType === 'number' || valueType === 'boolean') {
    return `${valueType}:${String(value)}`
  }

  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}

function getCacheKey(loader: () => Promise<unknown>, deps: DependencyList, explicitKey?: string) {
  if (explicitKey) {
    return explicitKey
  }

  const loaderKey = loader.name || loader.toString()
  const depsKey = deps.map(serializeDependency).join('|')
  return `${loaderKey}::${depsKey}`
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList): T | null
export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList, initialData: T): T
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: null,
  cacheKey: string,
): T | null
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: T,
  cacheKey: string,
): T
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: T | null = null,
  cacheKey?: string,
): T | null {
  const resolvedCacheKey = getCacheKey(loader, deps, cacheKey)
  const [data, setData] = useState<T | null>(() => {
    if (asyncDataCache.has(resolvedCacheKey)) {
      return asyncDataCache.get(resolvedCacheKey) as T
    }
    return initialData
  })

  useEffect(() => {
    let mounted = true
    if (asyncDataCache.has(resolvedCacheKey)) {
      const cachedData = asyncDataCache.get(resolvedCacheKey) as T
      setData((current) => (Object.is(current, cachedData) ? current : cachedData))
      return () => {
        mounted = false
      }
    }

    setData((current) => (Object.is(current, initialData) ? current : initialData))

    let pendingData = asyncDataPromises.get(resolvedCacheKey) as Promise<T> | undefined
    if (!pendingData) {
      pendingData = loader()
        .then((nextData) => {
          asyncDataCache.set(resolvedCacheKey, nextData)
          return nextData
        })
        .finally(() => {
          if (asyncDataPromises.get(resolvedCacheKey) === pendingData) {
            asyncDataPromises.delete(resolvedCacheKey)
          }
        })
      asyncDataPromises.set(resolvedCacheKey, pendingData)
    }

    pendingData
      .then((nextData) => {
        if (mounted) {
          setData((current) => (Object.is(current, nextData) ? current : nextData))
        }
      })
      .catch((error: unknown) => {
        if (mounted) {
          console.error(error)
        }
      })

    return () => {
      mounted = false
    }
    // The caller owns when loader/initialData/cacheKey should change through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return data
}
