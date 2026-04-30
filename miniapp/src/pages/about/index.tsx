import { Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'

import iconBack from '../login/icon-back.svg'
import iconTeam from '../profile/icon-setting-user.svg'
import iconMessage from '../profile/icon-setting-message.svg'
import iconInfo from '../profile/icon-setting-info.svg'
import iconHelp from '../profile/icon-setting-help.svg'
import iconChevron from '../home/chevron-right-muted.svg'
import './index.scss'

const ABOUT_LOGO = 'https://image.opxqo.cn/leafone_logo.webp'
const ABOUT_BG = 'https://image.opxqo.cn/login/top.webp'

const ABOUT_ROWS = [
  { label: '版本信息', value: '2.3.0', icon: iconInfo },
  { label: '开发团队', value: '城院圈产品团队', icon: iconTeam },
  { label: '官方邮箱', value: 'service@leafone.cn', icon: iconMessage },
  { label: '用户协议', value: '', icon: iconHelp },
  { label: '隐私政策', value: '', icon: iconInfo },
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

export default function AboutPage() {
  const handleRowClick = (label: string) => {
    Taro.showToast({
      title: `${label}暂未开放`,
      icon: 'none',
    })
  }

  return (
    <MobileShell showBottomNav={false} className='about-shell'>
      <View className='about-page'>
        <View className='about-header'>
          <View className='about-back' onClick={backToProfile}>
            <Image className='about-back-icon' src={iconBack} mode='aspectFit' />
          </View>
          <Text className='about-title'>关于我们</Text>
        </View>

        <View className='about-brand'>
          <Image className='about-logo' src={ABOUT_LOGO} mode='aspectFit' />
          <View className='about-brand-copy'>
            <Text className='about-brand-name'>城院圈</Text>
            <Text className='about-brand-subtitle'>武汉城市学院论坛</Text>
          </View>
        </View>

        <Text className='about-version'>版本 2.3.0</Text>
        <Text className='about-desc'>
          城院圈是武汉城市学院官方论坛社区，连接校园生活，分享成长点滴，构建智慧、绿色、温暖的校园生态圈。
        </Text>

        <View className='about-info-card'>
          {ABOUT_ROWS.map((item) => (
            <View key={item.label} className='about-info-row' onClick={() => handleRowClick(item.label)}>
              <Image className='about-row-icon' src={item.icon} mode='aspectFit' />
              <Text className='about-row-label'>{item.label}</Text>
              <Text className='about-row-value'>{item.value}</Text>
              <Image className='about-row-chevron' src={iconChevron} mode='aspectFit' />
            </View>
          ))}
        </View>

        <View className='about-bg-layer'>
          <Image className='about-bg-image' src={ABOUT_BG} mode='scaleToFill' />
          <View className='about-bg-fade' />
        </View>
      </View>
    </MobileShell>
  )
}
