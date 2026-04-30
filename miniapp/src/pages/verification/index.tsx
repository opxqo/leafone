import { Image, Input, Picker, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState } from 'react'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { verifyStudent } from '../../services'

import iconBack from '../login/icon-back.svg'
import iconCalendar from '../profile/icon-service-calendar.svg'
import iconCollege from '../login/icon-college.svg'
import iconIdCard from '../login/icon-id-card.svg'
import iconPhone from '../login/icon-phone.svg'
import iconQuestion from './icon-question.svg'
import iconShield from './icon-shield.svg'
import iconUser from '../login/icon-user.svg'
import iconCard from './icon-card.svg'
import iconClose from './icon-close.svg'
import iconCheck from './icon-check.svg'
import './index.scss'

const VERIFY_BG = 'https://image.opxqo.cn/login/top.webp'

const COLLEGES = ['计算机学院', '传媒与艺术设计学院', '经济与管理学院', '城建学部', '机电工程学院']
const MAJORS = ['计算机科学与技术', '软件工程', '数字媒体技术', '网络与新媒体', '视觉传达设计']
const GRADES = ['2026', '2025', '2024', '2023', '2022', '2021', '2020']

type VerifyForm = {
  realName: string
  studentNo: string
  college: string
  major: string
  grade: string
  phone: string
}

const INITIAL_FORM: VerifyForm = {
  realName: '',
  studentNo: '',
  college: '',
  major: '',
  grade: '',
  phone: '',
}

function showToast(title: string) {
  Taro.showToast({
    title,
    icon: 'none',
  })
}

function getPickerLabel(value: string, placeholder: string) {
  return value || placeholder
}

export default function VerificationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [form, setForm] = useState<VerifyForm>(INITIAL_FORM)
  const [studentCardImage, setStudentCardImage] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const updateField = (field: keyof VerifyForm) => (event) => {
    const value = String(event.detail.value)
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
    return event.detail.value
  }

  const handleBack = () => {
    Taro.navigateBack({
      fail() {
        Taro.redirectTo({
          url: '/pages/profile/index',
        })
      },
    })
  }

  const handleExplain = () => {
    Taro.showModal({
      title: '认证说明',
      content: '认证通过后可展示校园身份，并获得发帖、互动、二手交易等校园权益。',
      showCancel: false,
      confirmColor: '#239b56',
    })
  }

  const setPickerValue = (field: keyof VerifyForm, options: string[]) => (event) => {
    const index = Number(event.detail.value)
    setForm((current) => ({
      ...current,
      [field]: options[index] || '',
    }))
  }

  const chooseUploadImage = async () => {
    try {
      const result = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      const path = result.tempFilePaths[0]
      if (!path) {
        return
      }

      setStudentCardImage(path)
    } catch {
      showToast('未选择图片')
    }
  }

  const clearUploadImage = () => {
    setStudentCardImage('')
  }

  const getPayload = () => ({
    realName: form.realName.trim(),
    studentNo: form.studentNo.trim(),
    college: form.college.trim(),
    major: form.major.trim(),
    grade: form.grade.trim(),
    phone: form.phone.trim(),
  })

  const handleNextStep = () => {
    setCurrentStep(2)
  }

  const handleSubmit = async () => {
    if (submitting) {
      return
    }

    const payload = getPayload()

    setSubmitting(true)
    Taro.showLoading({
      title: '提交中',
      mask: true,
    })
    try {
      await verifyStudent({
        realName: payload.realName || '测试用户',
        studentNo: payload.studentNo || 'TEST0001',
        college: payload.college || '测试学院',
        major: payload.major || '测试专业',
        grade: payload.grade || '2024',
      })
      console.info('[LeafOne Verify] 学生认证提交成功', {
        ...payload,
        studentCardImage,
        agreed,
      })
      Taro.showToast({
        title: '提交成功',
        icon: 'success',
      })
      setCurrentStep(3)
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : '提交失败，请稍后重试'
      showToast(message)
    } finally {
      Taro.hideLoading()
      setSubmitting(false)
    }
  }

  return (
    <MobileShell activeNav='profile' className='verification-shell'>
      <View className='verification-page'>
        <CachedImage className='verification-bg-image' src={VERIFY_BG} mode='aspectFill' />
        <View className='verification-bg-fade' />

        <View className='verification-header'>
          <View className='verification-back-btn' onClick={handleBack}>
            <Image className='verification-back-icon' src={iconBack} mode='aspectFit' />
          </View>
          <Text className='verification-title'>学生认证</Text>
          <View className='verification-explain' onClick={handleExplain}>
            <Image className='verification-explain-icon' src={iconQuestion} mode='aspectFit' />
            <Text>认证说明</Text>
          </View>
        </View>

        <View className='verification-hero-card'>
          <View className='verification-shield-wrap'>
            <Image className='verification-shield' src={iconShield} mode='aspectFit' />
          </View>
          <View className='verification-hero-copy'>
            <Text className='verification-hero-title'>完成学生认证，解锁更多校园权益</Text>
            <Text className='verification-hero-desc'>
              认证成功后可展示校园身份、获得发帖权限、提升二手交易信任度、使用宿舍服务等更多功能。
            </Text>
          </View>
        </View>

        <View className={`verification-step-card step-${currentStep}`}>
          <View className='verification-step-item active'>
            <View className='verification-step-dot'>1</View>
            <Text>填写信息</Text>
          </View>
          <View className='verification-step-line active' />
          <View className={currentStep >= 2 ? 'verification-step-item active' : 'verification-step-item'}>
            <View className='verification-step-dot'>2</View>
            <Text>上传材料</Text>
          </View>
          <View className={currentStep >= 3 ? 'verification-step-line active' : 'verification-step-line'} />
          <View className={currentStep >= 3 ? 'verification-step-item active' : 'verification-step-item'}>
            <View className='verification-step-dot'>3</View>
            <Text>提交审核</Text>
          </View>
        </View>

        {currentStep === 1 ? (
          <View className='verification-panel'>
            <View className='verification-panel-head'>
              <View className='verification-panel-title-wrap'>
                <View className='verification-panel-mark' />
                <Text className='verification-panel-title'>基本信息</Text>
              </View>
              <Text className='verification-panel-tip'>请填写真实信息</Text>
            </View>

            <View className='verification-field-list'>
              <View className='verification-field'>
                <Image className='verification-field-icon' src={iconUser} mode='aspectFit' />
                <Text className='verification-field-label'>真实姓名</Text>
                <Input
                  className='verification-field-input'
                  value={form.realName}
                  placeholder='请输入真实姓名'
                  placeholderClass='verification-placeholder'
                  onInput={updateField('realName')}
                />
              </View>

              <View className='verification-field'>
                <Image className='verification-field-icon' src={iconIdCard} mode='aspectFit' />
                <Text className='verification-field-label'>学号</Text>
                <Input
                  className='verification-field-input'
                  value={form.studentNo}
                  placeholder='请输入学号'
                  placeholderClass='verification-placeholder'
                  onInput={updateField('studentNo')}
                />
              </View>

              <Picker mode='selector' range={COLLEGES} onChange={setPickerValue('college', COLLEGES)}>
                <View className='verification-field'>
                  <Image className='verification-field-icon' src={iconCollege} mode='aspectFit' />
                  <Text className='verification-field-label'>学院</Text>
                  <Text className={form.college ? 'verification-picker-value' : 'verification-picker-placeholder'}>
                    {getPickerLabel(form.college, '请选择学院')}
                  </Text>
                  <Text className='verification-chevron'>›</Text>
                </View>
              </Picker>

              <Picker mode='selector' range={MAJORS} onChange={setPickerValue('major', MAJORS)}>
                <View className='verification-field'>
                  <Image className='verification-field-icon' src={iconCollege} mode='aspectFit' />
                  <Text className='verification-field-label'>专业</Text>
                  <Text className={form.major ? 'verification-picker-value' : 'verification-picker-placeholder'}>
                    {getPickerLabel(form.major, '请选择专业')}
                  </Text>
                  <Text className='verification-chevron'>›</Text>
                </View>
              </Picker>

              <Picker mode='selector' range={GRADES} onChange={setPickerValue('grade', GRADES)}>
                <View className='verification-field'>
                  <Image className='verification-field-icon' src={iconCalendar} mode='aspectFit' />
                  <Text className='verification-field-label'>入学年份</Text>
                  <Text className={form.grade ? 'verification-picker-value' : 'verification-picker-placeholder'}>
                    {getPickerLabel(form.grade, '请选择入学年份')}
                  </Text>
                  <Text className='verification-chevron'>›</Text>
                </View>
              </Picker>

              <View className='verification-field'>
                <Image className='verification-field-icon' src={iconPhone} mode='aspectFit' />
                <Text className='verification-field-label'>手机号</Text>
                <Input
                  className='verification-field-input'
                  value={form.phone}
                  type='number'
                  placeholder='请输入手机号'
                  placeholderClass='verification-placeholder'
                  onInput={updateField('phone')}
                />
              </View>
            </View>

            <View
              className='verification-submit-btn verification-next-btn'
              hoverClass='verification-submit-btn--press'
              hoverStartTime={0}
              hoverStayTime={120}
              onClick={handleNextStep}
            >
              <Text>下一步</Text>
            </View>
          </View>
        ) : null}

        {currentStep === 2 ? (
          <View className='verification-panel verification-upload-panel'>
            <View className='verification-panel-head'>
              <View className='verification-panel-title-wrap'>
                <View className='verification-panel-mark' />
                <Text className='verification-panel-title'>上传材料</Text>
              </View>
              <Text className='verification-panel-tip'>请确保证件清晰、信息可见</Text>
            </View>

            <View className='verification-upload-list'>
              <View className='verification-upload-card' onClick={chooseUploadImage}>
                <View className='verification-upload-icon-box'>
                  <Image className='verification-upload-icon' src={iconCard} mode='aspectFit' />
                </View>
                <View className='verification-upload-copy'>
                  <View className='verification-upload-title-row'>
                    <Text className='verification-upload-title'>上传学生证/校园卡</Text>
                    <Text className='verification-required'>选传</Text>
                  </View>
                  <Text className='verification-upload-desc'>支持 JPG / PNG 格式，大小不超过 5MB</Text>
                  <Text className='verification-upload-helper'>测试阶段可不上传，后续用于校内身份审核</Text>
                </View>
                <View className='verification-upload-preview'>
                  {studentCardImage ? (
                    <>
                      <Image className='verification-upload-image' src={studentCardImage} mode='aspectFill' />
                      <View
                        className='verification-upload-clear'
                        onClick={(event) => {
                          event.stopPropagation()
                          clearUploadImage()
                        }}
                      >
                        <Image className='verification-upload-clear-icon' src={iconClose} mode='aspectFit' />
                      </View>
                    </>
                  ) : (
                    <View className='verification-upload-placeholder'>
                      <Text>点击上传</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            <View className='verification-safe-box'>
              <Image className='verification-safe-icon' src={iconShield} mode='aspectFit' />
              <View className='verification-safe-copy'>
                {['仅用于校内身份审核', '信息将加密存储，严格保护你的隐私安全', '一般 1 个工作日内完成审核，结果将通过站内信通知'].map((item) => (
                  <View key={item} className='verification-safe-line'>
                    <Image className='verification-safe-check' src={iconCheck} mode='aspectFit' />
                    <Text>{item}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className='verification-agree-row' onClick={() => setAgreed((current) => !current)}>
              <View className={`verification-check${agreed ? ' active' : ''}`}>{agreed ? <Text>✓</Text> : null}</View>
              <Text>
                我已阅读并同意
                <Text className='verification-link'>《认证协议》</Text>
                <Text className='verification-link'>《隐私政策》</Text>
              </Text>
            </View>

            <View
              className={`verification-submit-btn${submitting ? ' is-loading' : ''}`}
              hoverClass='verification-submit-btn--press'
              hoverStartTime={0}
              hoverStayTime={120}
              onClick={handleSubmit}
            >
              <Text>{submitting ? '提交中...' : '提交认证'}</Text>
            </View>
          </View>
        ) : null}

        {currentStep === 3 ? (
          <View className='verification-panel verification-success-panel'>
            <View className='verification-success-icon-wrap'>
              <Image className='verification-success-icon' src={iconShield} mode='aspectFit' />
            </View>
            <Text className='verification-success-title'>认证提交成功</Text>
            <Text className='verification-success-desc'>
              你的学生认证信息已提交审核，结果将通过站内信通知。测试阶段可先返回个人中心继续体验。
            </Text>
            <View
              className='verification-submit-btn verification-success-btn'
              hoverClass='verification-submit-btn--press'
              hoverStartTime={0}
              hoverStayTime={120}
              onClick={handleBack}
            >
              <Text>返回个人中心</Text>
            </View>
          </View>
        ) : null}
      </View>
    </MobileShell>
  )
}
