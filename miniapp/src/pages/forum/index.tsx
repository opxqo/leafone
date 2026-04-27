import { Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getForumData, type ForumData } from '../../services'

import './index.scss'

const modules = ['学习互助', '二手交易', '食堂点评', '活动广场', '兴趣圈子', '全部板块']

export default function ForumPage() {
  const data = useAsyncData<ForumData>(getForumData, [])

  return (
    <MobileShell activeNav='forum'>
      <View className='forum-head'>
        <View>
          <Text className='forum-title'>校园论坛</Text>
          <Text className='forum-subtitle'>连接你我，分享校园生活</Text>
        </View>
        <View className='publish-btn'>发布</View>
      </View>

      <View className='search-box'>搜索帖子、话题、用户...</View>

      <View className='glass-card forum-modules'>
        {modules.map((item) => (
          <View key={item} className='module-tag'>
            <Text>{item}</Text>
          </View>
        ))}
      </View>

      <View className='section-header'>
        <Text className='section-title'>热门话题</Text>
        <Text className='section-action'>更多</Text>
      </View>

      <View className='topic-row'>
        {data?.topics.map((item) => (
          <View key={item.id} className='topic-chip'>
            <Text className='topic-label'>{item.label}</Text>
            <Text className='topic-heat'>{item.heat}</Text>
          </View>
        ))}
      </View>

      <View className='feed-tabs'>
        <View className='feed-tab active'>最新</View>
        <View className='feed-tab'>推荐</View>
        <View className='feed-tab'>关注</View>
      </View>

      <View className='forum-feed'>
        {data?.posts.map((post) => (
          <View
            key={post.id}
            className='glass-card post-card'
            onClick={() => {
              Taro.navigateTo({
                url: `/pages/article/index?id=${post.id}`,
              })
            }}
          >
            <View className='post-head'>
              <View>
                <Text className='post-author'>{post.author}</Text>
                <Text className='post-badge'>{post.badge}</Text>
              </View>
              <Text className='post-more'>...</Text>
            </View>
            <Text className='post-title'>{post.title}</Text>
            <Text className='post-summary'>{post.summary}</Text>
            <View className='post-stats'>
              <Text>转 {post.stats.share}</Text>
              <Text>评 {post.stats.comment}</Text>
              <Text>赞 {post.stats.like}</Text>
            </View>
          </View>
        ))}
      </View>
    </MobileShell>
  )
}
