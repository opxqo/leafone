type AppEnvKey = 'TARO_APP_API_BASE_URL' | 'TARO_APP_BASE_URL' | 'TARO_APP_API_MODE' | 'TARO_APP_MOCK_DELAY'

function getRuntimeEnv() {
  if (typeof process === 'undefined' || !process.env) {
    return {} as Record<string, string | undefined>
  }

  return process.env as Record<string, string | undefined>
}

export function getAppEnv(key: AppEnvKey, fallback = '') {
  return getRuntimeEnv()[key] || fallback
}
