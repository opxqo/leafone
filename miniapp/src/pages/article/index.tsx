import { Image, Input, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getArticleData, type ArticleData } from '../../services'

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
  const data = useAsyncData<ArticleData>(() => getArticleData(id), [id], null, `article:${id}`)

  if (!data) {
    return (
      <MobileShell showBottomNav={false} className='article-shell'>
        <View className='loading-state'>页面加载中...</View>
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
              Taro.navigateBack({
                delta: 1,
              })
            }}
          >
            <View className='article-back-line' />
          </View>
          <View className='article-nav-btn article-more-btn'>
            <Text>•••</Text>
          </View>
        </View>

        <View className='article-author-section'>
          <Image className='article-author-avatar' src={AUTHOR_AVATAR} mode='aspectFill' />
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
          <Text className='article-chip-icon'>♟</Text>
          <Text>学习互助</Text>
          <Text className='article-chip-arrow'>›</Text>
        </View>

        <View className='article-content'>
          <Text className='article-paragraph'>{data.intro}</Text>

          <Text className='article-folder-title'>📁 资料目录如下：</Text>
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
                <Text>↓</Text>
              </View>
            </View>
          ))}
        </View>

        <View className='article-location-pill'>
          <Text className='article-location-icon'>●</Text>
          <Text>计算机学院教学楼 3号楼</Text>
        </View>

        <View className='article-action-row'>
          <View className='article-action-item'>
            <Text className='article-action-icon'>↗</Text>
            <Text>12</Text>
          </View>
          <View className='article-action-item'>
            <Text className='article-action-icon'>☰</Text>
            <Text>48</Text>
          </View>
          <View className='article-action-item'>
            <Text className='article-action-icon'>♡</Text>
            <Text>96</Text>
          </View>
          <View className='article-action-item'>
            <Text className='article-action-icon'>☆</Text>
            <Text>收藏</Text>
          </View>
        </View>

        <View className='article-comment-panel'>
          <View className='article-comment-head'>
            <Text className='article-comment-title'>全部评论（48）</Text>
            <Text className='article-comment-sort'>默认排序⌄</Text>
          </View>

          {primaryComment ? (
            <View key={primaryComment.id} className='article-comment-item'>
              <Image className='article-comment-avatar' src={COMMENT_AVATAR} mode='aspectFill' />
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
                    <Text>☰ 回复</Text>
                    <Text>♡ 8</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>

      <View className='article-comment-dock'>
        <Input className='article-comment-input' value='写下你的评论...' disabled />
        <Text className='article-dock-icon'>☺</Text>
        <Text className='article-dock-icon'>▧</Text>
      </View>
    </MobileShell>
  )
}
