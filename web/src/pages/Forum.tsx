import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAsyncData } from '@/hooks/use-async-data'
import { getForumData, type ForumData } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { Plus, ChevronDown, Share2, MessageCircle, Heart, Flame } from 'lucide-react'
import forumIconLearn from '@/assets/forum-icon-learn.svg'
import forumIconTrade from '@/assets/forum-icon-trade.svg'
import forumIconCanteen from '@/assets/forum-icon-canteen.svg'
import forumIconActivity from '@/assets/forum-icon-activity.svg'
import forumIconCircle from '@/assets/forum-icon-circle.svg'
import forumIconMore from '@/assets/forum-icon-more.svg'

const forumModules = [
  { label: '学习互助', icon: forumIconLearn, tone: 'green' },
  { label: '二手交易', icon: forumIconTrade, tone: 'warm' },
  { label: '食堂点评', icon: forumIconCanteen, tone: 'green' },
  { label: '活动广场', icon: forumIconActivity, tone: 'orange' },
  { label: '兴趣圈子', icon: forumIconCircle, tone: 'orange' },
  { label: '全部板块', icon: forumIconMore, tone: 'gray' },
]

const filterTabs = ['最新', '推荐', '关注']

export default function ForumPage() {
  const navigate = useNavigate()
  const data = useAsyncData<ForumData>(getForumData, [], null, 'forum')
  const [activeFilter, setActiveFilter] = useState('最新')

  return (
    <div className="flex flex-col gap-6">
      {/* Module Row */}
      <div className="flex flex-wrap gap-3">
        {forumModules.map((mod) => (
          <button
            key={mod.label}
            className={cn(
              'flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95',
              mod.tone === 'green' && 'hover:border-primary/20 hover:bg-primary/5',
              mod.tone === 'warm' && 'hover:border-orange/20 hover:bg-orange/5',
              mod.tone === 'orange' && 'hover:border-orange/15 hover:bg-orange/5',
            )}
          >
            <img className="size-5" src={mod.icon} alt={mod.label} />
            <span>{mod.label}</span>
          </button>
        ))}
      </div>

      {/* Hot Topics */}
      <div className="flex items-center gap-3 overflow-x-auto rounded-xl border border-border bg-card px-4 py-3">
        <Flame className="size-4 shrink-0 text-orange" />
        <div className="flex gap-2.5">
          {(data?.topics ?? []).map((topic) => (
            <span
              key={topic.id}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/5 px-3.5 py-1.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary/10 cursor-pointer"
            >
              {topic.label}
              <span className="text-xs font-medium text-muted-foreground">{topic.heat}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px] items-start">
        {/* Feed */}
        <div>
          {/* Filter Row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex gap-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    activeFilter === tab
                      ? 'bg-primary/10 text-primary-dark font-bold'
                      : 'text-muted-foreground hover:bg-primary/5 hover:text-foreground'
                  )}
                  onClick={() => setActiveFilter(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="gap-1 rounded-full text-muted-foreground">
              排序 <ChevronDown className="size-3.5" />
            </Button>
          </div>

          {/* Post List */}
          <div className="flex flex-col gap-3">
            {(data?.posts ?? []).map((post) => (
              <Card
                key={post.id}
                className="group cursor-pointer p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg"
                onClick={() => navigate(`/article?id=${post.id}`)}
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                  </Avatar>
                  <div className="flex flex-1 items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{post.author}</span>
                    <Badge variant="secondary">{post.badge}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{post.meta}</span>
                </div>
                <h3 className="mb-1.5 text-base font-extrabold text-foreground">{post.title}</h3>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
                <div className="flex items-center gap-3">
                  {post.module && <Badge variant="secondary">{post.module}</Badge>}
                  {post.price && <span className="text-base font-extrabold text-orange">{post.price}</span>}
                  <div className="ml-auto flex gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Share2 className="size-3.5 opacity-60" />{post.stats.share}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="size-3.5 opacity-60" />{post.stats.comment}</span>
                    <span className="flex items-center gap-1"><Heart className="size-3.5 opacity-60" />{post.stats.like}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sticky top-20 flex flex-col gap-4">
          <Button className="w-full gap-2 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_8px_24px_rgba(33,169,83,0.22)] hover:shadow-[0_12px_28px_rgba(33,169,83,0.3)]" onClick={() => navigate('/editor')}>
            <Plus className="size-4" />
            发帖
          </Button>

          <Card className="p-4">
            <h3 className="mb-3.5 text-sm font-extrabold text-foreground">热门话题</h3>
            <div className="flex flex-col gap-2.5">
              {(data?.topics ?? []).map((topic, i) => (
                <div key={topic.id} className="flex cursor-pointer items-center gap-2.5 py-1.5">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 text-xs font-extrabold text-primary">{i + 1}</span>
                  <span className="flex-1 truncate text-sm font-semibold text-card-foreground">{topic.label}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{topic.heat}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="mb-3.5 text-sm font-extrabold text-foreground">板块推荐</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {forumModules.slice(0, 4).map((mod) => (
                <div key={mod.label} className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary/5 px-2.5 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:bg-primary/10">
                  <img className="size-5" src={mod.icon} alt={mod.label} />
                  <span>{mod.label}</span>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  )
}
