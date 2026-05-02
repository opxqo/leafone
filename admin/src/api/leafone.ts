import request from '@/utils/http'

// ==================== 统计 ====================

export function fetchStats() {
  return request.get<Api.LeafOne.Stats>({ url: '/api/v1/admin/stats' })
}

// ==================== 帖子管理 ====================

export function fetchPosts(params: { status?: number; page?: number; pageSize?: number }) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.Post>>({
    url: '/api/v1/admin/posts',
    params
  })
}

export function updatePostStatus(postId: string, status: number) {
  return request.put<void>({
    url: `/api/v1/admin/posts/${postId}/status`,
    params: { status }
  })
}

export function togglePostPin(postId: string) {
  return request.put<void>({ url: `/api/v1/admin/posts/${postId}/pin` })
}

export function togglePostFeature(postId: string) {
  return request.put<void>({ url: `/api/v1/admin/posts/${postId}/feature` })
}

// ==================== 用户管理 ====================

export function fetchUsers(params: {
  keyword?: string
  role?: string
  status?: number
  page?: number
  pageSize?: number
}) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.User>>({
    url: '/api/v1/admin/users',
    params
  })
}

export function fetchUserDetail(userId: string) {
  return request.get<Api.LeafOne.User>({ url: `/api/v1/admin/users/${userId}` })
}

export function updateUser(userId: string, data: {
  nickname?: string
  phone?: string
  studentNo?: string
  dorm?: string
  avatarUrl?: string
  gender?: number
}) {
  return request.put<void>({ url: `/api/v1/admin/users/${userId}`, data })
}

export function deleteUser(userId: string) {
  return request.del<void>({ url: `/api/v1/admin/users/${userId}` })
}

export function banUser(userId: string) {
  return request.put<void>({ url: `/api/v1/admin/users/${userId}/ban` })
}

export function unbanUser(userId: string) {
  return request.put<void>({ url: `/api/v1/admin/users/${userId}/unban` })
}

export function updateUserRole(userId: string, role: string) {
  return request.put<void>({
    url: `/api/v1/admin/users/${userId}/role`,
    params: { role }
  })
}

export function verifyStudent(userId: string, approved: boolean) {
  return request.put<void>({
    url: `/api/v1/admin/users/${userId}/verify-student`,
    params: { approved }
  })
}

export function fetchVerifications(params: {
  verified?: number
  page?: number
  pageSize?: number
}) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.VerificationItem>>({
    url: '/api/v1/admin/verifications',
    params
  })
}

// ==================== 版块管理 ====================

export function fetchModules(params?: { enabled?: number }) {
  return request.get<Api.LeafOne.Module[]>({ url: '/api/v1/admin/modules', params })
}

export function createModule(data: Partial<Api.LeafOne.Module>) {
  return request.post<Api.LeafOne.Module>({ url: '/api/v1/admin/modules', data })
}

export function updateModule(moduleId: string, data: Partial<Api.LeafOne.Module>) {
  return request.put<void>({ url: `/api/v1/admin/modules/${moduleId}`, data })
}

export function deleteModule(moduleId: string) {
  return request.del<void>({ url: `/api/v1/admin/modules/${moduleId}` })
}

// ==================== 话题管理 ====================

export function fetchTopics(params?: { enabled?: number }) {
  return request.get<Api.LeafOne.Topic[]>({ url: '/api/v1/admin/topics', params })
}

export function createTopic(data: Partial<Api.LeafOne.Topic>) {
  return request.post<Api.LeafOne.Topic>({ url: '/api/v1/admin/topics', data })
}

export function updateTopic(topicId: string, data: Partial<Api.LeafOne.Topic>) {
  return request.put<void>({ url: `/api/v1/admin/topics/${topicId}`, data })
}

export function deleteTopic(topicId: string) {
  return request.del<void>({ url: `/api/v1/admin/topics/${topicId}` })
}

// ==================== 头条管理 ====================

export function fetchHeadlines(params?: { page?: number; pageSize?: number }) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.Headline>>({
    url: '/api/v1/admin/headlines',
    params
  })
}

export function createHeadline(data: Partial<Api.LeafOne.Headline>) {
  return request.post<Api.LeafOne.Headline>({ url: '/api/v1/admin/headlines', data })
}

export function updateHeadline(headlineId: string, data: Partial<Api.LeafOne.Headline>) {
  return request.put<void>({ url: `/api/v1/admin/headlines/${headlineId}`, data })
}

export function deleteHeadline(headlineId: string) {
  return request.del<void>({ url: `/api/v1/admin/headlines/${headlineId}` })
}

// ==================== 评论管理 ====================

export function fetchComments(params: {
  postId?: string
  userId?: string
  page?: number
  pageSize?: number
}) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.Comment>>({
    url: '/api/v1/admin/comments',
    params
  })
}

export function deleteComment(commentId: string) {
  return request.del<void>({ url: `/api/v1/admin/comments/${commentId}` })
}

export function updateCommentStatus(commentId: string, status: number) {
  return request.put<void>({
    url: `/api/v1/admin/comments/${commentId}/status`,
    params: { status }
  })
}

// ==================== 反馈管理 ====================

export function fetchFeedbacks(params: {
  status?: string
  page?: number
  pageSize?: number
}) {
  return request.get<Api.LeafOne.PageResult<Api.LeafOne.Feedback>>({
    url: '/api/v1/admin/feedbacks',
    params
  })
}

export function updateFeedbackStatus(feedbackId: string, status: string) {
  return request.put<void>({
    url: `/api/v1/admin/feedbacks/${feedbackId}/status`,
    params: { status }
  })
}

// ==================== 缓存监控 ====================

export function fetchCacheStatus() {
  return request.get<Api.LeafOne.CacheStatus>({ url: '/api/v1/admin/cache/status' })
}

// ==================== 通知管理 ====================

export function sendNotification(data: {
  title: string
  content: string
  targetType?: string
  targetId?: string
  userIds?: string[]
}) {
  return request.post<void>({ url: '/api/v1/admin/notifications', data })
}
