import { Image, Input, Swiper, SwiperItem, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo, useState } from 'react'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getHomeData, type HomeData } from '../../services'

import iconLearn from './icon-learn.svg'
import iconTrade from './icon-trade.svg'
import iconCanteen from './icon-canteen.svg'
import iconActivity from './icon-activity.svg'
import iconLife from './icon-life.svg'
import iconConfession from './icon-confession.svg'
import iconCircle from './icon-circle.svg'
import iconMore from './icon-more.svg'
import headline1Img from './headline-1.jpg'
import headline2Img from './headline-2.jpg'
import headline3Img from './headline-3.jpg'
import chevronRightMuted from './chevron-right-muted.svg'
import chevronRightPrimary from './chevron-right-primary.svg'
import './index.scss'

const HOME_HERO_BG = 'https://image.opxqo.cn/home/top.webp'
const HOME_OPEN_BANNER_BG = 'https://image.opxqo.cn/home/banner/001.webp'

const ICON_MAP: Record<string, string> = {
  'icon-learn': iconLearn,
  'icon-trade': iconTrade,
  'icon-canteen': iconCanteen,
  'icon-activity': iconActivity,
  'icon-life': iconLife,
  'icon-confession': iconConfession,
  'icon-circle': iconCircle,
  'icon-more': iconMore,
}

const HERO_COPY = {
  greeting: '你好，欢迎来到',
  title: '武汉城市学院论坛',
  subtitle: 'WUHAN CITY COLLEGE',
}

const HOME_SHORTCUTS = [
  { id: 'learn', title: '学习互助', icon: 'icon-learn' },
  { id: 'trade', title: '二手交易', icon: 'icon-trade' },
  { id: 'canteen', title: '食堂点评', icon: 'icon-canteen' },
  { id: 'activity', title: '活动广场', icon: 'icon-activity' },
  { id: 'life', title: '校园生活', icon: 'icon-life' },
  { id: 'confession', title: '表白墙', icon: 'icon-confession' },
  { id: 'circle', title: '兴趣圈子', icon: 'icon-circle' },
  { id: 'more', title: '更多板块', icon: 'icon-more' },
]

const HOME_HEADLINES = [
  {
    id: 'news-1',
    title: '武汉城市学院2024届毕业典礼圆满落幕',
    pinned: true,
    summary: '愿此去繁花似锦，归来仍是少年',
    date: '05-18',
    views: '2.2k浏览',
    image: headline1Img,
  },
  {
    id: 'news-2',
    title: '东湖骑行打卡活动火热进行中',
    summary: '共赴绿色校园，守护东湖之美',
    date: '05-16',
    views: '1.8k浏览',
    image: headline2Img,
  },
  {
    id: 'news-3',
    title: '学校开展“书香校园”主题活动',
    summary: '阅读点亮生活，书香润泽心灵',
    date: '05-15',
    views: '6.4k浏览',
    image: headline3Img,
  },
]

function getMatchedHeadlines(keyword: string) {
  const normalized = keyword.trim().toLowerCase()

  if (!normalized) {
    return HOME_HEADLINES
  }

  return HOME_HEADLINES.filter((item) =>
    [item.title, item.summary, item.date, item.views].some((field) =>
      field.toLowerCase().includes(normalized),
    ),
  )
}

export default function HomePage() {
  const data = useAsyncData<HomeData>(getHomeData, [], null, 'home')
  const [searchValue, setSearchValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const visibleHeadlines = useMemo(() => getMatchedHeadlines(searchKeyword), [searchKeyword])
  const isSearching = searchKeyword.trim().length > 0

  const handleSearchSubmit = () => {
    const keyword = searchValue.trim()

    if (!keyword) {
      setSearchKeyword('')
      Taro.showToast({
        title: '请输入搜索内容',
        icon: 'none',
      })
      return
    }

    const matched = getMatchedHeadlines(keyword)
    setSearchKeyword(keyword)
    Taro.showToast({
      title: matched.length ? `找到${matched.length}条相关内容` : '暂无相关内容',
      icon: 'none',
    })
  }

  const handleClearSearch = () => {
    setSearchValue('')
    setSearchKeyword('')
  }

  if (!data) {
    return (
      <MobileShell activeNav='home'>
        <View className='loading-state'>页面加载中...</View>
      </MobileShell>
    )
  }

  return (
    <MobileShell activeNav='home' className='home-shell'>
      <View className='hero-card'>
        <CachedImage className='hero-bg-image' src={HOME_HERO_BG} mode='aspectFill' />

        <View className='hero-copy'>
          <Text className='hero-greeting'>{HERO_COPY.greeting}</Text>
          <Text className='hero-title'>{HERO_COPY.title}</Text>
          <Text className='hero-subtitle'>{HERO_COPY.subtitle}</Text>
        </View>

        <View className={`search-box hero-search-box${isSearching ? ' is-searching' : ''}`}>
          <View className='search-line-icon' onClick={handleSearchSubmit} />
          <Input
            className='search-input'
            value={searchValue}
            placeholder='搜索帖子、话题、用户...'
            placeholderClass='search-input-placeholder'
            confirmType='search'
            onInput={(event) => {
              setSearchValue(String(event.detail.value))
              return event.detail.value
            }}
            onConfirm={handleSearchSubmit}
          />
          {searchValue || isSearching ? (
            <View className='search-clear' onClick={handleClearSearch} />
          ) : null}
          <View className='scan-line-icon' onClick={handleSearchSubmit} />
        </View>
      </View>

      <View className='glass-card shortcut-grid'>
        {HOME_SHORTCUTS.map((item) => (
          <View key={item.id} className='shortcut-item'>
            <View className='shortcut-icon'>
              <Image src={ICON_MAP[item.icon]} mode='aspectFit' />
            </View>
            <Text>{item.title}</Text>
          </View>
        ))}
      </View>

      <View className='section-header home-headline-header'>
        <Text className='section-title'>{isSearching ? '搜索结果' : '校园头条'}</Text>
        {isSearching ? (
          <View className='section-action-more' onClick={handleClearSearch}>
            <Text>清空</Text>
          </View>
        ) : (
          <View className='section-action-more'>
            <Text>更多</Text>
            <Image className='section-chevron' src={chevronRightMuted} mode='aspectFit' />
          </View>
        )}
      </View>

      <View className='headline-list'>
        {visibleHeadlines.length ? (
          visibleHeadlines.map((item) => (
            <View key={item.id} className='headline-item'>
              <View className='headline-main'>
                <View className='headline-title-row'>
                  <Text className='headline-title'>{item.title}</Text>
                  {item.pinned ? <Text className='headline-tag'>置顶</Text> : null}
                </View>
                <Text className='headline-summary'>{item.summary}</Text>
                <View className='headline-meta-row'>
                  <Text>{item.date}</Text>
                  <Text>{item.views}</Text>
                </View>
              </View>
              <Image className='headline-thumb' src={item.image} mode='aspectFill' />
            </View>
          ))
        ) : (
          <View className='search-empty-state'>
            <Text>暂无相关内容</Text>
          </View>
        )}
      </View>

      <Swiper
        className='banner-swiper'
        autoplay
        circular
        interval={3000}
        indicatorDots
        indicatorColor='rgba(255,255,255,0.4)'
        indicatorActiveColor='#ffffff'
      >
        {[0, 1, 2].map((i) => (
          <SwiperItem key={i}>
            <View
              className='banner-card home-open-banner'
              onClick={() => {
                Taro.navigateTo({
                  url: `/pages/article/index?id=post-${i + 1}`,
                })
              }}
            >
              <CachedImage className='banner-bg-image' src={HOME_OPEN_BANNER_BG} mode='aspectFill' />
              <View className='banner-copy'>
                <Text className='banner-title'>校园开放日</Text>
                <Text className='banner-subtitle'>相约城院，共赴未来</Text>
              </View>
              <View className='banner-arrow-wrap'>
                <Image className='banner-arrow' src={chevronRightPrimary} mode='aspectFit' />
              </View>
            </View>
          </SwiperItem>
        ))}
      </Swiper>
    </MobileShell>
  )
}
