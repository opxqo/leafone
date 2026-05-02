import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Search, Plus, Bell } from 'lucide-react'

type TopBarProps = {
  sidebarCollapsed: boolean
}

export default function TopBar({ sidebarCollapsed }: TopBarProps) {
  const navigate = useNavigate()

  return (
    <header
      className="fixed top-0 right-0 z-90 flex h-14 items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl transition-[left] duration-200"
      style={{ left: sidebarCollapsed ? '4rem' : '15rem' }}
    >
      {/* Search */}
      <div className="max-w-md flex-1">
        <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3.5 py-1.5 transition-colors focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <Input
            className="h-auto border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
            placeholder="搜索帖子、话题、用户..."
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" title="发帖" onClick={() => navigate('/editor')}>
          <Plus className="size-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          title="消息"
          onClick={() => navigate('/messages')}
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive ring-2 ring-background" />
        </Button>

        <button
          className="ml-1 flex items-center justify-center rounded-full p-0.5 transition-transform hover:scale-110 active:scale-95"
          onClick={() => navigate('/profile')}
          title="个人中心"
        >
          <Avatar size="default">
            <AvatarImage src="https://image.opxqo.cn/avatar/eg/001.webp" alt="头像" />
          </Avatar>
        </button>
      </div>
    </header>
  )
}
