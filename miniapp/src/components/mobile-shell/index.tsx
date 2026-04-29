import { View } from '@tarojs/components'
import { memo, type PropsWithChildren } from 'react'
import type { BottomNavKey } from '../../services/types'
import BottomNav from '../bottom-nav'

import './index.scss'

type MobileShellProps = PropsWithChildren<{
  activeNav?: BottomNavKey
  showBottomNav?: boolean
  className?: string
}>

function MobileShell({
  activeNav,
  showBottomNav = true,
  className = '',
  children,
}: MobileShellProps) {
  return (
    <View className={`mobile-shell ${className}`.trim()}>
      <View className='top-safe-area' />

      <View className='mobile-body'>{children}</View>

      {showBottomNav ? <BottomNav active={activeNav} /> : null}
    </View>
  )
}

export default memo(MobileShell)
