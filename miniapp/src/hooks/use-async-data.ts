import { type DependencyList, useCallback, useEffect, useRef, useState } from 'react'

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

type AsyncDataResult<T, D = T | null> = {
  data: D
  error: string | null
  retry: () => void
}

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList): AsyncDataResult<T>
export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList, initialData: T): AsyncDataResult<T, T>
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: null,
  cacheKey: string,
): AsyncDataResult<T>
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: T,
  cacheKey: string,
): AsyncDataResult<T, T>
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: T | null = null,
  cacheKey?: string,
): AsyncDataResult<T> {
  const resolvedCacheKey = getCacheKey(loader, deps, cacheKey)
  const [data, setData] = useState<T | null>(() => {
    if (asyncDataCache.has(resolvedCacheKey)) {
      return asyncDataCache.get(resolvedCacheKey) as T
    }
    return initialData
  })
  const [error, setError] = useState<string | null>(null)
  const retryCount = useRef(0)

  const fetchData = useCallback(() => {
    setError(null)
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
        setData((current) => (Object.is(current, nextData) ? current : nextData))
        setError(null)
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : '加载失败'
        setError(message)
        console.error(err)
      })
  }, [resolvedCacheKey])

  useEffect(() => {
    if (asyncDataCache.has(resolvedCacheKey)) {
      const cachedData = asyncDataCache.get(resolvedCacheKey) as T
      setData((current) => (Object.is(current, cachedData) ? current : cachedData))
      setError(null)
      return
    }

    fetchData()

    // The caller owns when loader/initialData/cacheKey should change through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  const retry = useCallback(() => {
    asyncDataCache.delete(resolvedCacheKey)
    asyncDataPromises.delete(resolvedCacheKey)
    retryCount.current += 1
    fetchData()
  }, [resolvedCacheKey, fetchData])

  return { data, error, retry }
}
