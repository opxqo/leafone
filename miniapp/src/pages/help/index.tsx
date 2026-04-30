import { Image, Input, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import MobileShell from '../../components/mobile-shell'

import iconBack from '../login/icon-back.svg'
import iconUser from '../profile/icon-setting-user.svg'
import iconMessage from '../profile/icon-setting-message.svg'
import iconWallet from '../profile/icon-service-wallet.svg'
import iconHome from '../../components/bottom-nav/icon-home.svg'
import iconShield from '../verification/icon-shield.svg'
import iconHelp from '../profile/icon-setting-help.svg'
import iconSearch from '../home/chevron-right-muted.svg'
import iconFeedback from '../profile/icon-setting-info.svg'
import './index.scss'

const QUICK_ENTRIES = [
  { title: '账号与认证', desc: '实名与资料', icon: iconUser, tone: 'green', path: '/pages/verification/index' },
  { title: '发帖与互动', desc: '发布和评论', icon: iconMessage, tone: 'orange', path: '/pages/forum/index' },
  { title: '二手交易', desc: '交易说明', icon: iconWallet, tone: 'blue' },
  { title: '宿舍服务', desc: '用电与服务', icon: iconHome, tone: 'purple' },
  { title: '隐私安全', desc: '资料保护', icon: iconShield, tone: 'green' },
  { title: '常见问题', desc: '快速解答', icon: iconHelp, tone: 'yellow' },
]

const FAQS = [
  '如何注册城院圈账号？',
  '如何发布帖子或参与讨论？',
  '如何进行二手交易？',
  '如何修改个人资料？',
  '遇到违规内容如何举报？',
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

export default function HelpPage() {
  const [keyword, setKeyword] = useState('')

  const filteredFaqs = useMemo(() => {
    const normalized = keyword.trim()
    if (!normalized) {
      return FAQS
    }
    return FAQS.filter((item) => item.includes(normalized))
  }, [keyword])

  const handleQuickEntry = (item: (typeof QUICK_ENTRIES)[number]) => {
    if (item.path) {
      Taro.navigateTo({ url: item.path })
      return
    }

    Taro.showToast({
      title: `${item.title}说明整理中`,
      icon: 'none',
    })
  }

  const openFaq = (question: string) => {
    Taro.showModal({
      title: question,
      content: '详细帮助内容正在完善中，当前可通过意见反馈告诉我们你的具体问题。',
      showCancel: false,
      confirmColor: '#239b56',
    })
  }

  return (
    <MobileShell showBottomNav={false} className='help-shell'>
      <View className='help-page'>
        <View className='help-header'>
          <View className='help-back' onClick={backToProfile}>
            <Image className='help-back-icon' src={iconBack} mode='aspectFit' />
          </View>
          <Text className='help-title'>帮助中心</Text>
        </View>

        <View className='help-leaf' />

        <View className='help-search'>
          <Text className='help-search-icon'>⌕</Text>
          <Input
            className='help-search-input'
            value={keyword}
            placeholder='搜索帮助内容'
            placeholderClass='help-placeholder'
            onInput={(event) => {
              setKeyword(String(event.detail.value))
              return event.detail.value
            }}
          />
        </View>

        <View className='help-panel'>
          <View className='help-section-title-row'>
            <View className='help-section-mark' />
            <Text className='help-section-title'>快捷入口</Text>
          </View>
          <View className='help-entry-grid'>
            {QUICK_ENTRIES.map((item) => (
              <View
                key={item.title}
                className='help-entry-card'
                hoverClass='help-entry-card--press'
                hoverStartTime={0}
                hoverStayTime={120}
                onClick={() => handleQuickEntry(item)}
              >
                <View className={`help-entry-icon-wrap ${item.tone}`}>
                  <Image className='help-entry-icon' src={item.icon} mode='aspectFit' />
                </View>
                <Text className='help-entry-title'>{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='help-panel help-faq-panel'>
          <View className='help-section-head'>
            <View className='help-section-title-row'>
              <View className='help-section-mark' />
              <Text className='help-section-title'>常见问题</Text>
            </View>
            <Text className='help-more'>查看更多 ›</Text>
          </View>
          <View className='help-faq-list'>
            {filteredFaqs.map((item) => (
              <View key={item} className='help-faq-item' onClick={() => openFaq(item)}>
                <Text>{item}</Text>
                <Image className='help-faq-arrow' src={iconSearch} mode='aspectFit' />
              </View>
            ))}
          </View>
        </View>

        <View className='help-bottom-card'>
          <View className='help-contact-card'>
            <View>
              <Text className='help-contact-title'>联系客服</Text>
              <Text className='help-contact-desc'>在线客服 7x12 小时</Text>
            </View>
            <Image className='help-contact-icon' src={iconHelp} mode='aspectFit' />
          </View>
          <View className='help-contact-card' onClick={() => Taro.navigateTo({ url: '/pages/feedback/index' })}>
            <View>
              <Text className='help-contact-title'>意见反馈入口</Text>
              <Text className='help-contact-desc'>告诉我们你的想法</Text>
            </View>
            <Image className='help-contact-icon' src={iconFeedback} mode='aspectFit' />
          </View>
        </View>
      </View>
    </MobileShell>
  )
}
