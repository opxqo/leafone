import { useMemo, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { memo, useCallback } from 'react'
import { HashRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import authIconBack from './assets/auth-icon-back.svg'
import authIconCode from './assets/auth-icon-code.svg'
import authIconCollege from './assets/auth-icon-college.svg'
import authIconEyeOff from './assets/auth-icon-eye-off.svg'
import authIconIdCard from './assets/auth-icon-id-card.svg'
import authIconLock from './assets/auth-icon-lock.svg'
import authIconPhone from './assets/auth-icon-phone.svg'
import authIconShield from './assets/auth-icon-shield.svg'
import authIconUser from './assets/auth-icon-user.svg'
import authIconWechat from './assets/auth-icon-wechat.svg'
import articleFileExcel from './assets/article-file-excel.svg'
import articleFilePdf from './assets/article-file-pdf.svg'
import articleFileWord from './assets/article-file-word.svg'
import headline1Img from './assets/headline-1.jpg'
import headline2Img from './assets/headline-2.jpg'
import headline3Img from './assets/headline-3.jpg'
import chevronRightMuted from './assets/chevron-right-muted.svg'
import chevronRightPrimary from './assets/chevron-right-primary.svg'
import forumIconActivity from './assets/forum-icon-activity.svg'
import forumIconBadgePin from './assets/forum-icon-badge-pin.svg'
import forumIconCanteen from './assets/forum-icon-canteen.svg'
import forumIconCircle from './assets/forum-icon-circle.svg'
import forumIconFlameBold from './assets/forum-icon-flame-bold.svg'
import forumIconLearn from './assets/forum-icon-learn.svg'
import forumIconMore from './assets/forum-icon-more.svg'
import forumIconStatComment from './assets/forum-icon-stat-comment.svg'
import forumIconStatLike from './assets/forum-icon-stat-like.svg'
import forumIconStatShare from './assets/forum-icon-stat-share.svg'
import forumIconTrade from './assets/forum-icon-trade.svg'
import messageIconFollow from './assets/message-icon-follow.svg'
import messageIconInteraction from './assets/message-icon-interaction.svg'
import messageIconLike from './assets/message-icon-like.svg'
import messageIconNotice from './assets/message-icon-notice.svg'
import messageListActivity from './assets/message-list-activity.svg'
import messageListCard from './assets/message-list-card.svg'
import messageListFollow from './assets/message-list-follow.svg'
import messageListLike from './assets/message-list-like.svg'
import messageListReply from './assets/message-list-reply.svg'
import messageListSchoolNotice from './assets/message-list-school-notice.svg'
import messageListSystem from './assets/message-list-system.svg'
import profileIconLogout from './assets/profile-icon-logout.svg'
import profileIconPinWhite from './assets/profile-icon-pin-white.svg'
import profileIconVerify from './assets/profile-icon-verify.svg'
import profilePowerChart from './assets/profile-power-chart.svg'
import profileServiceBook from './assets/profile-service-book.svg'
import profileServiceBookmark from './assets/profile-service-bookmark.svg'
import profileServiceBriefcase from './assets/profile-service-briefcase.svg'
import profileServiceCalendar from './assets/profile-service-calendar.svg'
import profileServiceClipboard from './assets/profile-service-clipboard.svg'
import profileServiceMore from './assets/profile-service-more.svg'
import profileSettingHelp from './assets/profile-setting-help.svg'
import profileSettingInfo from './assets/profile-setting-info.svg'
import profileSettingMessage from './assets/profile-setting-message.svg'
import profileSettingUser from './assets/profile-setting-user.svg'

type TabKey = 'home' | 'discover' | 'forum' | 'messages' | 'profile'

type QuickRoute = {
  path: string
  label: string
}

type Headline = {
  title: string
  meta: string
}

type ForumPost = {
  author: string
  badge: string
  meta: string
  title: string
  summary: string
  module: string
  avatar: string
  price?: string
  coverType: 'python' | 'bike'
  avatarTone: 'male' | 'female'
  stats: string[]
}

const quickRoutes: QuickRoute[] = [
  { path: '/login', label: '登录' },
  { path: '/register', label: '注册' },
  { path: '/', label: '首页' },
  { path: '/discover', label: '发现' },
  { path: '/forum', label: '论坛' },
  { path: '/article', label: '文章' },
  { path: '/school', label: '学校介绍' },
  { path: '/services', label: '校园服务' },
  { path: '/messages', label: '消息' },
  { path: '/profile', label: '我的-模板2' },
  { path: '/profile-power', label: '我的-模板1' },
  { path: '/power-stats', label: '用电统计' },
  { path: '/power-detail', label: '用电详情' },
]

const designFileMap: Record<string, string> = {
  '/login': '登录&注册.png',
  '/register': '登录&注册.png',
  '/': '首页.png',
  '/discover': '发现页.png',
  '/forum': '论坛页.png',
  '/article': '文章页.png',
  '/school': '学校介绍页.png',
  '/services': '校园服务页.png',
  '/messages': '消息页.png',
  '/profile': '用户个人页-模板2.png',
  '/profile-power': '用户个人页-模板1.png',
  '/power-stats': '用电统计页-模板1.png',
  '/power-detail': '用电统计页-模板2.png',
}

const shortcutModules = [
  '学习互助',
  '二手交易',
  '食堂点评',
  '活动广场',
  '校园生活',
  '表白墙',
  '兴趣圈子',
  '更多模块',
]

const headlines: Headline[] = [
  {
    title: '武汉城市学院2024届毕业典礼圆满落幕',
    meta: '05-18   2.2k 浏览',
  },
  {
    title: '东湖骑行打卡活动火热进行中',
    meta: '05-16   1.8k 浏览',
  },
  {
    title: '学术开放日主题活动本周启动',
    meta: '05-15   6.4k 浏览',
  },
]

const forumAvatarPool = Array.from(
  { length: 6 },
  (_, index) => `https://image.opxqo.cn/avatar/eg/${String(index + 1).padStart(3, '0')}.webp`,
)

const forumPosts: ForumPost[] = [
  {
    author: '计算机小林学长',
    badge: '学长',
    meta: '2分钟前   计算机学院',
    title: 'Python期末复习资料整理（附网盘）',
    summary: '整理了一些Python期末复习资料和习题，包含重点知识点总结。',
    module: '学习互助',
    avatar: forumAvatarPool[0],
    coverType: 'python',
    avatarTone: 'male',
    stats: ['12', '48', '96'],
  },
  {
    author: '奶茶不加糖',
    badge: '大二',
    meta: '8分钟前   传媒与设计学院',
    title: '出九成新自行车！速来~',
    summary: '个人原因转让，车况很好，骑行感受超棒，适合日常通勤。',
    module: '二手交易',
    avatar: forumAvatarPool[1],
    price: '￥260',
    coverType: 'bike',
    avatarTone: 'female',
    stats: ['5', '23', '36'],
  },
]

const homeHeadlines = [
  {
    title: '武汉城市学院2024届毕业典礼圆满落幕',
    pinned: true,
    summary: '愿此去繁花似锦，归来仍是少年',
    date: '05-18',
    views: '2.2k浏览',
    image: headline1Img,
  },
  {
    title: '东湖骑行打卡活动火热进行中',
    summary: '共赴绿色校园，守护东湖之美',
    date: '05-16',
    views: '1.8k浏览',
    image: headline2Img,
  },
  {
    title: '学校开展“书香校园”主题活动',
    summary: '阅读点亮生活，书香润泽心灵',
    date: '05-15',
    views: '6.4k浏览',
    image: headline3Img,
  },
]

const homeOpenBannerBg = 'https://image.opxqo.cn/home/banner/001.webp'
const profileChargingIcon = 'https://image.opxqo.cn/user/charging.webp'
const authBgImage = 'https://image.opxqo.cn/login/top.webp'
const authLogo = 'https://image.opxqo.cn/leafone_logo.webp'

const registerFieldItems = [
  { label: '姓名', icon: authIconUser },
  { label: '学号', icon: authIconIdCard },
  { label: '学院', icon: authIconCollege, extra: '⌄' },
  { label: '手机号', icon: authIconPhone },
  { label: '验证码', icon: authIconCode, action: '发送验证码' },
  { label: '设置密码', icon: authIconLock, extraIcon: authIconEyeOff },
]

const articleFileIconMap = {
  pdf: articleFilePdf,
  word: articleFileWord,
  excel: articleFileExcel,
}

const articleAttachments = [
  { name: 'Python重点知识总结.pdf', size: '2.45MB', icon: articleFileIconMap.pdf },
  { name: '常见题型与解析.pdf', size: '1.82MB', icon: articleFileIconMap.pdf },
  { name: '实验报告模板.docx', size: '320KB', icon: articleFileIconMap.word },
]

const articleAuthorAvatar = 'https://image.opxqo.cn/avatar/eg/001.webp'
const articleCommentAvatar = 'https://image.opxqo.cn/avatar/eg/002.webp'

function getHomeHeadlineMatches(keyword: string) {
  const normalized = keyword.trim().toLowerCase()

  if (!normalized) {
    return homeHeadlines
  }

  return homeHeadlines.filter((item) =>
    [item.title, item.summary, item.date, item.views].some((field) =>
      field.toLowerCase().includes(normalized),
    ),
  )
}

const bottomTabs: Array<{ key: TabKey; label: string; to: string; mark: string }> = [
  { key: 'home', label: '首页', to: '/', mark: 'H' },
  { key: 'forum', label: '论坛', to: '/forum', mark: 'F' },
  { key: 'messages', label: '消息', to: '/messages', mark: 'M' },
  { key: 'profile', label: '我的', to: '/profile', mark: 'U' },
]

const discoverItems: Array<[string, string, string]> = [
  ['学习互助', '问答解惑，资料分享，互帮互助', '今日 256 帖'],
  ['二手交易', '闲置物品交易，环保又实惠', '今日 128 帖'],
  ['食堂点评', '分享美食体验，发现好吃的窗口', '今日 89 帖'],
  ['活动广场', '校园活动发布与交流', '今日 76 帖'],
  ['校园生活', '记录校园点滴，分享美好瞬间', '今日 68 帖'],
  ['表白墙', '勇敢表达，说出你的心里话', '今日 46 帖'],
]

const forumModules = [
  { label: '学习互助', icon: forumIconLearn, tone: 'green' },
  { label: '二手交易', icon: forumIconTrade, tone: 'warm' },
  { label: '食堂点评', icon: forumIconCanteen, tone: 'green' },
  { label: '活动广场', icon: forumIconActivity, tone: 'orange' },
  { label: '兴趣圈子', icon: forumIconCircle, tone: 'orange' },
  { label: '全部板块', icon: forumIconMore, tone: 'gray' },
]
const forumTopicLabels = [
  { label: '# 考研互助打卡', heat: '1.2w 讨论' },
  { label: '# 东湖骑行路线推荐', heat: '8563 讨论' },
  { label: '# 武城院春日限定', heat: '7432 讨论' },
  { label: '# 期末复习资料', heat: '5890 讨论' },
]
const serviceMapPins = ['食堂', '图书馆', '体育馆', '教学楼', '宿舍']
const commonServices = ['宿舍用电', '校园卡', '课程表', '打印服务', '报修服务']
const serviceCategories = ['学习科研', '生活服务', '安全服务', '活动组织']
const messageHighlights = [
  { label: '通知公告', icon: messageIconNotice, tone: 'notice', unread: 8 },
  { label: '互动消息', icon: messageIconInteraction, tone: 'interaction', unread: 12 },
  { label: '赞与收藏', icon: messageIconLike, tone: 'like', unread: 5 },
  { label: '关注动态', icon: messageIconFollow, tone: 'follow' },
]

const messageRows = [
  {
    title: '学校通知',
    body: '关于2024年五一放假安排的通知',
    time: '09:32',
    icon: messageListSchoolNotice,
    tone: 'notice',
    unread: 'dot',
  },
  {
    title: '互动回复',
    body: '计算机小林学长回复了你的帖子',
    time: '09:15',
    icon: messageListReply,
    tone: 'reply',
    unread: 2,
  },
  {
    title: '收到的赞',
    body: '奶茶不加糖赞了你的帖子',
    time: '昨天 21:08',
    icon: messageListLike,
    tone: 'like',
    unread: 3,
  },
  {
    title: '新增关注',
    body: '学霸小王关注了你',
    time: '昨天 18:45',
    icon: messageListFollow,
    tone: 'follow',
  },
  {
    title: '活动提醒',
    body: '你报名的“校园开放日”活动即将开始',
    time: '昨天 16:30',
    icon: messageListActivity,
    tone: 'activity',
    unread: 'dot',
  },
  {
    title: '校园卡消息',
    body: '校园卡余额不足20元，请及时充值',
    time: '05-17 12:11',
    icon: messageListCard,
    tone: 'card',
  },
  {
    title: '系统消息',
    body: '你的账号在新设备登录',
    time: '05-16 09:22',
    icon: messageListSystem,
    tone: 'system',
  },
]

const profileServiceItems = [
  { title: '个人信息', icon: profileSettingUser, tone: 'green' },
  { title: '课程表', icon: profileServiceCalendar, tone: 'blue' },
  { title: '我的收藏', icon: profileServiceBookmark, tone: 'orange' },
  { title: '问卷调查', icon: profileServiceClipboard, tone: 'purple' },
  { title: '实习就业', icon: profileServiceBriefcase, tone: 'blue' },
  { title: '意见反馈', icon: profileSettingMessage, tone: 'orange' },
  { title: '帮助中心', icon: profileSettingHelp, tone: 'green' },
  { title: '关于我们', icon: profileSettingInfo, tone: 'purple' },
  { title: '图书借阅', icon: profileServiceBook, tone: 'blue' },
  { title: '更多服务', icon: profileServiceMore, tone: 'gray' },
]

const profilePowerStats = [
  { label: '昨日用电', value: '3.2', unit: 'kWh' },
  { label: '日均用电', value: '2.7', unit: 'kWh' },
  { label: '本月用电', value: '128.5', unit: 'kWh' },
]
const profilePowerModules = ['学习互助', '二手交易', '食堂点评', '活动广场', '更多']
const profilePowerChartValues = [25, 32, 38, 30, 50, 62, 54, 46, 58, 52, 48]
const powerTrendValues = [14, 10, 20, 45, 60, 72, 66, 80, 76, 58, 34, 16]
const powerDetailHourlyValues = [
  18, 12, 16, 20, 18, 26, 22, 58, 44, 72, 66, 80, 52, 36, 40, 46, 38, 56,
  62, 50, 24, 18, 32, 40,
]
const latestHeadlines = headlines.slice(0, 1)

function App() {
  return (
    <HashRouter>
      <Studio />
    </HashRouter>
  )
}

function Studio() {
  const location = useLocation()
  const [showDesign, setShowDesign] = useState(false)
  const toggleDesign = useCallback(() => {
    setShowDesign((value) => !value)
  }, [])

  const currentLabel = useMemo(() => {
    const current = quickRoutes.find((item) => item.path === location.pathname)
    return current?.label ?? '首页'
  }, [location.pathname])

  const designFile = designFileMap[location.pathname] ?? 'UI设计总览图.png'

  return (
    <div className="studio-root">
      <header className="studio-toolbar">
        <div className="toolbar-copy">
          <p className="toolbar-title">LeafOne Forum UI 对齐实现</p>
          <p className="toolbar-subtitle">当前页面：{currentLabel}</p>
        </div>
        <button
          type="button"
          className={showDesign ? 'toggle-btn active' : 'toggle-btn'}
          onClick={toggleDesign}
        >
          {showDesign ? '关闭设计参考' : '打开设计参考'}
        </button>
      </header>

      <nav className="route-strip" aria-label="页面快捷切换">
        {quickRoutes.map((item) => (
          <Link
            key={item.path}
            className={location.pathname === item.path ? 'route-pill active' : 'route-pill'}
            to={item.path}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <section className="stage-wrap">
        <div className="phone-shell">
          <div className="phone-screen">
            <Routes>
              <Route path="/login" element={<MemoLoginPage />} />
              <Route path="/register" element={<MemoRegisterPage />} />
              <Route path="/" element={<MemoHomePage />} />
              <Route path="/discover" element={<MemoDiscoverPage />} />
              <Route path="/forum" element={<MemoForumPage />} />
              <Route path="/article" element={<MemoArticlePage />} />
              <Route path="/school" element={<MemoSchoolPage />} />
              <Route path="/services" element={<MemoServicesPage />} />
              <Route path="/messages" element={<MemoMessagesPage />} />
              <Route path="/profile" element={<MemoProfilePage />} />
              <Route path="/profile-power" element={<MemoProfilePowerPage />} />
              <Route path="/power-stats" element={<MemoPowerStatsPage />} />
              <Route path="/power-detail" element={<MemoPowerDetailPage />} />
              <Route path="*" element={<MemoHomePage />} />
            </Routes>

            {showDesign ? (
              <img
                alt={`${currentLabel}设计图`}
                className="design-overlay"
                src={`/designs/${designFile}`}
              />
            ) : null}
          </div>
        </div>

        <aside className="guide-card">
          <h2>对齐说明</h2>
          <p>此版本已经按设计图完成移动端结构、色彩体系、卡片布局和底部导航。</p>
          <p>你可以切换顶部页面查看各界面，打开“设计参考”观察叠加偏差并继续细调。</p>
          <ul>
            <li>画布基准：853 x 1844 比例</li>
            <li>组件策略：统一卡片 + 页面定制模块</li>
            <li>视觉方向：校园绿 + 轻玻璃层</li>
          </ul>
        </aside>
      </section>
    </div>
  )
}

type PhonePageProps = {
  activeTab?: TabKey
  children: ReactNode
  showBottomNav?: boolean
  className?: string
}

function PhonePage({
  activeTab,
  children,
  showBottomNav = true,
  className = '',
}: PhonePageProps) {
  return (
    <div className={`page-root ${className}`.trim()}>
      <div className="top-safe-area" />

      <div className="scroll-area">{children}</div>

      {showBottomNav ? <BottomNav activeTab={activeTab ?? 'home'} /> : null}
    </div>
  )
}

const BottomNav = memo(function BottomNav({ activeTab }: { activeTab: TabKey }) {
  const tabs = bottomTabs

  return (
    <footer className="bottom-nav">
      <Link to={tabs[0].to} className={tabs[0].key === activeTab ? 'tab-link active' : 'tab-link'}>
        <span className="tab-mark">{tabs[0].mark}</span>
        <span>{tabs[0].label}</span>
      </Link>
      <Link to={tabs[1].to} className={tabs[1].key === activeTab ? 'tab-link active' : 'tab-link'}>
        <span className="tab-mark">{tabs[1].mark}</span>
        <span>{tabs[1].label}</span>
      </Link>
      <button type="button" className="tab-plus" aria-label="发布">
        +
      </button>
      <Link to={tabs[2].to} className={tabs[2].key === activeTab ? 'tab-link active' : 'tab-link'}>
        <span className="tab-mark">{tabs[2].mark}</span>
        <span>{tabs[2].label}</span>
      </Link>
      <Link to={tabs[3].to} className={tabs[3].key === activeTab ? 'tab-link active' : 'tab-link'}>
        <span className="tab-mark">{tabs[3].mark}</span>
        <span>{tabs[3].label}</span>
      </Link>
    </footer>
  )
})

const SectionTitle = memo(function SectionTitle({ title, action }: { title: string; action?: string }) {
  return (
    <div className="section-title">
      <h3>{title}</h3>
      {action ? <button type="button">{action}</button> : null}
    </div>
  )
})

function AuthBrand({ compact = false }: { compact?: boolean }) {
  return (
    <section className={compact ? 'auth-brand compact' : 'auth-brand'}>
      <img className="auth-logo" src={authLogo} alt="" />
      <div>
        <h1>城院圈</h1>
        <p>武汉城市学院论坛</p>
      </div>
    </section>
  )
}

function AuthField({
  icon,
  label,
  action,
  extra,
  extraIcon,
  input,
  password,
}: {
  icon: string
  label: string
  action?: string
  extra?: string
  extraIcon?: string
  input?: boolean
  password?: boolean
}) {
  return (
    <div className="auth-field">
      <img className="auth-field-icon" src={icon} alt="" />
      {input ? <input type={password ? 'password' : 'text'} placeholder={label} /> : <span>{label}</span>}
      {action ? <em>{action}</em> : null}
      {extra ? <strong>{extra}</strong> : null}
      {extraIcon ? <img className="auth-field-extra" src={extraIcon} alt="" /> : null}
    </div>
  )
}

function LoginPage() {
  const navigate = useNavigate()

  return (
    <PhonePage showBottomNav={false} className="auth-page login-auth-page">
      <img className="auth-bg-image login-auth-bg" src={authBgImage} alt="" />
      <div className="auth-bg-fade" />

      <AuthBrand />

      <section className="auth-card login-auth-card">
        <h2>欢迎回来</h2>
        <p>登录城院圈，发现校园新鲜事</p>

        <AuthField icon={authIconUser} label="学号 / 手机号" input />
        <AuthField icon={authIconLock} label="密码" input password extraIcon={authIconEyeOff} />

        <div className="auth-option-row">
          <span className="auth-remember">
            <i>✓</i>
            记住登录
          </span>
          <span>忘记密码？</span>
        </div>

        <button type="button" className="auth-primary-btn" onClick={() => navigate('/', { replace: true })}>
          登录
        </button>
        <button type="button" className="auth-outline-btn" onClick={() => navigate('/register', { replace: true })}>
          去注册
        </button>

        <div className="auth-divider">
          <span />
          <em>或使用以下方式登录</em>
          <span />
        </div>

        <div className="auth-social-row">
          <div className="auth-social-item">
            <span>
              <img src={authIconWechat} alt="" />
            </span>
            <p>微信登录</p>
          </div>
          <div className="auth-social-item">
            <span>
              <img src={authIconShield} alt="" />
            </span>
            <p>校园统一认证</p>
          </div>
        </div>
      </section>

      <footer className="auth-footer">
        <span>武汉城市学院论坛 · 城院圈</span>
        <span>© 2024 Wuhan City College</span>
      </footer>
    </PhonePage>
  )
}

function RegisterPage() {
  const navigate = useNavigate()

  return (
    <PhonePage showBottomNav={false} className="auth-page register-auth-page">
      <img className="auth-bg-image register-auth-bg" src={authBgImage} alt="" />
      <div className="auth-bg-fade register-auth-fade" />

      <button type="button" className="auth-back-btn" aria-label="返回" onClick={() => navigate('/login', { replace: true })}>
        <img src={authIconBack} alt="" />
      </button>

      <AuthBrand compact />

      <section className="auth-card register-auth-card">
        <h2>新用户注册</h2>
        <p>加入城院圈，连接更多城院人</p>

        <div className="register-field-list">
          {registerFieldItems.map((item) => (
            <AuthField key={item.label} {...item} />
          ))}
        </div>

        <div className="register-agree-row">
          <i />
          <span>
            我已阅读并同意
            <b>《用户协议》</b>
            <b>《隐私政策》</b>
          </span>
        </div>

        <button type="button" className="auth-primary-btn register-submit-btn">注册并进入</button>

        <div className="register-login-tip">
          <span>已有账号？</span>
          <button type="button" onClick={() => navigate('/login', { replace: true })}>去登录</button>
        </div>
      </section>
    </PhonePage>
  )
}

function HomePage() {
  const [searchValue, setSearchValue] = useState('')
  const [searchKeyword, setSearchKeyword] = useState('')
  const visibleHeadlines = useMemo(() => getHomeHeadlineMatches(searchKeyword), [searchKeyword])
  const isSearching = searchKeyword.trim().length > 0

  const handleSearchSubmit = () => {
    setSearchKeyword(searchValue.trim())
  }

  const handleSearchClear = () => {
    setSearchValue('')
    setSearchKeyword('')
  }

  return (
    <PhonePage activeTab="home" className="home-page">
      <section className="hero-block">
        <div className="hero-copy">
          <p className="sub-copy">你好，欢迎来到</p>
          <h1>武汉城市学院论坛</h1>
          <p className="small-copy">WUHAN CITY COLLEGE</p>
        </div>

        <div className={`search-box hero-search-box${isSearching ? ' is-searching' : ''}`}>
          <span className="search-line-icon" />
          <input
            className="search-input"
            value={searchValue}
            placeholder="搜索帖子、话题、用户..."
            onChange={(event) => setSearchValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearchSubmit()
              }
            }}
          />
          {searchValue || isSearching ? (
            <button type="button" className="search-clear" aria-label="清空搜索" onClick={handleSearchClear} />
          ) : null}
          <button type="button" className="search-submit-button" aria-label="搜索" onClick={handleSearchSubmit}>
            <span className="scan-line-icon" />
          </button>
        </div>
      </section>

      <section className="card shortcut-grid home-shortcut-card">
        {shortcutModules.map((label) => (
          <button type="button" key={label} className="module-btn">
            <span className="module-icon" />
            <span>{label}</span>
          </button>
        ))}
      </section>

      <div className="section-title home-headline-title">
        <h3>{isSearching ? '搜索结果' : '校园头条'}</h3>
        {isSearching ? (
          <button type="button" onClick={handleSearchClear}>清空</button>
        ) : (
          <button type="button">
            <span>更多</span>
            <img className="section-chevron" src={chevronRightMuted} alt="" />
          </button>
        )}
      </div>

      <section className="news-list home-news-list">
        {visibleHeadlines.length ? visibleHeadlines.map((item) => (
          <article key={item.title} className="news-row">
            <div className="news-copy">
              <div className="news-title-row">
                <h4>{item.title}</h4>
                {item.pinned ? <span className="news-tag">置顶</span> : null}
              </div>
              <p>{item.summary}</p>
              <div className="news-meta-row">
                <span>{item.date}</span>
                <span>{item.views}</span>
              </div>
            </div>
            <img className="thumb" src={item.image} alt="" />
          </article>
        )) : (
          <div className="search-empty-state">暂无相关内容</div>
        )}
      </section>

      <Link to="/school" className="promo-banner home-open-banner">
        <img className="banner-bg-image" src={homeOpenBannerBg} alt="" />
        <div className="banner-copy">
          <strong>校园开放日</strong>
          <p>相约城院，共赴未来</p>
        </div>
        <span className="banner-arrow-wrap">
          <img className="banner-arrow" src={chevronRightPrimary} alt="" />
        </span>
      </Link>
    </PhonePage>
  )
}

function DiscoverPage() {
  return (
    <PhonePage activeTab="discover" className="discover-page">
      <header className="top-header">
        <div>
          <h2>发现</h2>
          <p>发现更多有趣的内容</p>
        </div>
        <button type="button" className="icon-button">
          S
        </button>
      </header>

      <section className="list-stack">
        {discoverItems.map(([title, desc, count]) => (
          <article key={title} className="card discover-item">
            <div className="disc-icon" />
            <div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
            <span>{count}</span>
          </article>
        ))}
      </section>

      <Link to="/article" className="promo-banner">
        <div>
          <strong>校园开放日</strong>
          <p>相约城院，共赴未来</p>
        </div>
        <span className="banner-arrow">&gt;</span>
      </Link>
    </PhonePage>
  )
}

function ForumPage() {
  const navigate = useNavigate()

  const openArticle = () => {
    navigate('/article')
  }

  const handleArticleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openArticle()
    }
  }

  return (
    <PhonePage activeTab="forum" className="forum-page">
      <section className="forum-hero">
        <div className="forum-hero-copy">
          <h2>校园论坛</h2>
          <p>连接你我，分享校园生活</p>
        </div>

        <div className="forum-search-box">
          <span className="forum-search-line-icon" />
          <input type="text" aria-label="搜索论坛内容" placeholder="搜索帖子、话题、用户..." />
          <button type="button" aria-label="搜索">
            <span className="forum-scan-line-icon" />
          </button>
        </div>

        <section className="card forum-module-card">
          {forumModules.map((item) => (
            <button key={item.label} type="button" className={`forum-module-item ${item.tone}`}>
              <span className="forum-module-icon">
                <img src={item.icon} alt="" />
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </section>
      </section>

      <div className="forum-section-title-row">
        <h3>热门话题</h3>
        <button type="button">
          <span>更多</span>
          <img src={chevronRightMuted} alt="" />
        </button>
      </div>
      <div className="forum-topic-row">
        {forumTopicLabels.map((topic, index) => (
          <button key={topic.label} type="button" className={`forum-topic-chip tone-${index % 4}`}>
            <strong>{topic.label}</strong>
            <span>
              <img className="forum-topic-fire" src={forumIconFlameBold} alt="" />
              {topic.heat}
            </span>
          </button>
        ))}
      </div>

      <div className="forum-filter-row">
        <div className="forum-tabs">
          <button type="button" className="active">
            最新
          </button>
          <button type="button">推荐</button>
          <button type="button">关注</button>
        </div>
        <button type="button" className="forum-sort-btn">
          最新发布
          <span />
        </button>
      </div>

      <section className="forum-feed-list">
        {forumPosts.map((post) => (
          <article
            key={post.title}
            className="forum-post-card"
            role="link"
            tabIndex={0}
            onClick={openArticle}
            onKeyDown={handleArticleKeyDown}
          >
            <header className="forum-post-head">
              <span className={`forum-post-avatar ${post.avatarTone}`}>
                <img className="forum-post-avatar-img" src={post.avatar} alt={`${post.author}头像`} />
              </span>
              <div className="forum-post-author-block">
                <div className="forum-post-author-row">
                  <h4>{post.author}</h4>
                  <span className="forum-post-badge">
                    <img src={forumIconBadgePin} alt="" />
                    {post.badge}
                  </span>
                </div>
                <p>{post.meta}</p>
              </div>
              <button
                type="button"
                className="forum-post-more"
                aria-label="更多"
              >
                ...
              </button>
            </header>

            <div className="forum-post-body">
              <div className="forum-post-main">
                <span className="forum-post-title">{post.title}</span>
                <p>{post.summary}</p>
                {post.price ? (
                  <strong className="forum-post-price">{post.price}</strong>
                ) : (
                  <span className="forum-post-module-badge">{post.module}</span>
                )}
              </div>
              <div className="forum-post-cover">
                {post.coverType === 'bike' ? (
                  <img src={headline2Img} alt="" />
                ) : (
                  <div className="forum-python-cover">
                    <strong>PYTHON</strong>
                    <span>学习资料包</span>
                    <small>PDF</small>
                  </div>
                )}
              </div>
            </div>

            <footer className="forum-post-stats">
              <span>
                <img className="forum-stat-icon" src={forumIconStatShare} alt="" />
                {post.stats[0]}
              </span>
              <span>
                <img className="forum-stat-icon" src={forumIconStatComment} alt="" />
                {post.stats[1]}
              </span>
              <span>
                <img className="forum-stat-icon" src={forumIconStatLike} alt="" />
                {post.stats[2]}
              </span>
            </footer>
          </article>
        ))}
      </section>
    </PhonePage>
  )
}

function ArticlePage() {
  return (
    <PhonePage className="article-page" showBottomNav={false}>
      <header className="article-top-nav">
        <Link to="/forum" className="article-back-button" aria-label="返回论坛">
          <span />
        </Link>
        <button type="button" className="article-more-button" aria-label="更多">
          •••
        </button>
      </header>

      <article className="article-content-flow">
        <section className="article-author-section">
          <img className="article-author-avatar" src={articleAuthorAvatar} alt="计算机小林学长头像" />
          <div className="article-author-main">
            <div className="article-author-name-row">
              <h4>计算机小林学长</h4>
              <span>
                <i />
                学长
              </span>
            </div>
            <p>计算机学院 · 软件工程专业</p>
            <p>05-18 14:32　发布于 校园论坛</p>
          </div>
          <button type="button" className="article-follow-button">＋ 关注</button>
        </section>

        <h1>Python期末复习资料整理（附网盘）</h1>

        <div className="article-module-chip">
          <span>♟</span>
          学习互助
          <b>›</b>
        </div>

        <p className="article-paragraph">
          整理了一些Python期末复习资料和习题，包含重点知识点总结、常见题型解析、模拟试卷等，希望对大家有帮助～
        </p>

        <p className="article-folder-title">📁 资料目录如下：</p>
        <ol className="article-number-list">
          <li>Python重点知识总结.pdf</li>
          <li>常见题型与解析.pdf</li>
          <li>模拟试卷（含答案）.pdf</li>
          <li>实验报告模板.docx</li>
        </ol>

        <p className="article-link-line">
          网盘链接：
          <a href="https://pan.baidu.com/s/xxxxxx">https://pan.baidu.com/s/xxxxxx</a>
        </p>
        <p className="article-code-line">提取码： py666</p>
        <p className="article-wish-line">祝大家期末顺利，取得好成绩！ 💪</p>

        <section className="article-file-card">
          {articleAttachments.map((item) => (
            <div key={item.name} className="article-file-row">
              <img className="article-file-type-icon" src={item.icon} alt="" />
              <div>
                <h5>{item.name}</h5>
                <p>{item.size}</p>
              </div>
              <button type="button" aria-label={`下载${item.name}`}>↓</button>
            </div>
          ))}
        </section>

        <div className="article-location-pill">
          <i />
          计算机学院教学楼 3号楼
        </div>

        <footer className="article-action-row">
          <span>↗ 12</span>
          <span>☰ 48</span>
          <span>♡ 96</span>
          <span>☆ 收藏</span>
        </footer>
      </article>

      <section className="article-comments-panel">
        <header>
          <h3>全部评论（48）</h3>
          <button type="button">默认排序⌄</button>
        </header>
        <article className="article-comment-item">
          <img src={articleCommentAvatar} alt="奶茶不加糖头像" />
          <div>
            <div className="article-comment-name-row">
              <h4>奶茶不加糖</h4>
              <span>● 大二</span>
            </div>
            <p>太棒了！正好需要，感谢学长分享～</p>
            <footer>
              <time>05-18 14:45</time>
              <span>☰ 回复</span>
              <span>♡ 8</span>
            </footer>
          </div>
        </article>
      </section>

      <footer className="article-comment-dock">
        <input type="text" value="写下你的评论..." readOnly />
        <span>☺</span>
        <span>▧</span>
      </footer>
    </PhonePage>
  )
}

function SchoolPage() {
  return (
    <PhonePage activeTab="home" className="school-page">
      <header className="center-nav">
        <Link to="/" className="icon-button">
          &lt;
        </Link>
        <h2>学校介绍</h2>
        <button type="button" className="icon-button">
          S
        </button>
      </header>

      <article className="card school-card">
        <h3>武汉城市学院</h3>
        <p>
          武汉城市学院是经教育部批准设立的全日制普通本科高校。
          学校坐落于武汉东湖之滨，环境优美，风景秀丽。
        </p>

        <div className="stats-row">
          <div>
            <strong>22年</strong>
            <span>办学历史</span>
          </div>
          <div>
            <strong>12个</strong>
            <span>教学单位</span>
          </div>
          <div>
            <strong>16000+</strong>
            <span>在校学生</span>
          </div>
        </div>

        <h4>发展历程</h4>
        <ul className="timeline">
          <li>
            <span>2002</span>
            <p>原武汉科技大学城市学院成立</p>
          </li>
          <li>
            <span>2011</span>
            <p>独立学院转设</p>
          </li>
          <li>
            <span>2021</span>
            <p>转设更名为武汉城市学院</p>
          </li>
          <li>
            <span>未来</span>
            <p>向着更高目标不断前行</p>
          </li>
        </ul>
      </article>
    </PhonePage>
  )
}

function ServicesPage() {
  return (
    <PhonePage activeTab="forum" className="services-page">
      <header className="top-header">
        <div>
          <h2>校园服务</h2>
          <p>便捷服务，一站直达</p>
        </div>
        <button type="button" className="icon-button">
          S
        </button>
      </header>

      <section className="card map-card">
        {serviceMapPins.map((label) => (
          <span key={label} className="map-pin">
            {label}
          </span>
        ))}
      </section>

      <SectionTitle title="我的常用" action="编辑" />
      <section className="card service-grid">
        {commonServices.map((item) => (
          <button type="button" key={item} className="service-tile">
            <span className="service-dot" />
            <span>{item}</span>
          </button>
        ))}
      </section>

      <section className="card notice-row">
        <strong>校园公告</strong>
        <p>关于2024年五一放假安排的通知</p>
      </section>

      <SectionTitle title="服务分类" />
      <section className="service-category-row">
        {serviceCategories.map((item) => (
          <article key={item} className="card category-card">
            <h4>{item}</h4>
            <p>点击查看</p>
          </article>
        ))}
      </section>
    </PhonePage>
  )
}

function MessagesPage() {
  return (
    <PhonePage activeTab="messages" className="messages-page">
      <div className="message-hero">
        <header className="top-header">
          <div>
            <h2>消息</h2>
            <p>及时掌握校园最新动态</p>
          </div>
          <button type="button" className="icon-button">
            O
          </button>
        </header>

        <section className="card message-highlight-row">
          {messageHighlights.map((item) => (
            <button type="button" key={item.label} className="highlight-item">
              <span className={`highlight-icon-wrap ${item.tone}`}>
                <img className="highlight-icon" src={item.icon} alt="" />
                {item.unread ? <span className="highlight-badge">{item.unread}</span> : null}
              </span>
              <span>{item.label}</span>
            </button>
          ))}
        </section>
      </div>

      <div className="section-title message-section-title">
        <h3>消息列表</h3>
        <div className="message-title-actions">
          <button type="button">
            <span className="message-title-icon read" />
            全部已读
          </button>
          <button type="button">
            <span className="message-title-icon filter" />
            筛选
          </button>
        </div>
      </div>
      <section className="message-list">
        {messageRows.map((item) => (
          <article key={item.title} className="message-row">
            <span className={`message-dot ${item.tone}`}>
              <img className="message-row-icon" src={item.icon} alt="" />
            </span>
            <div>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </div>
            <div className="message-row-tail">
              <time>{item.time}</time>
              {item.unread ? (
                <span className={item.unread === 'dot' ? 'message-unread small' : 'message-unread'}>
                  {item.unread === 'dot' ? '' : item.unread}
                </span>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </PhonePage>
  )
}

function ProfilePage() {
  const navigate = useNavigate()

  return (
    <PhonePage activeTab="profile" className="profile-page">
      <section className="profile-user-header">
        <img
          className="profile-avatar-img"
          src="https://image.opxqo.cn/avatar/eg/001.webp"
          alt="林一航头像"
        />
        <div className="profile-user-main">
          <div className="profile-name-row">
            <h3>林一航</h3>
            <span className="profile-verify-pill">
              <img src={profileIconVerify} alt="" />
              学生认证
            </span>
          </div>
          <p>计算机学院 · 2021级</p>
        </div>
      </section>

      <section className="profile-power-card">
        <div className="profile-power-summary">
          <div className="profile-power-copy">
            <h3>宿舍用电</h3>
            <p className="profile-room-line">
              <img src={profileIconPinWhite} alt="" />
              桂园6舍 305
            </p>
            <div className="profile-power-value-line">
              <strong>128.5</strong>
              <span>kWh</span>
            </div>
            <p>本月用电</p>
            <p>本月预计: 186.7 kWh</p>
          </div>

          <img className="profile-power-meter" src={profileChargingIcon} alt="" />
        </div>

        <div className="profile-chart-panel">
          <div className="profile-chart-title-row">
            <strong>72小时用电趋势</strong>
            <span>(kWh)</span>
          </div>
          <div className="profile-chart-area">
            <div className="profile-chart-axis">
              <span>3.0</span>
              <span>2.0</span>
              <span>1.0</span>
              <span>0</span>
            </div>
            <div className="profile-chart-main">
              <img className="profile-chart-svg" src={profilePowerChart} alt="" />
              <div className="profile-chart-dates">
                <span>05/16 00:00</span>
                <span>05/17 00:00</span>
                <span>05/18 00:00</span>
                <span>05/19 00:00</span>
              </div>
            </div>
          </div>
          <div className="profile-power-stats">
            {profilePowerStats.map((item) => (
              <div key={item.label} className="profile-power-stat">
                <span>{item.label}</span>
                <p>
                  <strong>{item.value}</strong>
                  {item.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="profile-panel profile-services-panel">
        <h3>我的服务</h3>
        <div className="profile-service-grid">
        {profileServiceItems.map((item) => (
          <button type="button" key={item.title} className="profile-service-item">
            <span className={`profile-service-icon-wrap ${item.tone}`}>
              <img src={item.icon} alt="" />
            </span>
            <span>{item.title}</span>
          </button>
        ))}
        </div>
      </section>

      <button type="button" className="profile-logout-btn" onClick={() => navigate('/login', { replace: true })}>
        <img src={profileIconLogout} alt="" />
        退出登录
      </button>
    </PhonePage>
  )
}

function ProfilePowerPage() {
  return (
    <PhonePage activeTab="home" className="profile-power-page">
      <section className="profile-user card">
        <span className="avatar" />
        <div>
          <h3>林一航</h3>
          <p>计算机学院 · 2021级</p>
        </div>
        <button type="button" className="icon-button">
          N
        </button>
      </section>

      <section className="card power-card">
        <header>
          <h4>宿舍用电</h4>
          <p>桂园8舍 305</p>
        </header>
        <div className="power-main">
          <strong>128.5</strong>
          <span>kWh</span>
        </div>

        <div className="line-chart soft">
          {profilePowerChartValues.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="line-bar"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>

        <div className="power-stats">
          <div>
            <strong>3.2</strong>
            <span>昨日用电</span>
          </div>
          <div>
            <strong>2.7</strong>
            <span>日均用电</span>
          </div>
          <div>
            <strong>128.5</strong>
            <span>本月用电</span>
          </div>
        </div>
      </section>

      <section className="card forum-module-row">
        {profilePowerModules.map((label) => (
          <button key={label} type="button" className="mini-pill">
            {label}
          </button>
        ))}
      </section>

      <Link to="/school" className="promo-banner">
        <div>
          <strong>校园开放日</strong>
          <p>相约城院，共赴未来</p>
        </div>
        <span className="banner-arrow">&gt;</span>
      </Link>

      <SectionTitle title="学校动态" action="全部" />
      <section className="card news-list">
        {latestHeadlines.map((item) => (
          <article key={item.title} className="news-row">
            <div>
              <h4>{item.title}</h4>
              <p>{item.meta}</p>
            </div>
            <span className="thumb" />
          </article>
        ))}
      </section>
    </PhonePage>
  )
}

function PowerStatsPage() {
  return (
    <PhonePage className="power-page" showBottomNav={false}>
      <header className="center-nav compact-gap">
        <Link to="/profile-power" className="icon-button">
          &lt;
        </Link>
        <h2>用电统计</h2>
        <button type="button" className="icon-button">
          ?
        </button>
      </header>

      <div className="segmented">
        <button type="button" className="active">
          日
        </button>
        <button type="button">周</button>
        <button type="button">月</button>
        <button type="button">年</button>
      </div>

      <section className="summary-board">
        <article>
          <p>当日用电量</p>
          <strong>128.6 kWh</strong>
          <span>较昨日 +8.3%</span>
        </article>
        <article>
          <p>当日费用</p>
          <strong>89.02 元</strong>
          <span>较昨日 +6.7%</span>
        </article>
        <article>
          <p>当日人均</p>
          <strong>0.45 kWh</strong>
          <span>较上月 +8.9%</span>
        </article>
      </section>

      <section className="card chart-card">
        <SectionTitle title="用电量趋势（kWh）" />
        <div className="line-chart">
          {powerTrendValues.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="line-bar"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      </section>

      <section className="card pie-layout">
        <div className="pie-chart" />
        <ul>
          <li>照明用电 45.2 kWh</li>
          <li>空调用电 38.6 kWh</li>
          <li>插座用电 28.7 kWh</li>
          <li>其他用电 16.1 kWh</li>
        </ul>
      </section>

      <section className="advice-row">
        <article className="card advice green">
          <h4>较昨日</h4>
          <strong>+8.3%</strong>
          <p>139.8 kWh</p>
        </article>
        <article className="card advice blue">
          <h4>较上周同日</h4>
          <strong>+12.7%</strong>
          <p>147.5 kWh</p>
        </article>
        <article className="card advice orange">
          <h4>较上月同日</h4>
          <strong>+5.6%</strong>
          <p>121.8 kWh</p>
        </article>
      </section>
    </PhonePage>
  )
}

function PowerDetailPage() {
  return (
    <PhonePage className="power-detail-page" showBottomNav={false}>
      <header className="center-nav compact-gap">
        <Link to="/power-stats" className="icon-button">
          &lt;
        </Link>
        <h2>用电详情</h2>
        <button type="button" className="icon-button">
          i
        </button>
      </header>

      <div className="segmented">
        <button type="button" className="active">
          日
        </button>
        <button type="button">周</button>
        <button type="button">月</button>
        <button type="button">年</button>
      </div>

      <section className="detail-hero">
        <div>
          <p>当日用电</p>
          <strong>3.2</strong>
          <span>kWh</span>
          <small>较昨日 +8.6%</small>
        </div>
        <div className="leaf-shape" />
      </section>

      <section className="card chart-card">
        <SectionTitle title="24小时用电分布" />
        <div className="bar-chart">
          {powerDetailHourlyValues.map((value, index) => (
            <span
              key={`${value}-${index}`}
              className="hour-bar"
              style={{ height: `${value}%` }}
            />
          ))}
        </div>
      </section>

      <section className="card detail-data-grid">
        <article>
          <p>本月用电</p>
          <strong>128.5 kWh</strong>
          <span>较上月 +12.3%</span>
        </article>
        <article>
          <p>日均用电</p>
          <strong>2.7 kWh</strong>
          <span>较上月 +6.1%</span>
        </article>
        <article>
          <p>本月预计电费</p>
          <strong>186.7 元</strong>
          <span>较上月 +10.8%</span>
        </article>
      </section>

      <section className="card tip-box">
        <h4>用电小贴士</h4>
        <p>午间用电高峰时段较多，建议错峰使用大功率电器，节能又省电。</p>
      </section>
    </PhonePage>
  )
}

const MemoLoginPage = memo(LoginPage)
const MemoRegisterPage = memo(RegisterPage)
const MemoHomePage = memo(HomePage)
const MemoDiscoverPage = memo(DiscoverPage)
const MemoForumPage = memo(ForumPage)
const MemoArticlePage = memo(ArticlePage)
const MemoSchoolPage = memo(SchoolPage)
const MemoServicesPage = memo(ServicesPage)
const MemoMessagesPage = memo(MessagesPage)
const MemoProfilePage = memo(ProfilePage)
const MemoProfilePowerPage = memo(ProfilePowerPage)
const MemoPowerStatsPage = memo(PowerStatsPage)
const MemoPowerDetailPage = memo(PowerDetailPage)

export default App
