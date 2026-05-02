import { useNavigate } from 'react-router-dom'
import { useAsyncData } from '@/hooks/use-async-data'
import { getProfileData, type ProfileData } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { CheckCircle, ChevronRight, LogOut } from 'lucide-react'
import profilePowerChart from '@/assets/profile-power-chart.svg'
import profileServiceCalendar from '@/assets/profile-service-calendar.svg'
import profileServiceBookmark from '@/assets/profile-service-bookmark.svg'
import profileServiceBriefcase from '@/assets/profile-service-briefcase.svg'
import profileServiceClipboard from '@/assets/profile-service-clipboard.svg'
import profileServiceBook from '@/assets/profile-service-book.svg'
import profileServiceMore from '@/assets/profile-service-more.svg'
import profileSettingUser from '@/assets/profile-setting-user.svg'
import profileSettingHelp from '@/assets/profile-setting-help.svg'
import profileSettingMessage from '@/assets/profile-setting-message.svg'
import profileSettingInfo from '@/assets/profile-setting-info.svg'
import { cn } from '@/lib/utils'

const serviceItems = [
  { title: '个人信息', icon: profileSettingUser, tone: 'green' },
  { title: '课程表', icon: profileServiceCalendar, tone: 'blue' },
  { title: '我的收藏', icon: profileServiceBookmark, tone: 'orange' },
  { title: '问卷调查', icon: profileServiceClipboard, tone: 'purple' },
  { title: '实习就业', icon: profileServiceBriefcase, tone: 'blue' },
  { title: '意见反馈', icon: profileSettingMessage, tone: 'orange' },
  { title: '帮助中心', icon: profileSettingHelp, tone: 'green' },
  { title: '关于我们', icon: profileSettingInfo, tone: 'purple' },
  { title: '图书借阅', icon: profileServiceBook, tone: 'blue' },
  { title: '更多服务', icon: profileServiceMore, tone: 'gray' },
]

const powerStats = [
  { label: '昨日用电', value: '3.2', unit: 'kWh' },
  { label: '日均用电', value: '2.7', unit: 'kWh' },
  { label: '本月用电', value: '128.5', unit: 'kWh' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const data = useAsyncData<ProfileData>(getProfileData, [], null, 'profile')

  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-6">
      {/* User Card */}
      <Card className="flex-row items-center gap-4.5 p-6">
        <Avatar size="lg" className="size-18">
          <AvatarImage src={data?.avatar ?? 'https://image.opxqo.cn/avatar/eg/001.webp'} alt={data?.name} />
        </Avatar>
        <div className="flex-1">
          <div className="mb-1.5 flex items-center gap-2.5">
            <h2 className="text-xl font-extrabold text-foreground">{data?.name ?? '用户'}</h2>
            <Badge variant="secondary" className="gap-1 text-xs">
              <CheckCircle className="size-3" /> 已认证
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{data?.identity ?? ''}</p>
          <p className="text-xs text-muted-foreground">{data?.studentId ?? ''}</p>
        </div>
      </Card>

      {/* Power Card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#35b866] to-[#67d978] p-5 text-white shadow-[0_8px_24px_rgba(39,164,83,0.28)]">
        <div className="mb-3.5 flex items-center justify-between">
          <h3 className="text-base font-bold">宿舍用电</h3>
          <span className="text-sm opacity-85">余额: <strong className="text-lg font-extrabold">¥{data?.balance ?? '0'}</strong></span>
        </div>
        <div className="mb-3.5 overflow-hidden rounded-lg bg-white/15 p-3">
          <img className="w-full opacity-90" src={profilePowerChart} alt="用电趋势" />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {powerStats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-extrabold leading-tight">{stat.value}</span>
              <span className="text-[11px] opacity-70">{stat.unit}</span>
              <span className="text-xs opacity-75">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services */}
      <h3 className="text-base font-extrabold text-foreground">校园服务</h3>
      <div className="grid grid-cols-5 gap-3">
        {serviceItems.map((item) => (
          <Card
            key={item.title}
            className="group cursor-pointer items-center gap-2 p-4 text-center transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
          >
            <div className={cn(
              'flex size-10 items-center justify-center rounded-xl',
              item.tone === 'green' && 'bg-primary/10',
              item.tone === 'blue' && 'bg-blue/10',
              item.tone === 'orange' && 'bg-orange/10',
              item.tone === 'purple' && 'bg-purple/10',
              item.tone === 'gray' && 'bg-muted',
            )}>
              <img className="size-5" src={item.icon} alt={item.title} />
            </div>
            <span className="text-xs font-semibold text-card-foreground">{item.title}</span>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <h3 className="text-base font-extrabold text-foreground">设置</h3>
      <div className="flex flex-col gap-2">
        {(data?.settings ?? []).map((setting) => (
          <Card key={setting} className="cursor-pointer flex-row items-center justify-between p-3.5 transition-colors hover:bg-primary/5">
            <span className="text-sm font-semibold text-card-foreground">{setting}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </Card>
        ))}
      </div>

      {/* Logout */}
      <Button
        variant="outline"
        className="w-full gap-2 rounded-xl border-destructive/20 py-3.5 text-destructive hover:bg-destructive/5"
        onClick={() => navigate('/login')}
      >
        <LogOut className="size-4" /> 退出登录
      </Button>
    </div>
  )
}
