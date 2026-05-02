import { Text, View } from '@tarojs/components'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getMessages, type MessageItem } from '../../services'

import { Image } from '@tarojs/components'
import iconActivityReminder from './icon-activity-reminder.svg'
import iconCardMessage from './icon-card-message.svg'
import iconFollow from './icon-follow.svg'
import iconInteraction from './icon-interaction.svg'
import iconLike from './icon-like.svg'
import iconNewFollow from './icon-new-follow.svg'
import iconNotice from './icon-notice.svg'
import iconReceivedLike from './icon-received-like.svg'
import iconReply from './icon-reply.svg'
import iconSchoolNotice from './icon-school-notice.svg'
import iconSystemMessage from './icon-system-message.svg'
import './index.scss'

const MESSAGE_TOP_BG = 'https://image.opxqo.cn/message/top.webp'

const QUICK_MESSAGE_ITEMS = [
  { label: '通知公告', icon: iconNotice, tone: 'notice', unread: 8 },
  { label: '互动消息', icon: iconInteraction, tone: 'interaction', unread: 12 },
  { label: '赞与收藏', icon: iconLike, tone: 'like', unread: 5 },
  { label: '关注动态', icon: iconFollow, tone: 'follow' },
]

const MESSAGE_ICON_MAP: Record<string, { icon: string; tone: string }> = {
  学校通知: { icon: iconSchoolNotice, tone: 'notice' },
  互动回复: { icon: iconReply, tone: 'reply' },
  收到的赞: { icon: iconReceivedLike, tone: 'like' },
  新增关注: { icon: iconNewFollow, tone: 'follow' },
  活动提醒: { icon: iconActivityReminder, tone: 'activity' },
  校园卡消息: { icon: iconCardMessage, tone: 'card' },
  系统消息: { icon: iconSystemMessage, tone: 'system' },
}
const EMPTY_MESSAGES: MessageItem[] = []

export default function MessagesPage() {
  const { data: messages } = useAsyncData<MessageItem[]>(getMessages, [], EMPTY_MESSAGES, 'messages')

  return (
    <MobileShell activeNav='messages' className='message-shell'>
      <View className='message-hero'>
        <CachedImage className='message-bg-image' src={MESSAGE_TOP_BG} mode='widthFix' />
        <View className='message-bg-fade' />

        <View className='message-head'>
          <Text className='message-title'>消息</Text>
          <Text className='message-subtitle'>及时掌握校园最新动态</Text>
        </View>

        <View className='glass-card quick-message-row'>
          {QUICK_MESSAGE_ITEMS.map((item) => (
            <View
              key={item.label}
              className='quick-message-item'
              hoverClass='tap-rebound-active'
              hoverStartTime={0}
              hoverStayTime={120}
            >
              <View className={`quick-icon-wrap ${item.tone}`}>
                <Image className='quick-message-icon' src={item.icon} mode='aspectFit' />
                {item.unread ? <Text className='quick-badge'>{item.unread}</Text> : null}
              </View>
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='section-header message-section-header'>
        <Text className='section-title'>消息列表</Text>
        <View className='message-section-actions'>
          <View
            className='message-section-action'
            hoverClass='tap-rebound-active'
            hoverStartTime={0}
            hoverStayTime={120}
          >
            <Text className='message-action-icon read' />
            <Text>全部已读</Text>
          </View>
          <View
            className='message-section-action'
            hoverClass='tap-rebound-active'
            hoverStartTime={0}
            hoverStayTime={120}
          >
            <Text className='message-action-icon filter' />
            <Text>筛选</Text>
          </View>
        </View>
      </View>

      <View className='message-list'>
        {messages.map((item) => {
          const messageIcon = MESSAGE_ICON_MAP[item.title] ?? MESSAGE_ICON_MAP['学校通知']
          const unreadClassName = item.unread === 1 ? 'unread-dot small' : 'unread-dot'

          return (
            <View
              key={item.id}
              className='message-item'
              hoverClass='message-item--pressing'
              hoverStartTime={0}
              hoverStayTime={120}
            >
              <View className={`message-icon ${messageIcon.tone}`}>
                <Image className='message-icon-image' src={messageIcon.icon} mode='aspectFit' />
              </View>
              <View className='message-main'>
                <Text className='message-item-title'>{item.title}</Text>
                <Text className='message-item-desc'>{item.detail}</Text>
              </View>
              <View className='message-tail'>
                <Text>{item.time}</Text>
                {item.unread ? (
                  <Text className={unreadClassName}>{item.unread > 1 ? item.unread : ''}</Text>
                ) : null}
              </View>
            </View>
          )
        })}
      </View>
    </MobileShell>
  )
}
