export type BottomNavKey = 'home' | 'discover' | 'forum' | 'messages' | 'profile'

export interface ShortcutModule {
  id: string
  title: string
  icon: string
}

export interface Headline {
  id: string
  title: string
  meta: string
}

export interface HomeData {
  greeting: string
  title: string
  subtitle: string
  shortcuts: ShortcutModule[]
  headlines: Headline[]
  bannerTitle: string
  bannerSubtitle: string
}

export interface ForumTopic {
  id: string
  label: string
  heat: string
}

export interface ForumPost {
  id: string
  author: string
  badge: string
  meta: string
  title: string
  summary: string
  module: string
  avatar: string
  price?: string
  coverType: 'python' | 'bike'
  avatarTone: 'male' | 'female'
  stats: {
    share: number
    comment: number
    like: number
  }
}

export interface ForumData {
  topics: ForumTopic[]
  posts: ForumPost[]
}

export interface Attachment {
  id: string
  name: string
  size: string
  type: 'pdf' | 'doc'
}

export interface CommentItem {
  id: string
  author: string
  content: string
  time: string
}

export interface ArticleData {
  id: string
  author: string
  authorMeta: string
  title: string
  intro: string
  bulletPoints: string[]
  link: string
  linkCode: string
  attachments: Attachment[]
  comments: CommentItem[]
}

export interface DiscoverCategory {
  id: string
  title: string
  description: string
  todayCount: number
}

export interface MessageItem {
  id: string
  title: string
  detail: string
  time: string
  unread?: number
}

export interface ProfileAction {
  id: string
  title: string
}

export interface ProfileData {
  name: string
  identity: string
  studentId: string
  balance: string
  walletActions: ProfileAction[]
  settings: string[]
}

export interface ServiceAdapter {
  fetchHomeData: () => Promise<HomeData>
  fetchForumData: () => Promise<ForumData>
  fetchArticleData: (id: string) => Promise<ArticleData>
  fetchDiscoverCategories: () => Promise<DiscoverCategory[]>
  fetchMessages: () => Promise<MessageItem[]>
  fetchProfileData: () => Promise<ProfileData>
}
