import { httpAdapter } from './http-adapter'
import { mockAdapter } from './mock-adapter'
import type {
  ArticleData,
  DiscoverCategory,
  ForumData,
  HomeData,
  MessageItem,
  ProfileData,
  ServiceAdapter,
} from './types'

function createAdapter(): ServiceAdapter {
  const mode = process.env.TARO_APP_API_MODE
  if (mode === 'api') {
    return httpAdapter
  }
  return mockAdapter
}

const adapter = createAdapter()

export function getHomeData(): Promise<HomeData> {
  return adapter.fetchHomeData()
}

export function getForumData(): Promise<ForumData> {
  return adapter.fetchForumData()
}

export function getArticleData(id: string): Promise<ArticleData> {
  return adapter.fetchArticleData(id)
}

export function getDiscoverCategories(): Promise<DiscoverCategory[]> {
  return adapter.fetchDiscoverCategories()
}

export function getMessages(): Promise<MessageItem[]> {
  return adapter.fetchMessages()
}

export function getProfileData(): Promise<ProfileData> {
  return adapter.fetchProfileData()
}

export type {
  ArticleData,
  DiscoverCategory,
  ForumData,
  Headline,
  HomeData,
  MessageItem,
  ProfileData,
  ShortcutModule,
} from './types'
