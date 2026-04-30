import {
  articleMockData,
  discoverMockData,
  forumMockData,
  homeMockData,
  messageMockData,
  profileMockData,
} from './mock-data'
import { getAppEnv } from './env'
import type { ServiceAdapter } from './types'

function wait(duration: number) {
  if (duration <= 0) {
    return Promise.resolve()
  }

  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

function getDelay() {
  const raw = Number(getAppEnv('TARO_APP_MOCK_DELAY'))
  if (Number.isFinite(raw) && raw >= 0) {
    return raw
  }
  return 0
}

const delay = getDelay()

export const mockAdapter: ServiceAdapter = {
  async fetchHomeData() {
    await wait(delay)
    return homeMockData
  },

  async fetchForumData() {
    await wait(delay)
    return forumMockData
  },

  async fetchArticleData() {
    await wait(delay)
    return articleMockData
  },

  async fetchDiscoverCategories() {
    await wait(delay)
    return discoverMockData
  },

  async fetchMessages() {
    await wait(delay)
    return messageMockData
  },

  async fetchProfileData() {
    await wait(delay)
    return profileMockData
  },
}
