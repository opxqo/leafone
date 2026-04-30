import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import MobileShell from '../../components/mobile-shell'
import { registerStudent } from '../../services'

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

type RegisterForm = {
  realName: string
  studentNo: string
  college: string
  major: string
  grade: string
  phone: string
  password: string
}

const INITIAL_FORM: RegisterForm = {
  realName: '',
  studentNo: '',
  college: '',
  major: '',
  grade: '',
  phone: '',
  password: '',
}

function showError(error: unknown, fallback: string) {
  const message = error instanceof Error && error.message ? error.message : fallback
  Taro.showToast({
    title: message,
    icon: 'none',
  })
}

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM)
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleBackToLogin = () => {
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  const updateField = (field: keyof RegisterForm) => (event) => {
    const value = String(event.detail.value)
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    return event.detail.value
  }

  const handleSubmit = async () => {
    const payload = {
      realName: form.realName.trim(),
      studentNo: form.studentNo.trim(),
      college: form.college.trim(),
      major: form.major.trim(),
      grade: form.grade.trim(),
      phone: form.phone.trim(),
      password: form.password.trim(),
    }

    if (!payload.realName || !payload.studentNo || !payload.college || !payload.major || !payload.grade) {
      Taro.showToast({
        title: '请完善学生信息',
        icon: 'none',
      })
      return
    }

    if (!payload.password) {
      Taro.showToast({
        title: '请设置登录密码',
        icon: 'none',
      })
      return
    }

    if (!agreed) {
      Taro.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none',
      })
      return
    }

    if (submitting) {
      return
    }

    setSubmitting(true)
    try {
      await registerStudent({
        ...payload,
        phone: payload.phone || undefined,
      })
      Taro.showToast({
        title: '注册提交成功',
        icon: 'success',
      })
      handleBackToLogin()
    } catch (error) {
      showError(error, '注册失败，请稍后重试')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileShell showBottomNav={false} className='auth-shell register-shell' requireAuth={false}>
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
          <Text className='auth-card-desc'>提交学生信息，完成校园身份建档</Text>

          <View className='register-field-list'>
            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconUser} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.realName}
                placeholder='真实姓名'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('realName')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconIdCard} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.studentNo}
                placeholder='学号'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('studentNo')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconCollege} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.college}
                placeholder='学院'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('college')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconCollege} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.major}
                placeholder='专业'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('major')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconCode} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.grade}
                type='number'
                placeholder='入学年份'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('grade')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconPhone} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.phone}
                type='number'
                placeholder='手机号（选填）'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('phone')}
              />
            </View>

            <View className='auth-field register-field'>
              <Image className='auth-field-icon' src={iconLock} mode='aspectFit' />
              <Input
                className='auth-field-input'
                value={form.password}
                password
                placeholder='设置密码'
                placeholderClass='auth-input-placeholder'
                onInput={updateField('password')}
              />
              <Image className='auth-field-extra-icon' src={iconEyeOff} mode='aspectFit' />
            </View>
          </View>

          <View className='register-agree-row' onClick={() => setAgreed((current) => !current)}>
            <View className={`auth-check${agreed ? ' active' : ''}`}>
              {agreed ? <Text>✓</Text> : null}
            </View>
            <Text>
              我已阅读并同意
              <Text className='register-link'>《用户协议》</Text>
              <Text className='register-link'>《隐私政策》</Text>
            </Text>
          </View>

          <View
            className={`auth-primary-btn register-submit-btn${submitting ? ' is-loading' : ''}`}
            hoverClass='auth-primary-btn--press'
            hoverStartTime={0}
            hoverStayTime={120}
            onClick={handleSubmit}
          >
            <Text>{submitting ? '提交中...' : '注册并提交'}</Text>
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
