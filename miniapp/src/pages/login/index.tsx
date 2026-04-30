import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { loginWithPassword, loginWithWechat } from '../../services'

import iconEyeOff from './icon-eye-off.svg'
import iconLock from './icon-lock.svg'
import iconShield from './icon-shield.svg'
import iconUser from './icon-user.svg'
import iconWechat from './icon-wechat.svg'
import './index.scss'

const AUTH_BG = 'https://image.opxqo.cn/login/top.webp'
const AUTH_LOGO = 'https://image.opxqo.cn/leafone_logo.webp'

function goHome() {
  Taro.redirectTo({
    url: '/pages/home/index',
  })
}

function getLoginAccountPayload(account: string) {
  if (/^1\d{10}$/.test(account)) {
    return { phone: account }
  }

  return { studentNo: account }
}

function showError(error: unknown, fallback: string) {
  const message = error instanceof Error && error.message ? error.message : fallback
  Taro.showToast({
    title: message,
    icon: 'none',
  })
}

function maskToken(token: string) {
  if (!token) {
    return ''
  }

  if (token.length <= 16) {
    return `${token.slice(0, 4)}...`
  }

  return `${token.slice(0, 8)}...${token.slice(-6)}`
}

function logAuthResult(source: string, auth: Awaited<ReturnType<typeof loginWithWechat>>) {
  console.info(`[LeafOne Auth] ${source} 登录成功`, {
    userId: auth.userId,
    role: auth.role,
    newUser: auth.newUser ?? false,
    needBindStudent: auth.needBindStudent ?? false,
    studentVerified: auth.studentVerified ?? false,
    accessToken: maskToken(auth.accessToken),
    refreshToken: maskToken(auth.refreshToken),
  })
}

export default function LoginPage() {
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isWechatSubmitting, setIsWechatSubmitting] = useState(false)

  const handlePasswordLogin = async () => {
    const normalizedAccount = account.trim()
    const normalizedPassword = password.trim()

    if (!normalizedAccount || !normalizedPassword) {
      Taro.showToast({
        title: '请输入学号/手机号和密码',
        icon: 'none',
      })
      return
    }

    if (isPasswordSubmitting) {
      return
    }

    setIsPasswordSubmitting(true)
    try {
      const auth = await loginWithPassword({
        ...getLoginAccountPayload(normalizedAccount),
        password: normalizedPassword,
      })
      logAuthResult('账号密码', auth)
      Taro.showToast({
        title: '登录成功',
        icon: 'success',
      })
      goHome()
    } catch (error) {
      showError(error, '登录失败，请稍后重试')
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  const handleWechatLogin = async () => {
    if (isWechatSubmitting) {
      return
    }

    setIsWechatSubmitting(true)
    try {
      const loginResult = await Taro.login({
        timeout: 10000,
      })
      if (!loginResult.code) {
        throw new Error('微信登录凭证获取失败')
      }

      const auth = await loginWithWechat(loginResult.code)
      logAuthResult('微信', auth)
      Taro.showToast({
        title: auth.newUser ? '注册成功' : '微信登录成功',
        icon: 'success',
      })
      goHome()
    } catch (error) {
      showError(error, '微信登录失败，请稍后重试')
    } finally {
      setIsWechatSubmitting(false)
    }
  }

  const handleRegister = () => {
    Taro.redirectTo({
      url: '/pages/register/index',
    })
  }

  const handleCampusAuth = () => {
    Taro.showToast({
      title: '校园统一认证暂未开放',
      icon: 'none',
    })
  }

  return (
    <MobileShell showBottomNav={false} className='auth-shell login-shell' requireAuth={false}>
      <View className='auth-page auth-login-page'>
        <CachedImage className='auth-bg-image auth-login-bg' src={AUTH_BG} mode='aspectFill' />
        <View className='auth-bg-fade' />

        <View className='auth-brand login-brand'>
          <CachedImage className='auth-logo' src={AUTH_LOGO} mode='aspectFit' />
          <View className='auth-brand-copy'>
            <Text className='auth-brand-title'>城院圈</Text>
            <Text className='auth-brand-subtitle'>武汉城市学院论坛</Text>
          </View>
        </View>

        <View className='auth-card login-card'>
          <Text className='auth-card-title'>欢迎回来</Text>
          <Text className='auth-card-desc'>登录城院圈，发现校园新鲜事</Text>

          <View className='auth-field'>
            <Image className='auth-field-icon' src={iconUser} mode='aspectFit' />
            <Input
              className='auth-field-input'
              value={account}
              placeholder='学号 / 手机号'
              placeholderClass='auth-input-placeholder'
              onInput={(event) => {
                setAccount(String(event.detail.value))
                return event.detail.value
              }}
            />
          </View>

          <View className='auth-field'>
            <Image className='auth-field-icon' src={iconLock} mode='aspectFit' />
            <Input
              className='auth-field-input'
              value={password}
              password
              placeholder='密码'
              placeholderClass='auth-input-placeholder'
              onInput={(event) => {
                setPassword(String(event.detail.value))
                return event.detail.value
              }}
            />
            <Image className='auth-field-extra-icon' src={iconEyeOff} mode='aspectFit' />
          </View>

          <View className='auth-option-row'>
            <View className='auth-remember'>
              <View className='auth-check active'>
                <Text>✓</Text>
              </View>
              <Text>记住登录</Text>
            </View>
            <Text className='auth-link-text'>忘记密码？</Text>
          </View>

          <View
            className={`auth-primary-btn${isPasswordSubmitting ? ' is-loading' : ''}`}
            hoverClass='auth-primary-btn--press'
            hoverStartTime={0}
            hoverStayTime={120}
            onClick={handlePasswordLogin}
          >
            <Text>{isPasswordSubmitting ? '登录中...' : '登录'}</Text>
          </View>

          <View
            className='auth-outline-btn'
            hoverClass='auth-outline-btn--press'
            hoverStartTime={0}
            hoverStayTime={120}
            onClick={handleRegister}
          >
            <Text>去注册</Text>
          </View>

          <View className='auth-divider'>
            <View />
            <Text>或使用以下方式登录</Text>
            <View />
          </View>

          <View className='auth-social-row'>
            <View
              className={`auth-social-item auth-social-button${isWechatSubmitting ? ' is-loading' : ''}`}
              hoverClass='auth-social-item--press'
              hoverStartTime={0}
              hoverStayTime={120}
              onClick={handleWechatLogin}
            >
              <View className='auth-social-icon-wrap'>
                <Image className='auth-social-icon' src={iconWechat} mode='aspectFit' />
              </View>
              <Text>{isWechatSubmitting ? '登录中' : '微信登录'}</Text>
            </View>
            <View className='auth-social-item' onClick={handleCampusAuth}>
              <View className='auth-social-icon-wrap'>
                <Image className='auth-social-icon' src={iconShield} mode='aspectFit' />
              </View>
              <Text>校园统一认证</Text>
            </View>
          </View>
        </View>

        <View className='auth-footer'>
          <Text>武汉城市学院论坛 · 城院圈</Text>
          <Text>© 2024 Wuhan City College</Text>
        </View>
      </View>
    </MobileShell>
  )
}
