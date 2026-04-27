import { Input, Text, View } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getArticleData, type ArticleData } from '../../services'

import './index.scss'

export default function ArticlePage() {
  const router = useRouter()
  const id = router.params.id ?? 'post-1'
  const data = useAsyncData<ArticleData>(() => getArticleData(id), [id])

  if (!data) {
    return (
      <MobileShell showBottomNav={false}>
        <View className='loading-state'>页面加载中...</View>
      </MobileShell>
    )
  }

  return (
    <MobileShell showBottomNav={false}>
      <View className='article-nav'>
        <View
          className='round-btn'
          onClick={() => {
            Taro.navigateBack({
              delta: 1,
            })
          }}
        >
          <Text>{'<'}</Text>
        </View>
        <View className='round-btn'>
          <Text>...</Text>
        </View>
      </View>

      <View className='glass-card article-main'>
        <View className='author-row'>
          <View className='avatar' />
          <View className='author-main'>
            <Text className='author-name'>{data.author}</Text>
            <Text className='author-meta'>{data.authorMeta}</Text>
          </View>
          <View className='follow-btn'>+ 关注</View>
        </View>

        <Text className='article-title'>{data.title}</Text>
        <Text className='article-intro'>{data.intro}</Text>

        <View className='bullet-list'>
          {data.bulletPoints.map((item) => (
            <Text key={item} className='bullet-item'>
              • {item}
            </Text>
          ))}
        </View>

        <Text className='article-link'>网盘链接: {data.link}</Text>
        <Text className='article-link'>提取码: {data.linkCode}</Text>

        <View className='file-list'>
          {data.attachments.map((item) => (
            <View key={item.id} className='file-item'>
              <View className={item.type === 'pdf' ? 'file-icon pdf' : 'file-icon doc'}>
                <Text>{item.type.toUpperCase()}</Text>
              </View>
              <View className='file-main'>
                <Text className='file-name'>{item.name}</Text>
                <Text className='file-size'>{item.size}</Text>
              </View>
              <View className='download-btn'>下载</View>
            </View>
          ))}
        </View>
      </View>

      <View className='glass-card comment-card'>
        <View className='section-header'>
          <Text className='section-title'>全部评论（{data.comments.length}）</Text>
          <Text className='section-action'>默认排序</Text>
        </View>

        {data.comments.map((item) => (
          <View key={item.id} className='comment-item'>
            <View className='avatar small' />
            <View className='comment-main'>
              <Text className='comment-author'>{item.author}</Text>
              <Text className='comment-content'>{item.content}</Text>
              <Text className='comment-time'>{item.time}</Text>
            </View>
          </View>
        ))}
      </View>

      <View className='comment-input-wrap'>
        <Input className='comment-input' value='写下你的评论...' disabled />
        <View className='send-btn'>发送</View>
      </View>
    </MobileShell>
  )
}
