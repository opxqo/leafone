import { useAsyncData } from '@/hooks/use-async-data'
import { getDiscoverCategories, type DiscoverCategory } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const categoryIcons: Record<string, string> = {
  '学习互助': '📚',
  '二手交易': '🔄',
  '食堂点评': '🍜',
  '活动广场': '🎉',
  '校园生活': '🏫',
  '表白墙': '💕',
}

export default function DiscoverPage() {
  const categories = useAsyncData<DiscoverCategory[]>(getDiscoverCategories, [], null, 'discover')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground">发现</h1>
        <p className="mt-1 text-sm text-muted-foreground">探索校园社区的精彩内容</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {(categories ?? []).map((cat) => (
          <Card key={cat.id} className="group cursor-pointer gap-2.5 p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#d8ecdf] to-[#b3d6c0] text-2xl">
              {categoryIcons[cat.title] ?? '📋'}
            </div>
            <h3 className="text-base font-extrabold text-foreground">{cat.title}</h3>
            <p className="text-sm text-muted-foreground">{cat.description}</p>
            <Badge variant="secondary" className="w-fit text-xs">今日 {cat.todayCount} 帖</Badge>
          </Card>
        ))}
      </div>

      <Card className="cursor-pointer border-0 bg-gradient-to-br from-[#3e8057] via-[#2c6947] to-[#60a176] p-7 text-white transition-all hover:-translate-y-0.5 hover:shadow-xl">
        <h3 className="mb-1 text-xl font-extrabold">校园开放日</h3>
        <p className="text-sm text-white/75">相约城院，共赴未来</p>
      </Card>
    </div>
  )
}
