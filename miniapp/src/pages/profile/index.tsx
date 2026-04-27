import { Text, View } from '@tarojs/components'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getProfileData, type ProfileData } from '../../services'

import './index.scss'

const PROFILE_SERVICES = [
  '学业成绩',
  '课程表',
  '我的收藏',
  '问卷调查',
  '实习就业',
  '荣誉奖项',
  '助学金',
  '考试安排',
  '图书借阅',
  '更多服务',
]

export default function ProfilePage() {
  const data = useAsyncData<ProfileData>(getProfileData, [])

  if (!data) {
    return (
      <MobileShell activeNav='profile'>
        <View className='loading-state'>页面加载中...</View>
      </MobileShell>
    )
  }

  return (
    <MobileShell activeNav='profile'>
      <View className='profile-head'>
        <View className='avatar' />
        <View className='profile-meta'>
          <Text className='profile-name'>{data.name}</Text>
          <Text className='profile-line'>{data.studentId}</Text>
          <Text className='profile-line'>{data.identity}</Text>
        </View>
      </View>

      <View className='wallet-card'>
        <Text className='wallet-label'>校园卡</Text>
        <Text className='wallet-balance'>￥{data.balance}</Text>
        <View className='wallet-actions'>
          {data.walletActions.map((item) => (
            <View key={item.id} className='wallet-action'>
              <Text>{item.title}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='section-header'>
        <Text className='section-title'>我的服务</Text>
      </View>

      <View className='glass-card service-grid'>
        {PROFILE_SERVICES.map((item) => (
          <View key={item} className='service-item'>
            <View className='service-icon' />
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      <View className='glass-card setting-list'>
        {data.settings.map((item) => (
          <View key={item} className='setting-row'>
            <Text>{item}</Text>
            <Text>{'>'}</Text>
          </View>
        ))}
      </View>

      <View className='logout-btn'>退出登录</View>
    </MobileShell>
  )
}
