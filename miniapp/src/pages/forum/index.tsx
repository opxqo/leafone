import { Image, Input, Navigator, Text, View } from '@tarojs/components'
import { useMemo, useState } from 'react'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getForumData, type ForumData } from '../../services'

import iconLearn from '../home/icon-learn.svg'
import iconTrade from '../home/icon-trade.svg'
import iconCanteen from '../home/icon-canteen.svg'
import iconActivity from '../home/icon-activity.svg'
import iconCircle from '../home/icon-circle.svg'
import iconMore from '../home/icon-more.svg'
import bikeThumb from '../home/headline-2.jpg'
import chevronRightMuted from '../home/chevron-right-muted.svg'
import iconBadgePin from './icon-badge-pin.svg'
import iconFlameBold from './icon-flame-bold.svg'
import iconStatComment from './icon-stat-comment.svg'
import iconStatLike from './icon-stat-like.svg'
import iconStatShare from './icon-stat-share.svg'
import './index.scss'

const FORUM_HERO_BG = 'https://image.opxqo.cn/forum/top.webp'

const FORUM_MODULES = [
  { id: 'learn', label: '学习互助', icon: iconLearn, tone: 'green' },
  { id: 'trade', label: '二手交易', icon: iconTrade, tone: 'warm' },
  { id: 'canteen', label: '食堂点评', icon: iconCanteen, tone: 'green' },
  { id: 'activity', label: '活动广场', icon: iconActivity, tone: 'orange' },
  { id: 'circle', label: '兴趣圈子', icon: iconCircle, tone: 'orange' },
  { id: 'more', label: '全部板块', icon: iconMore, tone: 'gray' },
]

const FEED_TABS = ['最新', '推荐', '关注']

function matchKeyword(field: string, keyword: string) {
  return field.toLowerCase().includes(keyword)
}

export default function ForumPage() {
  const data = useAsyncData<ForumData>(getForumData, [], null, 'forum')
  const [searchValue, setSearchValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')

  const visiblePosts = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase()

    if (!data?.posts || !keyword) {
      return data?.posts ?? []
    }

    return data.posts.filter((post) =>
      [
        post.author,
        post.badge,
        post.meta,
        post.title,
        post.summary,
        post.module,
        post.price ?? '',
      ].some((field) => matchKeyword(field, keyword)),
    )
  }, [data?.posts, searchKeyword])

  const handleSearchSubmit = () => {
    setSearchKeyword(searchValue.trim())
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setSearchKeyword('')
  }

  return (
    <MobileShell activeNav='forum' className='forum-shell'>
      <View className='forum-hero'>
        <Image className='forum-bg-image' src={FORUM_HERO_BG} mode='aspectFill' />
        <View className='forum-hero-fade' />

        <View className='forum-head'>
          <View className='forum-copy'>
            <Text className='forum-title'>校园论坛</Text>
            <Text className='forum-subtitle'>连接你我，分享校园生活</Text>
          </View>
        </View>

        <View className={`forum-search-box${searchKeyword ? ' is-searching' : ''}`}>
          <View className='forum-search-line-icon' onClick={handleSearchSubmit} />
          <Input
            className='forum-search-input'
            value={searchValue}
            placeholder='搜索帖子、话题、用户...'
            placeholderClass='forum-search-placeholder'
            confirmType='search'
            onInput={(event) => {
              setSearchValue(String(event.detail.value))
              return event.detail.value
            }}
            onConfirm={handleSearchSubmit}
          />
          {searchValue || searchKeyword ? (
            <View className='forum-search-clear' onClick={handleClearSearch} />
          ) : null}
          <View className='forum-scan-line-icon' onClick={handleSearchSubmit} />
        </View>

        <View className='glass-card forum-modules'>
          {FORUM_MODULES.map((item) => (
            <View
              key={item.id}
              className={`forum-module-item ${item.tone}`}
              hoverClass='forum-module-item-pressed'
              hoverStartTime={0}
              hoverStayTime={100}
            >
              <View className='forum-module-icon'>
                <Image src={item.icon} mode='aspectFit' />
              </View>
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className='forum-section-header'>
        <Text className='forum-section-title'>热门话题</Text>
        <View className='forum-section-action'>
          <Text>更多</Text>
          <Image className='forum-section-chevron' src={chevronRightMuted} mode='aspectFit' />
        </View>
      </View>

      <View className='forum-topic-row'>
        {data?.topics.map((item, index) => (
          <View key={item.id} className={`forum-topic-chip tone-${index % 4}`}>
            <Text className='forum-topic-label'>{item.label}</Text>
            <View className='forum-topic-heat-row'>
              <Image className='forum-topic-fire' src={iconFlameBold} mode='aspectFit' />
              <Text>{item.heat}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='forum-filter-row'>
        <View className='forum-feed-tabs'>
          {FEED_TABS.map((item, index) => (
            <View key={item} className={`forum-feed-tab${index === 0 ? ' active' : ''}`}>
              <Text>{item}</Text>
            </View>
          ))}
        </View>
        <View className='forum-sort-select'>
          <Text>最新发布</Text>
          <View className='forum-sort-caret' />
        </View>
      </View>

      <View className='forum-feed'>
        {visiblePosts.length ? (
          visiblePosts.map((post) => (
            <Navigator
              key={post.id}
              className='forum-post-card'
              url='/pages/article/index'
              openType='navigate'
              hoverClass='forum-post-card-pressed'
              hoverStartTime={0}
              hoverStayTime={120}
            >
              <View className='forum-post-head'>
                <View className={`forum-post-avatar ${post.avatarTone}`}>
                  <Image className='forum-post-avatar-img' src={post.avatar} mode='aspectFill' />
                </View>
                <View className='forum-post-author-block'>
                  <View className='forum-post-author-row'>
                    <Text className='forum-post-author'>{post.author}</Text>
                    <View className='forum-post-badge'>
                      <Image className='forum-post-badge-icon' src={iconBadgePin} mode='aspectFit' />
                      <Text>{post.badge}</Text>
                    </View>
                  </View>
                  <Text className='forum-post-meta'>{post.meta}</Text>
                </View>
                <Text className='forum-post-more'>...</Text>
              </View>

              <View className='forum-post-body'>
                <View className='forum-post-main'>
                  <Text className='forum-post-title'>{post.title}</Text>
                  <Text className='forum-post-summary'>{post.summary}</Text>
                  {post.price ? (
                    <Text className='forum-post-price'>{post.price}</Text>
                  ) : (
                    <Text className='forum-post-module-badge'>{post.module}</Text>
                  )}
                </View>
                <View className='forum-post-cover'>
                  {post.coverType === 'bike' ? (
                    <Image className='forum-post-cover-image' src={bikeThumb} mode='aspectFill' />
                  ) : (
                    <View className='forum-python-cover'>
                      <Text className='forum-python-title'>PYTHON</Text>
                      <Text className='forum-python-subtitle'>学习资料包</Text>
                      <Text className='forum-python-pdf'>PDF</Text>
                    </View>
                  )}
                </View>
              </View>

              <View className='forum-post-stats'>
                <View className='forum-post-stat'>
                  <Image className='forum-stat-icon' src={iconStatShare} mode='aspectFit' />
                  <Text>{post.stats.share}</Text>
                </View>
                <View className='forum-post-stat'>
                  <Image className='forum-stat-icon' src={iconStatComment} mode='aspectFit' />
                  <Text>{post.stats.comment}</Text>
                </View>
                <View className='forum-post-stat'>
                  <Image className='forum-stat-icon' src={iconStatLike} mode='aspectFit' />
                  <Text>{post.stats.like}</Text>
                </View>
              </View>
            </Navigator>
          ))
        ) : (
          <View className='forum-empty-state'>
            <Text>暂无相关帖子</Text>
          </View>
        )}
      </View>
    </MobileShell>
  )
}
