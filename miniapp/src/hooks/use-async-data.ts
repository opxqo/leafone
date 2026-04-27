import { type DependencyList, useEffect, useState } from 'react'

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList): T | null
export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList, initialData: T): T
export function useAsyncData<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  initialData: T | null = null,
): T | null {
  const [data, setData] = useState<T | null>(initialData)

  useEffect(() => {
    let mounted = true

    setData(initialData)
    loader()
      .then((nextData) => {
        if (mounted) {
          setData(nextData)
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
    // The caller owns when loader/initialData should change through deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return data
}
