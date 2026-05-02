import { Text, View } from '@tarojs/components'
import MobileShell from '../../components/mobile-shell'
import { useAsyncData } from '../../hooks/use-async-data'
import { getDiscoverCategories, type DiscoverCategory } from '../../services'

import './index.scss'

const EMPTY_CATEGORIES: DiscoverCategory[] = []

export default function DiscoverPage() {
  const { data: list } = useAsyncData<DiscoverCategory[]>(
    getDiscoverCategories,
    [],
    EMPTY_CATEGORIES,
    'discover-categories',
  )

  return (
    <MobileShell activeNav='discover'>
      <View className='page-head'>
        <Text className='page-title'>发现</Text>
        <Text className='page-subtitle'>发现更多有趣的内容</Text>
      </View>

      <View className='discover-list'>
        {list.map((item) => (
          <View key={item.id} className='glass-card discover-item'>
            <View className='discover-icon' />
            <View className='discover-main'>
              <Text className='discover-title'>{item.title}</Text>
              <Text className='discover-desc'>{item.description}</Text>
            </View>
            <Text className='discover-count'>今日 {item.todayCount} 帖</Text>
          </View>
        ))}
      </View>

      <View className='banner-card compact'>
        <View>
          <Text className='banner-title'>校园开放日</Text>
          <Text className='banner-subtitle'>相约城院，共赴未来</Text>
        </View>
        <Text className='banner-arrow'>{'>'}</Text>
      </View>
    </MobileShell>
  )
}
