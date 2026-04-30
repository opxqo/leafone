import { Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, type ComponentProps, useEffect, useState } from 'react'

type CachedImageProps = ComponentProps<typeof Image> & {
  cacheRemote?: boolean
}

type ImageCacheEntry = {
  path: string
  expiresAt: number
}

const CACHE_STORAGE_KEY = 'leafone_image_cache_v1'
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000
const remoteImagePattern = /^https?:\/\//i
const localTempImagePattern = /^https?:\/\/tmp\//i
const wxLocalFilePattern = /^(wxfile|file):\/\//i
const memoryCache = new Map<string, ImageCacheEntry>()
const pendingCache = new Map<string, Promise<string>>()
let storageLoaded = false

function isRemoteImage(src?: string) {
  return Boolean(src && remoteImagePattern.test(src) && !localTempImagePattern.test(src))
}

function loadStorageCache() {
  if (storageLoaded) {
    return
  }
  storageLoaded = true

  const stored = Taro.getStorageSync(CACHE_STORAGE_KEY) as Record<string, ImageCacheEntry> | ''
  if (!stored || typeof stored !== 'object') {
    return
  }

  Object.entries(stored).forEach(([url, entry]) => {
    if (entry?.path && entry.expiresAt > Date.now()) {
      memoryCache.set(url, entry)
    }
  })
}

function persistStorageCache() {
  const snapshot: Record<string, ImageCacheEntry> = {}
  memoryCache.forEach((entry, url) => {
    if (entry.expiresAt > Date.now()) {
      snapshot[url] = entry
    }
  })
  Taro.setStorageSync(CACHE_STORAGE_KEY, snapshot)
}

function canAccessLocalFile(path: string) {
  if (!path || isRemoteImage(path)) {
    return false
  }

  if (localTempImagePattern.test(path) || wxLocalFilePattern.test(path)) {
    return true
  }

  try {
    Taro.getFileSystemManager().accessSync(path)
    return true
  } catch {
    return false
  }
}

function getCachedPath(src: string) {
  loadStorageCache()
  const entry = memoryCache.get(src)
  if (!entry || entry.expiresAt <= Date.now()) {
    memoryCache.delete(src)
    return ''
  }

  if (!canAccessLocalFile(entry.path)) {
    memoryCache.delete(src)
    persistStorageCache()
    return ''
  }

  return entry.path
}

function removeCachedPath(src: string) {
  memoryCache.delete(src)
  persistStorageCache()
}

async function resolveRemoteImage(src: string) {
  const cachedPath = getCachedPath(src)
  if (cachedPath) {
    return cachedPath
  }

  const pending = pendingCache.get(src)
  if (pending) {
    return pending
  }

  const nextPending = Taro.getImageInfo({ src })
    .then((result) => {
      const localPath = result.path || src
      if (localPath !== src) {
        memoryCache.set(src, {
          path: localPath,
          expiresAt: Date.now() + CACHE_TTL,
        })
        persistStorageCache()
      }
      return localPath
    })
    .catch(() => src)
    .finally(() => {
      pendingCache.delete(src)
    })

  pendingCache.set(src, nextPending)
  return nextPending
}

function CachedImage({ src, cacheRemote = true, lazyLoad = true, onError, ...props }: CachedImageProps) {
  const [resolvedSrc, setResolvedSrc] = useState(src)
  const shouldCache = cacheRemote && typeof src === 'string' && isRemoteImage(src)

  useEffect(() => {
    let mounted = true

    if (!shouldCache || typeof src !== 'string') {
      setResolvedSrc(src)
      return () => {
        mounted = false
      }
    }

    const cachedPath = getCachedPath(src)
    if (cachedPath) {
      setResolvedSrc(cachedPath)
      return () => {
        mounted = false
      }
    }

    setResolvedSrc(src)
    resolveRemoteImage(src).then((nextSrc) => {
      if (mounted) {
        setResolvedSrc(nextSrc)
      }
    })

    return () => {
      mounted = false
    }
  }, [shouldCache, src])

  return (
    <Image
      {...props}
      src={resolvedSrc}
      lazyLoad={lazyLoad}
      onError={(event) => {
        if (shouldCache && typeof src === 'string' && resolvedSrc !== src) {
          removeCachedPath(src)
          setResolvedSrc(src)
        }
        onError?.(event)
      }}
    />
  )
}

export default memo(CachedImage)
