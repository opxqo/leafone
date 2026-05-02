import { useAsyncData } from '@/hooks/use-async-data'
import { getMessages, type MessageItem } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, MessageCircle, Heart, UserPlus } from 'lucide-react'
import messageListSchoolNotice from '@/assets/message-list-school-notice.svg'
import messageListReply from '@/assets/message-list-reply.svg'
import messageListLike from '@/assets/message-list-like.svg'
import messageListFollow from '@/assets/message-list-follow.svg'
import messageListActivity from '@/assets/message-list-activity.svg'
import messageListCard from '@/assets/message-list-card.svg'
import messageListSystem from '@/assets/message-list-system.svg'
import { cn } from '@/lib/utils'

const messageHighlights = [
  { label: '通知公告', icon: Bell, tone: 'notice', unread: 8 },
  { label: '互动消息', icon: MessageCircle, tone: 'interaction', unread: 12 },
  { label: '赞与收藏', icon: Heart, tone: 'like', unread: 5 },
  { label: '关注动态', icon: UserPlus, tone: 'follow', unread: 0 },
]

const messageRowIcons: Record<string, string> = {
  '学校通知': messageListSchoolNotice,
  '互动回复': messageListReply,
  '收到的赞': messageListLike,
  '新增关注': messageListFollow,
  '活动提醒': messageListActivity,
  '校园卡消息': messageListCard,
  '系统消息': messageListSystem,
}

export default function MessagesPage() {
  const messages = useAsyncData<MessageItem[]>(getMessages, [], null, 'messages')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-foreground">消息</h1>
        <Button variant="secondary" size="sm" className="rounded-full text-xs">全部已读</Button>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-4 gap-4">
        {messageHighlights.map((item) => (
          <Card
            key={item.label}
            className={cn(
              'group cursor-pointer items-center gap-2.5 p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-md',
            )}
          >
            <div className={cn(
              'relative flex size-11 items-center justify-center rounded-xl',
              item.tone === 'notice' && 'bg-orange/12',
              item.tone === 'interaction' && 'bg-blue/12',
              item.tone === 'like' && 'bg-like/12',
              item.tone === 'follow' && 'bg-purple/12',
            )}>
              <item.icon className="size-5" />
              {item.unread > 0 && (
                <Badge variant="destructive" className="absolute -top-1.5 -right-1.5 size-[18px] justify-center rounded-full p-0 text-[10px]">
                  {item.unread}
                </Badge>
              )}
            </div>
            <span className="text-sm font-semibold text-card-foreground">{item.label}</span>
          </Card>
        ))}
      </div>

      {/* Message List */}
      <div className="flex flex-col gap-2.5">
        {(messages ?? []).map((msg) => (
          <Card
            key={msg.id}
            className="group cursor-pointer flex-row items-center gap-3.5 p-4 transition-all hover:-translate-y-px hover:shadow-md"
          >
            <div className="relative shrink-0">
              <img className="size-11 rounded-full object-cover" src={messageRowIcons[msg.title]} alt="" />
              {msg.unread && msg.unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-destructive ring-2 ring-card" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-bold text-foreground">{msg.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{msg.time}</span>
              </div>
              <p className="truncate text-sm text-muted-foreground">{msg.detail}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
