import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Home,
  MessageCircle,
  Compass,
  Bell,
  User,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
}

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/forum', label: '论坛', icon: MessageCircle },
  { to: '/discover', label: '发现', icon: Compass },
  { to: '/messages', label: '消息', icon: Bell },
  { to: '/profile', label: '个人中心', icon: User },
]

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-100 flex h-screen flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-[2px_0_12px_rgba(55,85,68,0.06)] transition-[width] duration-200',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Header */}
      <div className="flex h-14 shrink-0 items-center border-b border-sidebar-border px-4">
        <div className="flex items-center gap-2.5">
          <span className="text-xl leading-none">🍃</span>
          {!collapsed && (
            <span className="text-lg font-extrabold tracking-tight text-sidebar-foreground">
              城院圈
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2',
                isActive && 'bg-sidebar-accent font-bold text-sidebar-primary'
              )
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="size-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-sidebar-border p-2">
        <Button
          variant="ghost"
          className={cn('w-full justify-start gap-2.5 text-muted-foreground', collapsed && 'justify-center px-2')}
          onClick={onToggle}
          title={collapsed ? '展开' : '收起'}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && <span className="text-xs">收起菜单</span>}
        </Button>
      </div>
    </aside>
  )
}
