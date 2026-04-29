import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'

import iconEyeOff from './icon-eye-off.svg'
import iconLock from './icon-lock.svg'
import iconShield from './icon-shield.svg'
import iconUser from './icon-user.svg'
import iconWechat from './icon-wechat.svg'
import './index.scss'

const AUTH_BG = 'https://image.opxqo.cn/login/top.webp'
const AUTH_LOGO = 'https://image.opxqo.cn/leafone_logo.webp'

export default function LoginPage() {
  const handleLogin = () => {
    Taro.redirectTo({
      url: '/pages/home/index',
    })
  }

  const handleRegister = () => {
    Taro.redirectTo({
      url: '/pages/register/index',
    })
  }

  return (
    <MobileShell showBottomNav={false} className='auth-shell login-shell'>
        <View className='auth-page auth-login-page'>
        <Image className='auth-bg-image auth-login-bg' src={AUTH_BG} mode='aspectFill' />
        <View className='auth-bg-fade' />

        <View className='auth-brand login-brand'>
          <Image className='auth-logo' src={AUTH_LOGO} mode='aspectFit' />
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
            <Input className='auth-field-input' placeholder='学号 / 手机号' placeholderClass='auth-input-placeholder' />
          </View>

          <View className='auth-field'>
            <Image className='auth-field-icon' src={iconLock} mode='aspectFit' />
            <Input className='auth-field-input' password placeholder='密码' placeholderClass='auth-input-placeholder' />
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
            className='auth-primary-btn'
            hoverClass='auth-primary-btn--press'
            hoverStartTime={0}
            hoverStayTime={120}
            onClick={handleLogin}
          >
            <Text>登录</Text>
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
            <View className='auth-social-item'>
              <View className='auth-social-icon-wrap'>
                <Image className='auth-social-icon' src={iconWechat} mode='aspectFit' />
              </View>
              <Text>微信登录</Text>
            </View>
            <View className='auth-social-item'>
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
