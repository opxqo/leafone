import { useState, type ReactNode } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

type AppShellProps = {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
        <div
          className="min-h-screen transition-[margin-left] duration-200"
          style={{ marginLeft: collapsed ? '4rem' : '15rem' }}
        >
          <TopBar sidebarCollapsed={collapsed} />
          <main className="mx-auto w-full max-w-[1200px] px-6 pt-[calc(3.5rem+1.5rem)] pb-6">
            {children}
          </main>
        </div>
      </div>
    </TooltipProvider>
  )
}
