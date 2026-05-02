import { useAsyncData } from '@/hooks/use-async-data'
import { getHomeData, getForumData, type HomeData, type ForumData } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Search, ChevronRight, MessageCircle, Heart, Share2 } from 'lucide-react'
import homeHeroBg from '@/assets/home-hero-bg.jpg'
import headline1Img from '@/assets/headline-1.jpg'
import headline2Img from '@/assets/headline-2.jpg'
import headline3Img from '@/assets/headline-3.jpg'
import openDayBanner from '@/assets/open-day-banner.jpg'
import forumIconLearn from '@/assets/forum-icon-learn.svg'
import forumIconTrade from '@/assets/forum-icon-trade.svg'
import forumIconCanteen from '@/assets/forum-icon-canteen.svg'
import forumIconActivity from '@/assets/forum-icon-activity.svg'
import forumIconCircle from '@/assets/forum-icon-circle.svg'
import forumIconMore from '@/assets/forum-icon-more.svg'

const ICON_MAP: Record<string, string> = {
  'icon-learn': forumIconLearn,
  'icon-trade': forumIconTrade,
  'icon-canteen': forumIconCanteen,
  'icon-activity': forumIconActivity,
  'icon-life': forumIconCircle,
  'icon-confession': forumIconMore,
  'icon-circle': forumIconCircle,
  'icon-more': forumIconMore,
}

const headlineImages = [headline1Img, headline2Img, headline3Img]

const homeHeadlines = [
  { id: 'news-1', title: '武汉城市学院2024届毕业典礼圆满落幕', pinned: true, summary: '愿此去繁花似锦，归来仍是少年', date: '05-18', views: '2.2k浏览' },
  { id: 'news-2', title: '东湖骑行打卡活动火热进行中', summary: '共赴绿色校园，守护东湖之美', date: '05-16', views: '1.8k浏览' },
  { id: 'news-3', title: '学校开展"书香校园"主题活动', summary: '阅读点亮生活，书香润泽心灵', date: '05-15', views: '6.4k浏览' },
]

export default function HomePage() {
  const homeData = useAsyncData<HomeData>(getHomeData, [], null, 'home')
  const forumData = useAsyncData<ForumData>(getForumData, [], null, 'forum')

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl">
        <img className="absolute inset-0 size-full object-cover" src={homeHeroBg} alt="" />
        <div className="absolute inset-0 bg-gradient-to-br from-[rgba(20,79,48,0.82)] to-[rgba(62,128,87,0.5)]" />
        <div className="relative z-10 flex items-center justify-between gap-6 p-8">
          <div>
            <p className="mb-1 text-sm font-medium text-white/75">{homeData?.greeting ?? '你好，欢迎来到'}</p>
            <h1 className="mb-1 text-3xl font-extrabold leading-tight text-white">{homeData?.title ?? '武汉城市学院论坛'}</h1>
            <p className="text-xs font-medium tracking-widest text-white/60">{homeData?.subtitle ?? 'WUHAN CITY COLLEGE'}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/25 bg-white/15 px-4 py-2.5 backdrop-blur-md">
            <Search className="size-4 text-white/70" />
            <input className="w-64 bg-transparent text-sm text-white outline-none placeholder:text-white/50" placeholder="搜索帖子、话题、用户..." />
          </div>
        </div>
      </div>

      {/* Shortcut Grid */}
      <div className="grid grid-cols-4 gap-4">
        {(homeData?.shortcuts ?? []).map((item) => (
          <Card key={item.id} className="group cursor-pointer items-center gap-2.5 p-5 text-center transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10">
              <img className="size-6" src={ICON_MAP[item.icon]} alt={item.title} />
            </div>
            <span className="text-sm font-semibold text-card-foreground">{item.title}</span>
          </Card>
        ))}
      </div>

      {/* Two Column: Headlines + Recent Posts */}
      <div className="grid grid-cols-[1.2fr_1fr] gap-6 items-start">
        {/* Headlines */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground">校园头条</h2>
            <span className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-primary">更多 <ChevronRight className="size-4" /></span>
          </div>
          <div className="flex flex-col gap-3">
            {homeHeadlines.map((item, i) => (
              <Card key={item.id} className="group cursor-pointer flex-row gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="min-w-0 flex-1">
                  <div className="mb-1.5 flex items-center gap-2">
                    <span className="truncate text-sm font-bold text-foreground">{item.title}</span>
                    {item.pinned && <Badge variant="secondary" className="text-[11px]">置顶</Badge>}
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">{item.summary}</p>
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span>{item.date}</span>
                    <span>{item.views}</span>
                  </div>
                </div>
                <img className="h-16 w-20 shrink-0 rounded-lg object-cover" src={headlineImages[i]} alt="" />
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-foreground">最新帖子</h2>
            <span className="flex cursor-pointer items-center gap-1 text-sm text-muted-foreground hover:text-primary">更多 <ChevronRight className="size-4" /></span>
          </div>
          <div className="flex flex-col gap-3">
            {(forumData?.posts ?? []).map((post) => (
              <Card key={post.id} className="group cursor-pointer gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-2.5">
                  <Avatar>
                    <AvatarImage src={post.avatar} alt={post.author} />
                  </Avatar>
                  <span className="text-sm font-bold text-foreground">{post.author}</span>
                  <Badge variant="secondary">{post.badge}</Badge>
                </div>
                <h3 className="text-sm font-extrabold text-foreground">{post.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{post.summary}</p>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Share2 className="size-3.5 opacity-60" />{post.stats.share}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="size-3.5 opacity-60" />{post.stats.comment}</span>
                  <span className="flex items-center gap-1"><Heart className="size-3.5 opacity-60" />{post.stats.like}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <Card className="group relative cursor-pointer overflow-hidden border-0 p-0 transition-all hover:-translate-y-0.5 hover:shadow-xl">
        <img className="absolute inset-0 size-full object-cover" src={openDayBanner} alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,79,48,0.75)] to-[rgba(20,79,48,0.15)]" />
        <div className="relative z-10 p-7">
          <h3 className="mb-1.5 text-xl font-extrabold text-white">{homeData?.bannerTitle ?? '校园开放日'}</h3>
          <p className="text-sm font-medium text-white/75">{homeData?.bannerSubtitle ?? '相约城院，共赴未来'}</p>
        </div>
      </Card>
    </div>
  )
}
