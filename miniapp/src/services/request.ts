import Taro from '@tarojs/taro'
import { getAppEnv } from './env'

const BASE_URL = getAppEnv('TARO_APP_API_BASE_URL', getAppEnv('TARO_APP_BASE_URL', 'https://api.opxqo.cn/api/v1'))

const TOKEN_KEY = 'leafone_access_token'
const REFRESH_TOKEN_KEY = 'leafone_refresh_token'
const TOKEN_SAVED_AT_KEY = 'leafone_token_saved_at'
const AUTH_USER_KEY = 'leafone_auth_user'
const ACCESS_TOKEN_MAX_AGE_MS = 2 * 60 * 60 * 1000 - 60 * 1000

let isRedirectingToLogin = false

export function getAccessToken(): string | null {
  return Taro.getStorageSync(TOKEN_KEY) || null
}

export function getRefreshToken(): string | null {
  return Taro.getStorageSync(REFRESH_TOKEN_KEY) || null
}

export function setTokens(accessToken: string, refreshToken: string) {
  Taro.setStorageSync(TOKEN_KEY, accessToken)
  Taro.setStorageSync(REFRESH_TOKEN_KEY, refreshToken)
  Taro.setStorageSync(TOKEN_SAVED_AT_KEY, String(Date.now()))
}

export function clearTokens() {
  Taro.removeStorageSync(TOKEN_KEY)
  Taro.removeStorageSync(REFRESH_TOKEN_KEY)
  Taro.removeStorageSync(TOKEN_SAVED_AT_KEY)
  Taro.removeStorageSync(AUTH_USER_KEY)
}

function getTokenSavedAt() {
  const savedAt = Number(Taro.getStorageSync(TOKEN_SAVED_AT_KEY) || 0)
  return Number.isFinite(savedAt) ? savedAt : 0
}

export function isAccessTokenFresh() {
  const token = getAccessToken()
  if (!token) {
    return false
  }

  const savedAt = getTokenSavedAt()
  if (!savedAt || Date.now() - savedAt >= ACCESS_TOKEN_MAX_AGE_MS) {
    clearTokens()
    return false
  }

  return true
}

export function hasAccessToken() {
  return isAccessTokenFresh()
}

function redirectToLoginForExpiredSession() {
  if (isRedirectingToLogin) {
    return
  }

  isRedirectingToLogin = true
  Taro.showToast({
    title: '登录已过期，请重新登录',
    icon: 'none',
    duration: 1500,
  })
  Taro.reLaunch({
    url: '/pages/login/index',
    complete() {
      setTimeout(() => {
        isRedirectingToLogin = false
      }, 300)
    },
  })
}

function getResponseMessage(body: unknown, fallback = '请求失败') {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message?: unknown }).message
    if (typeof message === 'string' && message.trim()) {
      return message
    }
  }

  return fallback
}

type ApiResponse<T = unknown> = {
  code: number
  message: string
  data: T
  requestId?: string
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: unknown
  header?: Record<string, string>
  auth?: boolean
}

export async function request<T = unknown>(url: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', data, header = {}, auth = true } = options

  if (auth) {
    if (!isAccessTokenFresh()) {
      redirectToLoginForExpiredSession()
      throw new Error('登录已过期，请重新登录')
    }

    const token = getAccessToken()
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }
  }

  header['Content-Type'] = header['Content-Type'] || 'application/json'

  const res = await Taro.request({
    url: `${BASE_URL}${url}`,
    method,
    data,
    header,
  })

  const body = res.data as Partial<ApiResponse<T>> | undefined
  const statusCode = res.statusCode || 200

  if (statusCode < 200 || statusCode >= 300) {
    if (auth && (statusCode === 401 || statusCode === 403)) {
      clearTokens()
      redirectToLoginForExpiredSession()
      throw new Error('登录已过期，请重新登录')
    }

    throw new Error(getResponseMessage(body, `请求失败(${statusCode})`))
  }

  if (!body || typeof body.code !== 'number') {
    throw new Error('服务响应异常')
  }

  if (body.code !== 0) {
    if (body.code === 40100 && auth) {
      clearTokens()
      redirectToLoginForExpiredSession()
    }
    throw new Error(getResponseMessage(body))
  }

  return body.data as T
}
