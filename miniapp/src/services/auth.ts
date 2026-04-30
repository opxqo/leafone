import Taro from '@tarojs/taro'
import { clearTokens, request, setTokens } from './request'

const AUTH_USER_KEY = 'leafone_auth_user'

export type AuthResult = {
  accessToken: string
  refreshToken: string
  userId: number
  role: string
  newUser?: boolean
  needBindStudent?: boolean
  studentVerified?: boolean
}

export type PasswordLoginPayload = {
  studentNo?: string
  phone?: string
  password: string
}

export type WechatLoginPayload = {
  code: string
}

export type RegisterPayload = {
  realName: string
  studentNo: string
  college: string
  major?: string
  grade?: string
  phone?: string
  password: string
}

export type VerifyStudentPayload = {
  realName: string
  studentNo: string
  college: string
  major?: string
  grade?: string
}

function persistAuth(auth: AuthResult) {
  setTokens(auth.accessToken, auth.refreshToken)
  Taro.setStorageSync(AUTH_USER_KEY, {
    userId: auth.userId,
    role: auth.role,
    newUser: auth.newUser ?? false,
    needBindStudent: auth.needBindStudent ?? false,
    studentVerified: auth.studentVerified ?? false,
  })
  return auth
}

export async function loginWithPassword(payload: PasswordLoginPayload) {
  const auth = await request<AuthResult>('/auth/login', {
    method: 'POST',
    auth: false,
    data: payload,
  })
  return persistAuth(auth)
}

export async function loginWithWechat(code: string) {
  const auth = await request<AuthResult>('/auth/wechat-login', {
    method: 'POST',
    auth: false,
    data: { code },
  })
  return persistAuth(auth)
}

export async function registerStudent(payload: RegisterPayload) {
  return request<null>('/auth/register', {
    method: 'POST',
    auth: false,
    data: payload,
  })
}

export async function verifyStudent(payload: VerifyStudentPayload) {
  return request<null>('/auth/verify-student', {
    method: 'POST',
    data: payload,
  })
}

export function logoutLocally() {
  clearTokens()
  Taro.removeStorageSync(AUTH_USER_KEY)
}
