import type { ServiceAdapter } from './types'

function notImplemented(methodName: string): never {
  throw new Error(`${methodName} is not implemented. Please wire real backend APIs.`)
}

export const httpAdapter: ServiceAdapter = {
  async fetchHomeData() {
    return notImplemented('fetchHomeData')
  },

  async fetchForumData() {
    return notImplemented('fetchForumData')
  },

  async fetchArticleData() {
    return notImplemented('fetchArticleData')
  },

  async fetchDiscoverCategories() {
    return notImplemented('fetchDiscoverCategories')
  },

  async fetchMessages() {
    return notImplemented('fetchMessages')
  },

  async fetchProfileData() {
    return notImplemented('fetchProfileData')
  },
}
