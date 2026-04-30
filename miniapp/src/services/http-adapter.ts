import { mockAdapter } from './mock-adapter'
import type { ServiceAdapter } from './types'

function useMockFallback<T extends keyof ServiceAdapter>(methodName: T): ServiceAdapter[T] {
  return mockAdapter[methodName]
}

export const httpAdapter: ServiceAdapter = {
  fetchHomeData: useMockFallback('fetchHomeData'),
  fetchForumData: useMockFallback('fetchForumData'),
  fetchArticleData: useMockFallback('fetchArticleData'),
  fetchDiscoverCategories: useMockFallback('fetchDiscoverCategories'),
  fetchMessages: useMockFallback('fetchMessages'),
  fetchProfileData: useMockFallback('fetchProfileData'),
}
