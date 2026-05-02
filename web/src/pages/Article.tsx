import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAsyncData } from '@/hooks/use-async-data'
import { getArticleData, type ArticleData } from '@/services'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Share2, MessageCircle, Heart, Star, MapPin, Paperclip } from 'lucide-react'
import articleFilePdf from '@/assets/article-file-pdf.svg'
import articleFileWord from '@/assets/article-file-word.svg'

const fileIconMap: Record<string, string> = { pdf: articleFilePdf, doc: articleFileWord }

export default function ArticlePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const articleId = searchParams.get('id') ?? 'post-1'
  const data = useAsyncData<ArticleData>(() => getArticleData(articleId), [articleId], null, `article-${articleId}`)
  const [liked, setLiked] = useState(false)
  const [starred, setStarred] = useState(false)

  if (!data) {
    return <div className="py-20 text-center text-muted-foreground">加载中...</div>
  }

  return (
    <div className="mx-auto flex max-w-[800px] flex-col gap-6">
      {/* Top Nav */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={() => navigate(-1)}>
          <ArrowLeft className="size-4" /> 返回
        </Button>
        <span className="text-sm text-muted-foreground">论坛 / 文章详情</span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3.5">
        <Avatar size="lg">
          <AvatarImage src="https://image.opxqo.cn/avatar/eg/001.webp" alt={data.author} />
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-base font-extrabold text-foreground">{data.author}</span>
            <Badge variant="secondary">学长</Badge>
          </div>
          <span className="text-sm text-muted-foreground">{data.authorMeta}</span>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">+ 关注</Button>
      </div>

      {/* Title */}
      <h1 className="text-2xl font-black leading-tight text-foreground">{data.title}</h1>

      {/* Content */}
      <div className="text-base leading-relaxed text-foreground">
        <p className="mb-4">{data.intro}</p>
        <ul className="mb-4 list-disc pl-5">
          {data.bulletPoints.map((point, i) => (
            <li key={i} className="mb-1.5">{point}</li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-2 rounded-lg bg-primary/5 px-4 py-3 text-sm">
          <span>网盘链接：</span>
          <a className="break-all text-primary" href={data.link} target="_blank" rel="noreferrer">{data.link}</a>
          <span className="text-muted-foreground">提取码：{data.linkCode}</span>
        </div>
      </div>

      {/* Attachments */}
      {data.attachments.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
            <Paperclip className="size-4" /> 附件 ({data.attachments.length})
          </h3>
          <div className="flex flex-col gap-2.5">
            {data.attachments.map((file) => (
              <Card key={file.id} className="flex-row items-center gap-3.5 bg-gradient-to-br from-[rgba(246,252,248,0.98)] to-[rgba(239,248,243,0.96)] p-4">
                <img className="size-9 shrink-0" src={fileIconMap[file.type]} alt="" />
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">{file.size}</span>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 rounded-full bg-primary/10 hover:bg-primary/20">
                  <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="size-4 opacity-60" /> 武汉城市学院 · 图书馆
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full"><Share2 className="size-4" /> 分享</Button>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-full"><MessageCircle className="size-4" /> 评论 {data.comments.length}</Button>
        <Button
          variant={liked ? 'secondary' : 'outline'}
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={() => setLiked((v) => !v)}
        >
          <Heart className={'size-4 ' + (liked ? 'fill-primary text-primary' : '')} /> 点赞
        </Button>
        <Button
          variant={starred ? 'secondary' : 'outline'}
          size="sm"
          className="gap-1.5 rounded-full"
          onClick={() => setStarred((v) => !v)}
        >
          <Star className={'size-4 ' + (starred ? 'fill-primary text-primary' : '')} /> 收藏
        </Button>
      </div>

      {/* Comments */}
      <div>
        <h3 className="mb-4 text-base font-extrabold text-foreground">全部评论 ({data.comments.length})</h3>
        <div className="mb-5 flex gap-2.5">
          <Input className="rounded-full" placeholder="写下你的评论..." />
          <Button className="shrink-0 rounded-full">发送</Button>
        </div>
        <div className="flex flex-col gap-4">
          {data.comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://image.opxqo.cn/avatar/eg/002.webp" alt={comment.author} />
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2.5">
                  <span className="text-sm font-bold text-foreground">{comment.author}</span>
                  <span className="text-xs text-muted-foreground">{comment.time}</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
