import { mockAdapter } from './mock-adapter'
import { request } from './request'
import type { MeProfileResponse, ProfileData, ServiceAdapter } from './types'

function useMockFallback<T extends keyof ServiceAdapter>(methodName: T): ServiceAdapter[T] {
  return mockAdapter[methodName]
}

function stringifyId(value?: number | string | null) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  return String(value)
}

function getDisplayName(profile: MeProfileResponse) {
  return profile.user.nickname || profile.studentProfile?.realName || `微信用户${profile.user.id}`
}

function getIdentity(profile: MeProfileResponse) {
  const studentProfile = profile.studentProfile
  if (!studentProfile || !studentProfile.verified) {
    return '未学生认证'
  }

  const gradeText = studentProfile.grade ? `${studentProfile.grade}级` : studentProfile.identityLabel
  const parts = [studentProfile.college, gradeText].filter(Boolean)

  if (parts.length > 0) {
    return parts.join(' · ')
  }

  return studentProfile.verified ? '已完成学生认证' : '学生信息待完善'
}

function mapProfileData(profile: MeProfileResponse, fallback: ProfileData): ProfileData {
  const studentProfile = profile.studentProfile
  const verified = Boolean(studentProfile?.verified)

  return {
    ...fallback,
    name: getDisplayName(profile),
    identity: getIdentity(profile),
    studentId: stringifyId(studentProfile?.studentNo || profile.user.studentNo || profile.user.id),
    avatar: profile.user.avatarUrl || fallback.avatar,
    dorm: profile.user.dorm || fallback.dorm,
    verified,
  }
}

export const httpAdapter: ServiceAdapter = {
  fetchHomeData: useMockFallback('fetchHomeData'),
  fetchForumData: useMockFallback('fetchForumData'),
  fetchArticleData: useMockFallback('fetchArticleData'),
  fetchDiscoverCategories: useMockFallback('fetchDiscoverCategories'),
  fetchMessages: useMockFallback('fetchMessages'),
  async fetchProfileData() {
    const [profile, fallback] = await Promise.all([
      request<MeProfileResponse>('/me/profile'),
      mockAdapter.fetchProfileData(),
    ])
    console.info('[LeafOne Profile] 用户资料接口返回', {
      userId: profile.user.id,
      nickname: profile.user.nickname,
      studentVerified: Boolean(profile.studentProfile?.verified),
    })
    return mapProfileData(profile, fallback)
  },
}
