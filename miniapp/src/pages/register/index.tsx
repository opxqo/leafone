import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'

import iconBack from '../login/icon-back.svg'
import iconCode from '../login/icon-code.svg'
import iconCollege from '../login/icon-college.svg'
import iconEyeOff from '../login/icon-eye-off.svg'
import iconIdCard from '../login/icon-id-card.svg'
import iconLock from '../login/icon-lock.svg'
import iconPhone from '../login/icon-phone.svg'
import iconUser from '../login/icon-user.svg'
import '../login/index.scss'
import './index.scss'

const AUTH_BG = 'https://image.opxqo.cn/login/top.webp'
const AUTH_LOGO = 'https://image.opxqo.cn/leafone_logo.webp'

const REGISTER_FIELDS = [
  { label: '姓名', icon: iconUser },
  { label: '学号', icon: iconIdCard },
  { label: '学院', icon: iconCollege, extra: '⌄' },
  { label: '手机号', icon: iconPhone },
  { label: '验证码', icon: iconCode, action: '发送验证码' },
  { label: '设置密码', icon: iconLock, extraIcon: iconEyeOff },
]

export default function RegisterPage() {
  const handleBackToLogin = () => {
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  return (
    <MobileShell showBottomNav={false} className='auth-shell register-shell'>
        <View className='auth-page auth-register-page'>
        <Image className='auth-bg-image auth-register-bg' src={AUTH_BG} mode='aspectFill' />
        <View className='auth-bg-fade register-bg-fade' />

        <View className='auth-back-btn' onClick={handleBackToLogin}>
          <Image className='auth-back-icon' src={iconBack} mode='aspectFit' />
        </View>

        <View className='auth-brand register-brand'>
          <Image className='auth-logo' src={AUTH_LOGO} mode='aspectFit' />
          <View className='auth-brand-copy'>
            <Text className='auth-brand-title'>城院圈</Text>
            <Text className='auth-brand-subtitle'>武汉城市学院论坛</Text>
          </View>
        </View>

        <View className='auth-card register-card'>
          <Text className='auth-card-title'>新用户注册</Text>
          <Text className='auth-card-desc'>加入城院圈，连接更多城院人</Text>

          <View className='register-field-list'>
            {REGISTER_FIELDS.map((item) => (
              <View key={item.label} className='auth-field register-field'>
                <Image className='auth-field-icon' src={item.icon} mode='aspectFit' />
                <Text className='auth-field-placeholder'>{item.label}</Text>
                {item.action ? <Text className='auth-field-action'>{item.action}</Text> : null}
                {item.extra ? <Text className='auth-field-select'>{item.extra}</Text> : null}
                {item.extraIcon ? (
                  <Image className='auth-field-extra-icon' src={item.extraIcon} mode='aspectFit' />
                ) : null}
              </View>
            ))}
          </View>

          <View className='register-agree-row'>
            <View className='auth-check' />
            <Text>
              我已阅读并同意
              <Text className='register-link'>《用户协议》</Text>
              <Text className='register-link'>《隐私政策》</Text>
            </Text>
          </View>

          <View
            className='auth-primary-btn register-submit-btn'
            hoverClass='auth-primary-btn--press'
            hoverStartTime={0}
            hoverStayTime={120}
          >
            <Text>注册并进入</Text>
          </View>

          <View className='register-login-tip' onClick={handleBackToLogin}>
            <Text>已有账号？</Text>
            <Text className='register-login-link'>去登录</Text>
          </View>
        </View>
      </View>
    </MobileShell>
  )
}
