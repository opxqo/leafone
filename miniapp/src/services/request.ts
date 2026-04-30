import Taro from '@tarojs/taro'
import { getAppEnv } from './env'

const BASE_URL = getAppEnv('TARO_APP_API_BASE_URL', getAppEnv('TARO_APP_BASE_URL', 'https://api.opxqo.cn/api/v1'))

const TOKEN_KEY = 'leafone_access_token'
const REFRESH_TOKEN_KEY = 'leafone_refresh_token'

export function getAccessToken(): string | null {
  return Taro.getStorageSync(TOKEN_KEY) || null
}

export function getRefreshToken(): string | null {
  return Taro.getStorageSync(REFRESH_TOKEN_KEY) || null
}

export function setTokens(accessToken: string, refreshToken: string) {
  Taro.setStorageSync(TOKEN_KEY, accessToken)
  Taro.setStorageSync(REFRESH_TOKEN_KEY, refreshToken)
}

export function clearTokens() {
  Taro.removeStorageSync(TOKEN_KEY)
  Taro.removeStorageSync(REFRESH_TOKEN_KEY)
}

export function hasAccessToken() {
  return Boolean(getAccessToken())
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

  const body = res.data as ApiResponse<T>

  if (body.code !== 0) {
    if (body.code === 40100) {
      clearTokens()
      Taro.redirectTo({ url: '/pages/login/index' })
    }
    throw new Error(body.message || '请求失败')
  }

  return body.data
}
