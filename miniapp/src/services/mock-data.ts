import type {
  ArticleData,
  DiscoverCategory,
  ForumData,
  HomeData,
  MessageItem,
  ProfileData,
} from './types'

export const homeMockData: HomeData = {
  greeting: '你好，欢迎来到',
  title: '武汉城市学院论坛',
  subtitle: 'WUHAN CITY COLLEGE',
  shortcuts: [
    { id: 'learn', title: '学习互助', icon: 'icon-learn' },
    { id: 'trade', title: '二手交易', icon: 'icon-trade' },
    { id: 'canteen', title: '食堂点评', icon: 'icon-canteen' },
    { id: 'activity', title: '活动广场', icon: 'icon-activity' },
    { id: 'life', title: '校园生活', icon: 'icon-life' },
    { id: 'confession', title: '表白墙', icon: 'icon-confession' },
    { id: 'circle', title: '兴趣圈子', icon: 'icon-circle' },
    { id: 'more', title: '更多模块', icon: 'icon-more' },
  ],
  headlines: [
    {
      id: 'news-1',
      title: '武汉城市学院2024届毕业典礼圆满落幕',
      meta: '05-18  2.2k 浏览',
    },
    {
      id: 'news-2',
      title: '东湖骑行打卡活动火热进行中',
      meta: '05-16  1.8k 浏览',
    },
    {
      id: 'news-3',
      title: '学术开放日主题活动本周启动',
      meta: '05-15  6.4k 浏览',
    },
  ],
  bannerTitle: '校园开放日',
  bannerSubtitle: '相约城院，共赴未来',
}

const forumAvatarPool = Array.from(
  { length: 6 },
  (_, index) => `https://image.opxqo.cn/avatar/eg/${String(index + 1).padStart(3, '0')}.webp`,
)

function getForumAvatar(index: number) {
  return forumAvatarPool[index % forumAvatarPool.length]
}

export const forumMockData: ForumData = {
  topics: [
    { id: 'topic-1', label: '# 考研互助打卡', heat: '1.2w 讨论' },
    { id: 'topic-2', label: '# 东湖骑行路线推荐', heat: '8563 讨论' },
    { id: 'topic-3', label: '# 武城院春日限定', heat: '7432 讨论' },
    { id: 'topic-4', label: '# 期末复习资料', heat: '5890 讨论' },
  ],
  posts: [
    {
      id: 'post-1',
      author: '计算机小林学长',
      badge: '学长',
      meta: '2分钟前  计算机学院',
      title: 'Python期末复习资料整理（附网盘）',
      summary: '整理了一些Python期末复习资料和习题，包含重点知识点总结。',
      module: '学习互助',
      avatar: getForumAvatar(0),
      coverType: 'python',
      avatarTone: 'male',
      stats: {
        share: 12,
        comment: 48,
        like: 96,
      },
    },
    {
      id: 'post-2',
      author: '奶茶不加糖',
      badge: '大二',
      meta: '8分钟前  传媒与设计学院',
      title: '出九成新自行车！速来~',
      summary: '个人原因转让，车况很好，骑行感受超棒，适合日常通勤。',
      module: '二手交易',
      avatar: getForumAvatar(1),
      price: '￥260',
      coverType: 'bike',
      avatarTone: 'female',
      stats: {
        share: 5,
        comment: 23,
        like: 36,
      },
    },
  ],
}

export const articleMockData: ArticleData = {
  id: 'post-1',
  author: '计算机小林学长',
  authorMeta: '05-18 14:32 发布于 校园论坛',
  title: 'Python期末复习资料整理（附网盘）',
  intro:
    '整理了一些Python期末复习资料和习题，包含重点知识总结、常见题型解析、模拟试卷，希望对大家有帮助。',
  bulletPoints: [
    'Python重点知识总结.pdf',
    '常见题型与解析.pdf',
    '模拟试卷（含答案）.pdf',
    '实验报告模板.docx',
  ],
  link: 'https://pan.baidu.com/s/xxxxxx',
  linkCode: 'py666',
  attachments: [
    { id: 'att-1', name: 'Python重点知识总结.pdf', size: '2.45MB', type: 'pdf' },
    { id: 'att-2', name: '常见题型与解析.pdf', size: '1.82MB', type: 'pdf' },
    { id: 'att-3', name: '实验报告模板.docx', size: '320KB', type: 'doc' },
  ],
  comments: [
    {
      id: 'comment-1',
      author: '奶茶不加糖',
      content: '太棒了！正好需要，感谢学长分享~',
      time: '05-18 14:45',
    },
    {
      id: 'comment-2',
      author: '学霸小王',
      content: '这个资料太全了，准备冲刺！',
      time: '05-18 15:10',
    },
  ],
}

export const discoverMockData: DiscoverCategory[] = [
  {
    id: 'discover-1',
    title: '学习互助',
    description: '问答解惑，资料分享，互帮互助',
    todayCount: 256,
  },
  {
    id: 'discover-2',
    title: '二手交易',
    description: '闲置物品交易，环保又实惠',
    todayCount: 128,
  },
  {
    id: 'discover-3',
    title: '食堂点评',
    description: '分享美食体验，发现好吃的窗口',
    todayCount: 89,
  },
  {
    id: 'discover-4',
    title: '活动广场',
    description: '校园活动发布与交流',
    todayCount: 76,
  },
  {
    id: 'discover-5',
    title: '校园生活',
    description: '记录校园点滴，分享美好瞬间',
    todayCount: 68,
  },
  {
    id: 'discover-6',
    title: '表白墙',
    description: '勇敢表达，说出你的心里话',
    todayCount: 46,
  },
]

export const messageMockData: MessageItem[] = [
  {
    id: 'message-1',
    title: '学校通知',
    detail: '关于2024年五一放假安排的通知',
    time: '09:32',
    unread: 1,
  },
  {
    id: 'message-2',
    title: '互动回复',
    detail: '计算机小林学长回复了你的帖子',
    time: '09:15',
    unread: 2,
  },
  {
    id: 'message-3',
    title: '收到的赞',
    detail: '奶茶不加糖赞了你的帖子',
    time: '昨天 21:08',
    unread: 3,
  },
  {
    id: 'message-4',
    title: '新增关注',
    detail: '学霸小王关注了你',
    time: '昨天 18:45',
  },
  {
    id: 'message-5',
    title: '活动提醒',
    detail: '你报名的“校园开放日”活动即将开始',
    time: '昨天 16:30',
    unread: 1,
  },
  {
    id: 'message-6',
    title: '校园卡消息',
    detail: '校园卡余额不足20元，请及时充值',
    time: '05-17 12:11',
  },
  {
    id: 'message-7',
    title: '系统消息',
    detail: '你的账号在新设备登录',
    time: '05-16 09:22',
  },
]

export const profileMockData: ProfileData = {
  name: '林一航',
  identity: '计算机学院 · 2021级',
  studentId: '学号: 2022123456',
  avatar: 'https://image.opxqo.cn/avatar/eg/001.webp',
  balance: '128.5',
  walletActions: [
    { id: 'wallet-1', title: '充值' },
    { id: 'wallet-2', title: '交易记录' },
    { id: 'wallet-3', title: '挂失' },
    { id: 'wallet-4', title: '校园码' },
  ],
  settings: ['个人信息', '设置', '意见反馈', '帮助中心', '关于我们'],
}
