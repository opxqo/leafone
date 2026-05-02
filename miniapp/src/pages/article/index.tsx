import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { useRouter, usePageScroll } from '@tarojs/taro'
import { useEffect, useRef, useState } from 'react'
import CachedImage from '../../components/cached-image'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getArticleData, type ArticleData } from '../../services'

import iconBack from '../login/icon-back.svg'
import chevronRight from '../home/chevron-right-muted.svg'
import iconBookOpen from './icon-book-open.svg'
import iconComment from './icon-comment.svg'
import iconDownload from './icon-download.svg'
import iconFolder from './icon-folder.svg'
import iconImage from './icon-image.svg'
import iconLike from './icon-like.svg'
import iconMapPin from './icon-map-pin.svg'
import iconShare from './icon-share.svg'
import iconSmile from './icon-smile.svg'
import iconStar from './icon-star.svg'
import fileExcelIcon from './file-excel.svg'
import filePdfIcon from './file-pdf.svg'
import fileWordIcon from './file-word.svg'
import './index.scss'

const AUTHOR_AVATAR = 'https://image.opxqo.cn/avatar/eg/001.webp'
const COMMENT_AVATAR = 'https://image.opxqo.cn/avatar/eg/002.webp'

const FILE_ICON_MAP: Record<string, string> = {
  pdf: filePdfIcon,
  doc: fileWordIcon,
  excel: fileExcelIcon,
}

export default function ArticlePage() {
  const router = useRouter()
  const id = router.params.id ?? 'post-1'
  const { data, error, retry } = useAsyncData<ArticleData>(() => getArticleData(id), [id], null, `article:${id}`)

  const [commentDockVisible, setCommentDockVisible] = useState(false)
  const commentPanelRef = useRef<number | null>(null)
  const windowHeightRef = useRef(0)

  useEffect(() => {
    windowHeightRef.current = Taro.getSystemInfoSync().windowHeight
  }, [])

  useEffect(() => {
    if (!data) return

    setTimeout(() => {
      const query = Taro.createSelectorQuery()
      query
        .select('.article-comment-panel')
        .boundingClientRect((rect) => {
          if (rect && !Array.isArray(rect)) {
            commentPanelRef.current = rect.top ?? null
          }
        })
        .exec()
    }, 100)
  }, [data])

  usePageScroll((event) => {
    if (commentPanelRef.current === null) return

    const scrollTop = event.scrollTop
    const windowHeight = windowHeightRef.current
    const threshold = commentPanelRef.current - windowHeight + 100

    setCommentDockVisible(scrollTop >= threshold)
  })

  if (!data) {
    return (
      <MobileShell showBottomNav={false} className='article-shell'>
        <View className='loading-state'>
          {error ? (
            <>
              <Text>{error}</Text>
              <View className='retry-btn' onClick={retry}>
                <Text>点击重试</Text>
              </View>
            </>
          ) : (
            <Text>页面加载中...</Text>
          )}
        </View>
      </MobileShell>
    )
  }

  const primaryComment = data.comments[0]

  return (
    <MobileShell showBottomNav={false} className='article-shell'>
      <View className='article-page'>
        <View className='article-nav'>
          <View
            className='article-nav-btn article-back-btn'
            onClick={() => {
              Taro.navigateBack({ delta: 1 })
            }}
          >
            <Image className='article-nav-icon' src={iconBack} mode='aspectFit' />
          </View>
          <View className='article-nav-btn article-more-btn'>
            <View className='article-more-dot' />
            <View className='article-more-dot' />
            <View className='article-more-dot' />
          </View>
        </View>

        <View className='article-author-section'>
          <CachedImage className='article-author-avatar' src={AUTHOR_AVATAR} mode='aspectFill' />
          <View className='article-author-main'>
            <View className='article-author-name-row'>
              <Text className='article-author-name'>{data.author}</Text>
              <View className='article-author-badge'>
                <Text className='article-pin-dot'>●</Text>
                <Text>学长</Text>
              </View>
            </View>
            <Text className='article-author-major'>计算机学院 · 软件工程专业</Text>
            <Text className='article-author-meta'>{data.authorMeta}</Text>
          </View>
          <View className='article-follow-btn'>
            <Text>＋ 关注</Text>
          </View>
        </View>

        <Text className='article-title'>{data.title}</Text>

        <View className='article-module-chip'>
          <Image className='article-chip-icon' src={iconBookOpen} mode='aspectFit' />
          <Text>学习互助</Text>
          <Image className='article-chip-arrow' src={chevronRight} mode='aspectFit' />
        </View>

        <View className='article-content'>
          <Text className='article-paragraph'>{data.intro}</Text>

          <View className='article-folder-title'>
            <Image className='article-folder-icon' src={iconFolder} mode='aspectFit' />
            <Text>资料目录如下：</Text>
          </View>
          <View className='article-number-list'>
            {data.bulletPoints.map((item, index) => (
              <Text key={item} className='article-number-item'>
                {index + 1}. {item}
              </Text>
            ))}
          </View>

          <View className='article-link-line'>
            <Text>网盘链接：</Text>
            <Text className='article-link-text'>{data.link}</Text>
          </View>
          <Text className='article-code-line'>提取码： {data.linkCode}</Text>
          <Text className='article-wish-line'>祝大家期末顺利，取得好成绩！ 💪</Text>
        </View>

        <View className='article-file-card'>
          {data.attachments.map((item) => (
            <View key={item.id} className='article-file-row'>
              <Image className='article-file-icon' src={FILE_ICON_MAP[item.type] || fileWordIcon} mode='aspectFit' />
              <View className='article-file-main'>
                <Text className='article-file-name'>{item.name}</Text>
                <Text className='article-file-size'>{item.size}</Text>
              </View>
              <View className='article-download-btn'>
                <Image className='article-download-icon' src={iconDownload} mode='aspectFit' />
              </View>
            </View>
          ))}
        </View>

        <View className='article-location-pill'>
          <Image className='article-location-icon' src={iconMapPin} mode='aspectFit' />
          <Text>计算机学院教学楼 3号楼</Text>
        </View>

        <View className='article-action-row'>
          <View className='article-action-item'>
            <Image className='article-action-icon' src={iconShare} mode='aspectFit' />
            <Text>12</Text>
          </View>
          <View className='article-action-item'>
            <Image className='article-action-icon' src={iconComment} mode='aspectFit' />
            <Text>48</Text>
          </View>
          <View className='article-action-item'>
            <Image className='article-action-icon' src={iconLike} mode='aspectFit' />
            <Text>96</Text>
          </View>
          <View className='article-action-item'>
            <Image className='article-action-icon' src={iconStar} mode='aspectFit' />
            <Text>收藏</Text>
          </View>
        </View>

        <View className='article-comment-panel'>
          <View className='article-comment-head'>
            <Text className='article-comment-title'>全部评论（48）</Text>
            <View className='article-comment-sort'>
              <Text>默认排序</Text>
              <View className='article-sort-chevron' />
            </View>
          </View>

          {primaryComment ? (
            <View key={primaryComment.id} className='article-comment-item'>
              <CachedImage className='article-comment-avatar' src={COMMENT_AVATAR} mode='aspectFill' />
              <View className='article-comment-main'>
                <View className='article-comment-name-row'>
                  <Text className='article-comment-author'>{primaryComment.author}</Text>
                  <View className='article-comment-badge'>
                    <Text>● 大二</Text>
                  </View>
                </View>
                <Text className='article-comment-content'>{primaryComment.content}</Text>
                <View className='article-comment-meta'>
                  <Text>{primaryComment.time}</Text>
                  <View className='article-comment-tools'>
                    <View className='article-comment-tool-item'>
                      <Image className='article-comment-tool-icon' src={iconComment} mode='aspectFit' />
                      <Text>回复</Text>
                    </View>
                    <View className='article-comment-tool-item'>
                      <Image className='article-comment-tool-icon' src={iconLike} mode='aspectFit' />
                      <Text>8</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <View className={`article-comment-dock${commentDockVisible ? ' is-visible' : ''}`}>
        <View className='article-dock-input-wrap'>
          <Image className='article-dock-input-icon' src={iconSmile} mode='aspectFit' />
          <Input className='article-comment-input' placeholder='写评论...' placeholderClass='article-comment-placeholder' />
        </View>
        <View className='article-dock-actions'>
          <Image className='article-dock-action-icon' src={iconImage} mode='aspectFit' />
        </View>
      </View>
    </MobileShell>
  )
}
