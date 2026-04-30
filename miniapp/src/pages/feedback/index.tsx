import { Image, Input, Text, Textarea, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import MobileShell from '../../components/mobile-shell'
import { submitFeedback } from '../../services'

import iconBack from '../login/icon-back.svg'
import iconMessage from '../profile/icon-setting-message.svg'
import iconHelp from '../profile/icon-setting-help.svg'
import iconInfo from '../profile/icon-setting-info.svg'
import iconMore from '../profile/icon-service-more.svg'
import iconUser from '../login/icon-user.svg'
import './index.scss'

const FEEDBACK_TYPES = [
  { key: 'feature', label: '功能建议', icon: iconHelp },
  { key: 'bug', label: 'Bug反馈', icon: iconMessage },
  { key: 'experience', label: '体验问题', icon: iconInfo },
  { key: 'other', label: '其他', icon: iconMore },
]

function backToProfile() {
  Taro.navigateBack({
    fail() {
      Taro.redirectTo({
        url: '/pages/profile/index',
      })
    },
  })
}

export default function FeedbackPage() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['feature'])
  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [contact, setContact] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const typeNames = useMemo(
    () => FEEDBACK_TYPES.filter((item) => selectedTypes.includes(item.key)).map((item) => item.label),
    [selectedTypes],
  )

  const toggleType = (key: string) => {
    setSelectedTypes((current) => {
      if (current.includes(key)) {
        return current.length > 1 ? current.filter((item) => item !== key) : current
      }
      return [...current, key]
    })
  }

  const chooseImages = async () => {
    const remaining = 3 - images.length
    if (remaining <= 0) {
      Taro.showToast({ title: '最多上传 3 张', icon: 'none' })
      return
    }

    try {
      const result = await Taro.chooseImage({
        count: remaining,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
      })
      setImages((current) => [...current, ...result.tempFilePaths].slice(0, 3))
    } catch {
      Taro.showToast({ title: '未选择图片', icon: 'none' })
    }
  }

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  const handleSubmit = async () => {
    if (submitting) {
      return
    }

    const normalizedTitle = title.trim()
    const normalizedDetail = detail.trim()

    if (!normalizedTitle || !normalizedDetail) {
      Taro.showToast({ title: '请填写标题和详细描述', icon: 'none' })
      return
    }

    setSubmitting(true)
    try {
      await submitFeedback({
        content: [
          `类型：${typeNames.join('、')}`,
          `标题：${normalizedTitle}`,
          `描述：${normalizedDetail}`,
          images.length ? `图片：${images.length} 张待上传` : '',
        ].filter(Boolean).join('\n'),
        contact: contact.trim() || undefined,
      })
      Taro.showToast({ title: '提交成功', icon: 'success' })
      setTitle('')
      setDetail('')
      setContact('')
      setImages([])
    } catch (error) {
      const message = error instanceof Error && error.message ? error.message : '提交失败，请稍后重试'
      Taro.showToast({ title: message, icon: 'none' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MobileShell showBottomNav={false} className='forum-info-shell feedback-shell'>
      <View className='forum-info-page feedback-page'>
        <View className='forum-info-header'>
          <View className='forum-info-back' onClick={backToProfile}>
            <Image className='forum-info-back-icon' src={iconBack} mode='aspectFit' />
          </View>
          <Text className='forum-info-title'>意见反馈</Text>
        </View>

        <View className='forum-info-leaf' />

        <View className='feedback-hero'>
          <Text className='feedback-hero-title'>感谢你的反馈</Text>
          <Text className='feedback-hero-desc'>你的每一条建议，都将帮助我们做得更好</Text>
        </View>

        <View className='feedback-card'>
          <View className='feedback-section'>
            <Text className='feedback-section-title'>反馈类型</Text>
            <Text className='feedback-section-subtitle'>可多选</Text>
          </View>
          <View className='feedback-type-row'>
            {FEEDBACK_TYPES.map((item) => {
              const selected = selectedTypes.includes(item.key)
              return (
                <View
                  key={item.key}
                  className={selected ? 'feedback-type-chip active' : 'feedback-type-chip'}
                  hoverClass='feedback-type-chip--press'
                  hoverStartTime={0}
                  hoverStayTime={120}
                  onClick={() => toggleType(item.key)}
                >
                  <Image className='feedback-type-icon' src={item.icon} mode='aspectFit' />
                  <Text>{item.label}</Text>
                </View>
              )
            })}
          </View>

          <View className='feedback-form-group'>
            <View className='feedback-label-row'>
              <Text className='feedback-label'>问题标题</Text>
              <Text className='feedback-required'>*</Text>
            </View>
            <View className='feedback-input-wrap'>
              <Input
                className='feedback-input'
                maxlength={30}
                value={title}
                placeholder='请用一句话描述你的反馈'
                placeholderClass='feedback-placeholder'
                onInput={(event) => {
                  setTitle(String(event.detail.value))
                  return event.detail.value
                }}
              />
              <Text className='feedback-count'>{title.length}/30</Text>
            </View>
          </View>

          <View className='feedback-form-group'>
            <View className='feedback-label-row'>
              <Text className='feedback-label'>详细描述</Text>
              <Text className='feedback-required'>*</Text>
            </View>
            <View className='feedback-textarea-wrap'>
              <Textarea
                className='feedback-textarea'
                maxlength={500}
                value={detail}
                placeholder='请详细描述你遇到的问题或建议，便于我们更好地理解和改进...'
                placeholderClass='feedback-placeholder'
                onInput={(event) => {
                  setDetail(String(event.detail.value))
                  return event.detail.value
                }}
              />
              <Text className='feedback-textarea-count'>{detail.length}/500</Text>
            </View>
          </View>

          <View className='feedback-form-group'>
            <Text className='feedback-label'>上传截图 / 图片</Text>
            <View className='feedback-upload-row'>
              {images.map((item, index) => (
                <View key={item} className='feedback-image-wrap' onClick={() => removeImage(index)}>
                  <Image className='feedback-image' src={item} mode='aspectFill' />
                </View>
              ))}
              {images.length < 3 ? (
                <View className='feedback-upload-box' onClick={chooseImages}>
                  <Text className='feedback-upload-camera'>▢</Text>
                  <Text>上传图片</Text>
                  <Text>最多 3 张</Text>
                </View>
              ) : null}
            </View>
          </View>

          <View className='feedback-form-group'>
            <Text className='feedback-label'>联系方式</Text>
            <View className='feedback-contact-wrap'>
              <Image className='feedback-contact-icon' src={iconUser} mode='aspectFit' />
              <Input
                className='feedback-input'
                value={contact}
                placeholder='请输入手机号或邮箱，便于我们联系你'
                placeholderClass='feedback-placeholder'
                onInput={(event) => {
                  setContact(String(event.detail.value))
                  return event.detail.value
                }}
              />
            </View>
          </View>

          <View
            className={submitting ? 'feedback-submit is-loading' : 'feedback-submit'}
            hoverClass='feedback-submit--press'
            hoverStartTime={0}
            hoverStayTime={120}
            onClick={handleSubmit}
          >
            <Text>{submitting ? '提交中...' : '提交反馈'}</Text>
          </View>
        </View>

        <Text className='feedback-privacy'>我们将严格保护你的个人信息</Text>
      </View>
    </MobileShell>
  )
}
