import { memo, useCallback, useState } from 'react'
import { Text, View, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import type { BottomNavKey } from '../../services/types'

import iconHomeSvg from './icon-home.svg'
import iconForumSvg from './icon-forum.svg'
import iconMessagesSvg from './icon-messages.svg'
import iconUserSvg from './icon-user.svg'
import iconPlusSvg from './icon-plus.svg'
import './index.scss'

type NavVisual = 'home' | 'forum' | 'messages' | 'profile'

type SideNavItem = {
  key: BottomNavKey
  label: string
  path: string
  icon: NavVisual
}

const SIDE_NAV_ITEMS: SideNavItem[] = [
  { key: 'home', label: '首页', path: '/pages/home/index', icon: 'home' },
  { key: 'forum', label: '论坛', path: '/pages/forum/index', icon: 'forum' },
  { key: 'messages', label: '消息', path: '/pages/messages/index', icon: 'messages' },
  { key: 'profile', label: '我的', path: '/pages/profile/index', icon: 'profile' },
]

const LEFT_NAV_ITEMS = SIDE_NAV_ITEMS.slice(0, 2)
const RIGHT_NAV_ITEMS = SIDE_NAV_ITEMS.slice(2)

const NAV_ICON_MAP: Record<NavVisual, string> = {
  home: iconHomeSvg,
  forum: iconForumSvg,
  messages: iconMessagesSvg,
  profile: iconUserSvg,
}

type BottomNavProps = {
  active?: BottomNavKey
}

function normalizeActive(active?: BottomNavKey): BottomNavKey | undefined {
  if (active === 'discover') {
    return 'forum'
  }
  return active
}

const NavIcon = memo(function NavIcon({ type, active }: { type: NavVisual; active: boolean }) {
  return (
    <View className='nav-icon'>
      <Image
        className={active ? 'nav-icon-img active' : 'nav-icon-img'}
        src={NAV_ICON_MAP[type]}
        mode='aspectFit'
      />
    </View>
  )
})

function BottomNav({ active }: BottomNavProps) {
  const activeKey = normalizeActive(active)
  const [pressed, setPressed] = useState(false)

  const jump = useCallback((key: BottomNavKey, path: string) => {
    if (activeKey === key) {
      return
    }

    Taro.redirectTo({
      url: path,
    })
  }, [activeKey])

  return (
    <View className='bottom-nav'>
      <View className='bottom-nav-outer'>
        <View className='bottom-nav-items'>
          {LEFT_NAV_ITEMS.map((item) => {
            const isActive = item.key === activeKey
            return (
              <View
                key={item.key}
                className={isActive ? 'nav-item active' : 'nav-item'}
                onClick={() => jump(item.key, item.path)}
              >
                <NavIcon type={item.icon} active={isActive} />
                <Text className='nav-label'>{item.label}</Text>
              </View>
            )
          })}

          <View
            className='nav-center'
            onTouchStart={() => setPressed(true)}
            onTouchEnd={() => setPressed(false)}
            onTouchCancel={() => setPressed(false)}
          >
            <View className={`nav-center-btn ${pressed ? 'pressed' : ''}`}>
              <Image className={`nav-center-btn-img ${pressed ? 'pressed' : ''}`} src={iconPlusSvg} mode='aspectFit' />
            </View>
            <Text className='nav-center-label'>发布</Text>
          </View>

          {RIGHT_NAV_ITEMS.map((item) => {
            const isActive = item.key === activeKey
            return (
              <View
                key={item.key}
                className={isActive ? 'nav-item active' : 'nav-item'}
                onClick={() => jump(item.key, item.path)}
              >
                <NavIcon type={item.icon} active={isActive} />
                <Text className='nav-label'>{item.label}</Text>
              </View>
            )
          })}
        </View>
      </View>
    </View>
  )
}

export default memo(BottomNav)
