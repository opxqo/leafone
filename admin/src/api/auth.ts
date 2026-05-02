import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/v1/auth/login',
    params
  })
}

/**
 * 后端角色 → 前端角色映射
 */
const roleMapping: Record<string, string[]> = {
  ORGANIZER: ['R_SUPER', 'R_ADMIN'],
  ADMIN: ['R_ADMIN'],
  STUDENT: ['R_USER']
}

/**
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo(): Promise<Api.Auth.UserInfo> {
  return request.get<any>({
    url: '/api/v1/me/profile'
  }).then(res => {
    // 后端返回 { user: {...}, studentProfile: {...} }
    // 需要展平为 Api.Auth.UserInfo
    const user = res.user || res
    const backendRole = user.role || 'STUDENT'

    return {
      userId: String(user.id),
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      role: backendRole,
      roles: roleMapping[backendRole] || ['R_USER'],
      phone: user.phone,
      studentNo: user.studentNo,
      dorm: user.dorm,
      gender: user.gender,
      status: user.status
    }
  })
}

/**
 * 退出登录
 */
export function fetchLogout() {
  return request.post<void>({
    url: '/api/v1/auth/logout'
  })
}

/**
 * 刷新令牌
 * @param refreshToken 刷新令牌
 */
export function fetchRefreshToken(refreshToken: string) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/api/v1/auth/refresh',
    params: { refreshToken }
  })
}
