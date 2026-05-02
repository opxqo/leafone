import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getProfileData, logoutLocally, type ProfileData } from '../../services'
import { getAccessToken } from '../../services/request'

import iconLogout from './icon-logout.svg'
import iconPinWhite from './icon-pin-white.svg'
import iconServiceBook from './icon-service-book.svg'
import iconServiceBookmark from './icon-service-bookmark.svg'
import iconServiceBriefcase from './icon-service-briefcase.svg'
import iconServiceCalendar from './icon-service-calendar.svg'
import iconServiceClipboard from './icon-service-clipboard.svg'
import iconServiceMore from './icon-service-more.svg'
import iconSettingHelp from './icon-setting-help.svg'
import iconSettingInfo from './icon-setting-info.svg'
import iconSettingMessage from './icon-setting-message.svg'
import iconSettingUser from './icon-setting-user.svg'
import iconVerify from './icon-verify.svg'
import iconVerifyDenied from './icon-verify-denied.svg'
import powerChart from './profile-power-chart.svg'
import './index.scss'

const PROFILE_AVATAR = 'https://image.opxqo.cn/avatar/eg/001.webp'
const PROFILE_METER_BG = 'https://image.opxqo.cn/user/meter_background.webp'
const PROFILE_CHARGING_ICON = 'https://image.opxqo.cn/user/charging.webp'

const PROFILE_SERVICES = [
  { title: '个人信息', icon: iconSettingUser, tone: 'green' },
  { title: '课程表', icon: iconServiceCalendar, tone: 'blue' },
  { title: '我的收藏', icon: iconServiceBookmark, tone: 'orange' },
  { title: '城院认证', icon: iconServiceClipboard, tone: 'purple', path: '/pages/verification/index' },
  { title: '实习就业', icon: iconServiceBriefcase, tone: 'blue' },
  { title: '意见反馈', icon: iconSettingMessage, tone: 'orange', path: '/pages/feedback/index' },
  { title: '帮助中心', icon: iconSettingHelp, tone: 'green', path: '/pages/help/index' },
  { title: '关于我们', icon: iconSettingInfo, tone: 'purple', path: '/pages/about/index' },
  { title: '图书借阅', icon: iconServiceBook, tone: 'blue' },
  { title: '更多服务', icon: iconServiceMore, tone: 'gray' },
]

const POWER_STATS = [
  { label: '昨日用电', value: '3.2', unit: 'kWh' },
  { label: '日均用电', value: '2.7', unit: 'kWh' },
  { label: '本月用电', value: '128.5', unit: 'kWh' },
]

export default function ProfilePage() {
  const profileCacheKey = `profile:${getAccessToken() || 'guest'}`
  const { data, error, retry } = useAsyncData<ProfileData>(getProfileData, [profileCacheKey], null, profileCacheKey)

  const handleLogout = () => {
    logoutLocally()
    Taro.redirectTo({
      url: '/pages/login/index',
    })
  }

  const handleServiceClick = (path?: string) => {
    if (!path) {
      return
    }

    Taro.navigateTo({
      url: path,
    })
  }

  if (!data) {
    return (
      <MobileShell activeNav='profile' className='profile-shell'>
        <View className='loading-state'>
          {error ? (
            <>
              <Text>{error}</Text>
              <View className='retry-btn' onClick={retry}>
                <Text>点击重试</Text>
              </View>
            </>
          ) : (
            <Text>页面加载中...</Text>
          )}
        </View>
      </MobileShell>
    )
  }

  return (
    <MobileShell activeNav='profile' className='profile-shell'>
      <View className='profile-user-header'>
        <CachedImage className='profile-avatar-img' src={data.avatar || PROFILE_AVATAR} mode='aspectFill' />
        <View className='profile-user-main'>
          <View className='profile-name-row'>
            <Text className='profile-name'>{data.name}</Text>
            <View className={data.verified ? 'profile-verify-pill' : 'profile-verify-pill denied'}>
              <Image className='profile-verify-icon' src={data.verified ? iconVerify : iconVerifyDenied} mode='aspectFit' />
              <Text>{data.verified ? '学生认证' : '未学生认证'}</Text>
            </View>
          </View>
          {data.verified ? <Text className='profile-school-line'>{data.identity}</Text> : null}
        </View>
      </View>

      <View className='profile-power-card'>
        <CachedImage className='profile-power-bg-image' src={PROFILE_METER_BG} mode='aspectFill' />
        <View className='profile-power-overlay' />

        <View className='profile-power-summary'>
          <View className='profile-power-copy'>
            <Text className='profile-power-title'>宿舍用电</Text>
            <View className='profile-room-line'>
              <Image className='profile-room-icon' src={iconPinWhite} mode='aspectFit' />
              <Text>{data.dorm || '桂园6舍 305'}</Text>
            </View>
            <View className='profile-power-value-line'>
              <Text className='profile-power-value'>{data.balance}</Text>
              <Text className='profile-power-unit'>kWh</Text>
            </View>
            <Text className='profile-power-label'>本月用电</Text>
            <Text className='profile-power-estimate'>本月预计: 186.7 kWh</Text>
          </View>

          <CachedImage className='profile-power-meter' src={PROFILE_CHARGING_ICON} mode='aspectFit' />
        </View>

        <View className='profile-chart-panel'>
          <View className='profile-chart-title-row'>
            <Text className='profile-chart-title'>72小时用电趋势</Text>
            <Text className='profile-chart-unit'>(kWh)</Text>
          </View>
          <View className='profile-chart-area'>
            <View className='profile-chart-axis'>
              <Text>3.0</Text>
              <Text>2.0</Text>
              <Text>1.0</Text>
              <Text>0</Text>
            </View>
            <View className='profile-chart-main'>
              <Image className='profile-chart-svg' src={powerChart} mode='scaleToFill' />
              <View className='profile-chart-dates'>
                <Text>05/16 00:00</Text>
                <Text>05/17 00:00</Text>
                <Text>05/18 00:00</Text>
                <Text>05/19 00:00</Text>
              </View>
            </View>
          </View>
          <View className='profile-power-stats'>
            {POWER_STATS.map((item) => (
              <View key={item.label} className='profile-power-stat'>
                <Text className='profile-power-stat-label'>{item.label}</Text>
                <View>
                  <Text className='profile-power-stat-value'>{item.value}</Text>
                  <Text className='profile-power-stat-unit'>{item.unit}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className='profile-panel profile-services-panel'>
        <Text className='profile-panel-title'>我的服务</Text>
        <View className='profile-service-grid'>
          {PROFILE_SERVICES.map((item) => (
            <View
              key={item.title}
              className='profile-service-item'
              hoverClass='profile-service-item--press'
              hoverStartTime={0}
              hoverStayTime={120}
              onClick={() => handleServiceClick(item.path)}
            >
              <View className={`profile-service-icon-wrap ${item.tone}`}>
                <Image className='profile-service-icon' src={item.icon} mode='aspectFit' />
              </View>
              <Text>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View
        className='profile-logout-btn'
        hoverClass='profile-logout-btn--press'
        hoverStartTime={0}
        hoverStayTime={120}
        onClick={handleLogout}
      >
        <Image className='profile-logout-icon' src={iconLogout} mode='aspectFit' />
        <Text>退出登录</Text>
      </View>
    </MobileShell>
  )
}
