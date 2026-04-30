import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { memo, type PropsWithChildren, useEffect } from 'react'
import type { BottomNavKey } from '../../services/types'
import { hasAccessToken } from '../../services/request'
import BottomNav from '../bottom-nav'

import './index.scss'

type MobileShellProps = PropsWithChildren<{
  activeNav?: BottomNavKey
  showBottomNav?: boolean
  className?: string
  requireAuth?: boolean
}>

function MobileShell({
  activeNav,
  showBottomNav = true,
  className = '',
  requireAuth = true,
  children,
}: MobileShellProps) {
  const shouldRedirectToLogin = requireAuth && !hasAccessToken()

  useEffect(() => {
    if (shouldRedirectToLogin) {
      Taro.redirectTo({
        url: '/pages/login/index',
      })
    }
  }, [shouldRedirectToLogin])

  if (shouldRedirectToLogin) {
    return <View className={`mobile-shell ${className}`.trim()} />
  }

  return (
    <View className={`mobile-shell ${className}`.trim()}>
      <View className='top-safe-area' />

      <View className='mobile-body'>{children}</View>

      {showBottomNav ? <BottomNav active={activeNav} /> : null}
    </View>
  )
}

export default memo(MobileShell)
