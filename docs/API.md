# LeafOne Forum API 文档

> Base URL: `http://<host>:9090/api/v1`
> 统一响应格式，认证方式为 Bearer Token

---

## 目录

- [通用规范](#通用规范)
- [认证模块](#1-认证模块-auth)
- [首页模块](#2-首页模块-home)
- [搜索模块](#3-搜索模块-search)
- [版块模块](#4-版块模块-modules)
- [论坛概览](#5-论坛概览-forum)
- [帖子模块](#6-帖子模块-posts)
- [评论模块](#7-评论模块-comments)
- [互动模块](#8-互动模块-reactions)
- [消息模块](#9-消息模块-messages)
- [个人中心](#10-个人中心-me)
- [上传模块](#11-上传模块-uploads)
- [后台管理](#12-后台管理-admin)
  - [12.9 通知管理](#129-通知管理)
  - [12.10 日志查看](#1210-日志查看)

---

## 通用规范

### 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "requestId": null
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `code` | int | 状态码，`0` 表示成功 |
| `message` | string | 提示信息 |
| `data` | any | 响应数据 |
| `requestId` | string/null | 请求追踪 ID |

### 分页响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [],
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "hasMore": false
  }
}
```

### 错误码

| code | 含义 |
|---|---|
| `0` | 成功 |
| `40000` | 参数错误 |
| `40100` | 未登录 / 认证失败 |
| `40300` | 无权限 |
| `40400` | 资源不存在 |
| `40900` | 冲突（如重复点赞） |
| `42900` | 请求过于频繁 |
| `50000` | 服务器内部错误 |

### 认证方式

登录后获取 `accessToken`，后续请求在 Header 中携带：

```
Authorization: Bearer <accessToken>
```

### 公共数据模型

#### User 用户对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 用户 ID |
| `openid` | string | 微信 openid |
| `phone` | string | 手机号 |
| `studentNo` | string | 学号 |
| `dorm` | string/null | 宿舍 |
| `nickname` | string | 昵称 |
| `avatarUrl` | string | 头像 URL |
| `gender` | int | 性别：0=未知 1=男 2=女 |
| `role` | string | 角色：`USER` / `ADMIN` |
| `status` | int | 状态：1=正常 2=封禁 |
| `lastLoginAt` | string | 最后登录时间 |
| `createdAt` | string | 注册时间 |

#### Post 帖子对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 帖子 ID |
| `authorId` | long | 作者 ID |
| `moduleId` | long | 所属版块 ID |
| `title` | string | 标题 |
| `summary` | string | 摘要 |
| `content` | string | 正文内容 |
| `coverUrl` | string/null | 封面图 URL |
| `coverType` | string/null | 封面类型 |
| `price` | number/null | 价格（二手交易） |
| `locationName` | string/null | 位置名称 |
| `status` | int | 状态：0=草稿 1=已发布 2=审核中 3=已拒绝 4=已下架 |
| `isPinned` | int | 是否置顶 |
| `isFeatured` | int | 是否精选 |
| `viewCount` | int | 浏览数 |
| `shareCount` | int | 分享数 |
| `commentCount` | int | 评论数 |
| `likeCount` | int | 点赞数 |
| `favoriteCount` | int | 收藏数 |
| `publishedAt` | string | 发布时间 |
| `createdAt` | string | 创建时间 |

#### Module 版块对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 版块 ID |
| `code` | string | 版块编码（如 `learn` `trade` `canteen`） |
| `name` | string | 版块名称 |
| `description` | string | 描述 |
| `iconKey` | string | 图标标识 |
| `sortOrder` | int | 排序 |
| `postCountToday` | int | 今日发帖数 |
| `enabled` | int | 是否启用 |

#### PostComment 评论对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 评论 ID |
| `postId` | long | 帖子 ID |
| `userId` | long | 评论者 ID |
| `parentId` | long/null | 父评论 ID（回复） |
| `replyToUserId` | long/null | 被回复用户 ID |
| `content` | string | 评论内容 |
| `likeCount` | int | 点赞数 |
| `status` | int | 状态：1=正常 2=审核中 3=已删除 |
| `createdAt` | string | 创建时间 |

#### Topic 话题对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 话题 ID |
| `name` | string | 话题名称 |
| `description` | string | 描述 |
| `heatScore` | int | 热度值 |
| `postCount` | int | 关联帖子数 |

#### HomeHeadline 头条对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | ID |
| `title` | string | 标题 |
| `summary` | string | 摘要 |
| `coverUrl` | string | 封面图 URL |
| `targetType` | string | 目标类型：`POST` / `ACTIVITY` / `URL` |
| `isPinned` | int | 是否置顶 |
| `viewCount` | int | 浏览量 |
| `publishedAt` | string | 发布时间 |

#### Message 消息对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 消息 ID |
| `userId` | long | 接收者 ID |
| `senderId` | long/null | 发送者 ID |
| `type` | string | 类型：`NOTICE`/`REPLY`/`LIKE`/`FOLLOW`/`SYSTEM` |
| `title` | string | 标题 |
| `content` | string | 内容 |
| `targetType` | string/null | 跳转目标类型 |
| `targetId` | long/null | 跳转目标 ID |
| `readAt` | string/null | 阅读时间 |
| `createdAt` | string | 创建时间 |

#### Feedback 反馈对象

| 字段 | 类型 | 说明 |
|---|---|---|
| `id` | long | 反馈 ID |
| `userId` | long | 提交者 ID |
| `content` | string | 反馈内容 |
| `contact` | string/null | 联系方式 |
| `status` | string | 处理状态：`PENDING`/`RESOLVED`/`REJECTED` |
| `createdAt` | string | 创建时间 |

---

## 1. 认证模块 `/auth`

### 1.1 账号密码登录

```
POST /api/v1/auth/login
```

**不需要认证**

请求体：

```json
{
  "studentNo": "2021001",
  "phone": "13800138000",
  "password": "123456"
}
```

> `studentNo` 和 `phone` 至少提供一个

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "userId": 4002,
    "role": "USER"
  }
}
```

### 1.2 微信小程序登录

```
POST /api/v1/auth/wechat-login
```

**不需要认证**

请求体：

```json
{
  "code": "wx_login_code"
}
```

> `code` 为前端调用 `wx.login()` 返回的临时凭证，后端通过 `auth.code2Session` 换取 `openid` 完成登录

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "userId": 4002,
    "role": "USER",
    "newUser": false,
    "studentVerified": true
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `accessToken` | string | 访问令牌（2小时有效） |
| `refreshToken` | string | 刷新令牌（7天有效） |
| `userId` | long | 用户 ID |
| `role` | string | 角色 |
| `newUser` | boolean | 是否为本次登录新创建的用户 |
| `studentVerified` | boolean | 学生认证是否已通过 |

> 新用户自动创建账号，分配随机头像和昵称（如"微信用户3331"）
> `studentVerified` 为 `false` 时用户可浏览但不能发帖，需先完成学生认证

### 1.3 学生注册

```
POST /api/v1/auth/register
```

**不需要认证**

请求体：

```json
{
  "realName": "张三",
  "studentNo": "2022001",
  "college": "计算机学院",
  "major": "计算机科学与技术",
  "grade": "2022",
  "phone": "13800138001",
  "password": "abc123456"
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `realName` | 是 | 真实姓名 |
| `studentNo` | 是 | 学号 |
| `college` | 是 | 学院 |
| `major` | 否 | 专业 |
| `grade` | 否 | 年级 |
| `phone` | 否 | 手机号 |
| `password` | 是 | 密码 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 1.4 登出

```
POST /api/v1/auth/logout
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 1.5 刷新令牌

```
POST /api/v1/auth/refresh
```

**不需要认证**

请求体：

```json
{
  "refreshToken": "eyJhbGci..."
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `refreshToken` | 是 | 登录时返回的刷新令牌 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "userId": 4002,
    "role": "USER"
  }
}
```

> 刷新令牌为一次性使用，刷新后旧令牌失效，返回新的 access + refresh 令牌对

### 1.6 学生认证

```
POST /api/v1/auth/verify-student
```

**需要认证**

请求体：

```json
{
  "realName": "张三",
  "studentNo": "2024001",
  "college": "计算机学院",
  "major": "软件工程",
  "grade": "2024"
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `realName` | 是 | 真实姓名 |
| `studentNo` | 是 | 学号 |
| `college` | 是 | 学院 |
| `major` | 否 | 专业 |
| `grade` | 否 | 入学年份 |

> 提交后等待管理员审核，审核通过后 `studentVerified` 变为 `true`

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 2. 首页模块 `/home`

### 2.1 首页聚合数据

```
GET /api/v1/home
```

**不需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "headlines": [
      {
        "id": 3001,
        "title": "关于2026年春季学期期末考试安排的通知",
        "summary": "各学院各部门...",
        "coverUrl": "https://...",
        "targetType": "POST",
        "isPinned": 1,
        "viewCount": 1234,
        "publishedAt": "2026-04-29T16:42:18"
      }
    ],
    "latestPosts": [
      {
        "id": 6001,
        "title": "Python期末复习笔记分享",
        "summary": "整理了本学期的重点知识",
        "coverUrl": "https://...",
        "viewCount": 156,
        "likeCount": 45,
        "commentCount": 8,
        "publishedAt": "2026-04-29T16:43:02"
      }
    ]
  }
}
```

---

## 3. 搜索模块 `/search`

### 3.1 搜索

```
GET /api/v1/search
```

**不需要认证**

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `keyword` | 否 | `""` | 搜索关键词 |
| `type` | 否 | `"all"` | 搜索类型（预留） |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "items": [
      { "id": 6001, "title": "Python期末复习笔记分享", ... }
    ],
    "page": 1,
    "pageSize": 20,
    "total": 1,
    "hasMore": false
  }
}
```

---

## 4. 版块模块 `/modules`

### 4.1 获取版块列表

```
GET /api/v1/modules
```

**不需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "id": 1001,
      "code": "learn",
      "name": "学习交流",
      "description": "课程笔记考试复习学术讨论",
      "iconKey": "study",
      "sortOrder": 1,
      "postCountToday": 0,
      "enabled": 1
    }
  ]
}
```

---

## 5. 论坛概览 `/forum`

### 5.1 论坛聚合数据

```
GET /api/v1/forum/overview
```

**不需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "modules": [
      { "id": 1001, "code": "learn", "name": "学习交流", ... }
    ],
    "hotTopics": [
      {
        "id": 2001,
        "name": "期末复习",
        "description": "期末备考交流",
        "heatScore": 95,
        "postCount": 120
      }
    ]
  }
}
```

---

## 6. 帖子模块 `/posts`

### 6.1 帖子列表

```
GET /api/v1/posts
```

**不需要认证**（`feed=following` 需要登录）

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `moduleId` | 否 | - | 版块 ID |
| `tab` | 否 | - | 筛选：`featured`（精选） |
| `feed` | 否 | `latest` | 瀑布流模式：`latest`（最新）/ `recommend`（推荐）/ `following`（关注） |
| `keyword` | 否 | - | 关键词过滤 |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

> **feed 模式说明：**
> - `latest`：按发布时间倒序
> - `recommend`：综合热度推荐（点赞×3 + 评论×2 + 收藏×4 + 浏览×0.1），结合时间衰减
> - `following`：仅显示关注用户的帖子，需登录，未登录返回空列表

响应：`PageResult<Post>` 分页数据

### 6.2 帖子详情

```
GET /api/v1/posts/{postId}
```

**不需要认证**（可选登录以获取点赞/收藏状态）

响应：`PostDetailResponse` 对象，包含作者昵称、头像，以及当前用户的点赞/收藏状态

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 6001,
    "authorId": 4002,
    "authorNickname": "林一航",
    "authorAvatarUrl": "https://...",
    "moduleId": 1001,
    "moduleName": "学习交流",
    "title": "Python期末复习笔记分享",
    "summary": "整理了本学期的重点知识",
    "content": "...",
    "viewCount": 157,
    "likeCount": 45,
    "commentCount": 8,
    "liked": false,
    "favorited": false,
    "attachments": [
      {
        "id": 7001,
        "displayName": "数据结构期末复习.pdf",
        "fileUrl": "https://pan.baidu.com/file/xxx",
        "fileSize": "2.3MB",
        "fileType": "pdf"
      }
    ]
  }
}
```

### 6.3 创建帖子

```
POST /api/v1/posts
```

**需要认证**

请求体：

```json
{
  "moduleId": 1001,
  "title": "Python期末复习笔记分享",
  "summary": "整理了本学期的重点知识",
  "content": "正文内容...",
  "coverUrl": "https://...",
  "locationName": "图书馆",
  "attachments": [
    {
      "displayName": "数据结构期末复习.pdf",
      "fileUrl": "https://pan.baidu.com/file/xxx",
      "fileSize": "2.3MB",
      "fileType": "pdf"
    }
  ]
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `moduleId` | 是 | 版块 ID |
| `title` | 是 | 标题（最长 120 字） |
| `summary` | 是 | 摘要（最长 255 字） |
| `content` | 是 | 正文（Markdown 格式，支持标题/加粗/斜体/列表/引用/链接/分割线） |
| `coverUrl` | 否 | 封面图 URL |
| `locationName` | 否 | 定位 |
| `attachments` | 否 | 附件列表（文件直链） |
| `attachments[].displayName` | 是 | 文件显示名称 |
| `attachments[].fileUrl` | 是 | 文件直链 URL |
| `attachments[].fileSize` | 否 | 文件大小（如 "2.3MB"） |
| `attachments[].fileType` | 否 | 文件类型（pdf/doc/excel/ppt/zip/other） |

响应：创建的 `Post` 对象

### 6.4 增加分享数

```
POST /api/v1/posts/{postId}/share
```

**不需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 6.5 编辑帖子

```
PUT /api/v1/posts/{postId}
```

**需要认证**（仅作者可编辑）

请求体：

```json
{
  "moduleId": 1001,
  "title": "更新后的标题",
  "summary": "更新后的摘要",
  "content": "更新后的正文内容...",
  "coverUrl": "https://...",
  "locationName": "图书馆",
  "attachments": []
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `moduleId` | 否 | 版块 ID |
| `title` | 否 | 标题 |
| `summary` | 否 | 摘要 |
| `content` | 否 | 正文 |
| `coverUrl` | 否 | 封面图 URL |
| `locationName` | 否 | 定位 |
| `attachments` | 否 | 附件列表 |

> 只传需要修改的字段，未传字段保持不变。非作者调用返回 `40300`

响应：更新后的 `Post` 对象

### 6.6 删除帖子

```
DELETE /api/v1/posts/{postId}
```

**需要认证**（仅作者或管理员可删除）

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

> 软删除（设置 deletedAt 时间戳），非作者/管理员调用返回 `40300`

---

## 7. 评论模块

### 7.1 评论列表

```
GET /api/v1/posts/{postId}/comments
```

**不需要认证**

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `sort` | 否 | `"latest"` | 排序：`latest`（最新）/ `hot`（最热） |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

响应：`PageResult<PostComment>` 分页数据

### 7.2 发表评论

```
POST /api/v1/posts/{postId}/comments
```

**需要认证**

请求体（JSON）：

```json
{
  "postId": 6001,
  "content": "说得好！",
  "parentId": null,
  "replyToUserId": null
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `postId` | 是 | 帖子 ID |
| `content` | 是 | 评论内容（最长 1000 字） |
| `parentId` | 否 | 父评论 ID（回复评论时传） |
| `replyToUserId` | 否 | 被回复用户 ID |

响应：创建的 `PostComment` 对象

### 7.3 删除评论

```
DELETE /api/v1/comments/{commentId}
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 8. 互动模块

### 8.1 点赞帖子

```
POST /api/v1/posts/{postId}/like
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

> 重复点赞返回 `40900 Already liked`

### 8.2 取消点赞

```
DELETE /api/v1/posts/{postId}/like
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 8.3 收藏帖子

```
POST /api/v1/posts/{postId}/favorite
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

> 重复收藏返回 `40900 Already favorited`

### 8.4 取消收藏

```
DELETE /api/v1/posts/{postId}/favorite
```

**需要认证**

### 8.5 点赞评论

```
POST /api/v1/comments/{commentId}/like
```

**需要认证**

> 重复点赞返回 `40900 Already liked`

### 8.6 取消点赞评论

```
DELETE /api/v1/comments/{commentId}/like
```

**需要认证**

---

## 9. 消息模块 `/messages`

### 9.1 消息列表

```
GET /api/v1/messages
```

**需要认证**

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `type` | 否 | `"all"` | 消息类型：`NOTICE`/`REPLY`/`LIKE`/`FOLLOW`/`SYSTEM` |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

响应：`PageResult<Message>`

### 9.2 消息概览（未读数）

```
GET /api/v1/messages/overview
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "unreadTotal": 0
  }
}
```

### 9.3 全部标记已读

```
POST /api/v1/messages/read-all
```

**需要认证**

### 9.4 单条标记已读

```
POST /api/v1/messages/{messageId}/read
```

**需要认证**

---

## 10. 个人中心 `/me`

### 10.1 我的资料

```
GET /api/v1/me/profile
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "user": {
      "id": 4002,
      "studentNo": "2021001",
      "phone": "13800138000",
      "dorm": null,
      "nickname": "林一航",
      "avatarUrl": "https://...",
      "gender": 1,
      "role": "USER",
      "status": 1
    },
    "studentProfile": {
      "id": 5001,
      "realName": "林一航",
      "studentNo": "2021001",
      "college": "计算机学院",
      "major": "计算机科学与技术",
      "grade": "2021",
      "identityLabel": "大三",
      "verified": 1
    }
  }
}
```

### 10.2 修改个人信息

```
PUT /api/v1/me/profile
```

**需要认证**

请求体：

```json
{
  "nickname": "林一航",
  "avatarUrl": "https://...",
  "gender": 1,
  "dorm": "梅园1号楼302"
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `nickname` | 否 | 昵称 |
| `avatarUrl` | 否 | 头像 URL |
| `gender` | 否 | 性别：0=未知 1=男 2=女 |
| `dorm` | 否 | 宿舍 |

> 只传需要修改的字段，未传字段保持不变

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 10.3 我的收藏

```
GET /api/v1/me/favorites
```

**需要认证**

Query 参数：`page`, `pageSize`

响应：`PageResult<Post>` 收藏的帖子列表

### 10.4 我的帖子

```
GET /api/v1/me/posts
```

**需要认证**

Query 参数：`page`, `pageSize`

响应：`PageResult<Post>` 我发布的帖子列表

### 10.5 查看他人主页

```
GET /api/v1/users/{userId}/profile
```

**不需要认证**（可选登录以获取关注状态）

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "userId": 4002,
    "nickname": "林一航",
    "avatarUrl": "https://...",
    "gender": 1,
    "studentProfile": {
      "realName": "林一航",
      "college": "计算机学院",
      "major": "计算机科学与技术",
      "grade": "2021",
      "identityLabel": "大三"
    },
    "postCount": 12,
    "followerCount": 35,
    "followingCount": 18,
    "followed": false
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `userId` | long | 用户 ID |
| `nickname` | string | 昵称 |
| `avatarUrl` | string | 头像 URL |
| `gender` | int | 性别 |
| `studentProfile` | object/null | 学生信息（已认证时返回） |
| `postCount` | int | 发帖数 |
| `followerCount` | int | 粉丝数 |
| `followingCount` | int | 关注数 |
| `followed` | boolean | 当前登录用户是否已关注（未登录时为 `false`） |

### 10.6 关注用户

```
POST /api/v1/users/{userId}/follow
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

> 重复关注返回 `40900 Already followed`，不能关注自己

### 10.7 取消关注

```
DELETE /api/v1/users/{userId}/follow
```

**需要认证**

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 10.8 提交反馈

```
POST /api/v1/feedbacks
```

**需要认证**

请求体：

```json
{
  "content": "建议增加夜间模式",
  "contact": "wechat_user123"
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `content` | 是 | 反馈内容 |
| `contact` | 否 | 联系方式 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

---

## 11. 上传模块 `/uploads`

### 11.1 获取 COS 上传凭证

```
POST /api/v1/uploads/cos-credential
```

**需要认证**

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `fileName` | 是 | - | 文件名 |
| `fileType` | 否 | `"image"` | 文件类型 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "uploadUrl": "https://bucket.cos.region.myqcloud.com/...",
    "bucket": "bucket-name",
    "region": "ap-shanghai",
    "secretId": "..."
  }
}
```

### 11.2 上传完成回调

```
POST /api/v1/uploads/{fileId}/complete
```

**需要认证**

Query 参数：`url`（上传后的文件 URL）

---

## 12. 后台管理 `/admin`

> 以下接口仅限 `ADMIN` 角色访问

### 12.1 帖子管理

#### 帖子审核列表

```
GET /api/v1/admin/posts
```

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `status` | 否 | - | 帖子状态过滤（1=正常, 2=隐藏, 3=删除） |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

#### 修改帖子状态

```
PUT /api/v1/admin/posts/{postId}/status
```

Query 参数：`status`（目标状态：1=正常, 2=隐藏, 3=删除）

### 12.2 用户管理

#### 用户列表

```
GET /api/v1/admin/users
```

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `keyword` | 否 | - | 搜索关键词（昵称/学号/手机号） |
| `role` | 否 | - | 角色筛选（`USER`/`ADMIN`） |
| `status` | 否 | - | 状态筛选（1=正常, 2=封禁） |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

#### 用户详情

```
GET /api/v1/admin/users/{userId}
```

响应：单个 `User` 对象

#### 封禁用户

```
PUT /api/v1/admin/users/{userId}/ban
```

#### 解封用户

```
PUT /api/v1/admin/users/{userId}/unban
```

#### 修改用户角色

```
PUT /api/v1/admin/users/{userId}/role
```

Query 参数：`role`（`USER`/`ADMIN`）

#### 审核学生认证

```
PUT /api/v1/admin/users/{userId}/verify-student
```

Query 参数：`approved`（`true`=通过, `false`=拒绝）

### 12.3 版块管理

#### 创建版块

```
POST /api/v1/admin/modules
```

请求体：

```json
{
  "code": "trade",
  "name": "二手交易",
  "description": "校园二手物品交易平台",
  "iconKey": "icon-trade",
  "sortOrder": 2,
  "enabled": 1
}
```

#### 编辑版块

```
PUT /api/v1/admin/modules/{moduleId}
```

请求体同创建

#### 删除版块

```
DELETE /api/v1/admin/modules/{moduleId}
```

### 12.4 话题管理

#### 创建话题

```
POST /api/v1/admin/topics
```

请求体：

```json
{
  "name": "毕业季",
  "description": "毕业相关话题",
  "heatScore": 100,
  "enabled": 1
}
```

#### 编辑话题

```
PUT /api/v1/admin/topics/{topicId}
```

请求体同创建

#### 删除话题

```
DELETE /api/v1/admin/topics/{topicId}
```

### 12.5 头条管理

#### 头条列表

```
GET /api/v1/admin/headlines
```

Query 参数：`page`, `pageSize`

#### 创建头条

```
POST /api/v1/admin/headlines
```

请求体：

```json
{
  "title": "校园歌手大赛报名开始",
  "summary": "第十届校园歌手大赛",
  "coverUrl": "https://...",
  "targetType": "POST",
  "targetId": 6001,
  "externalUrl": null,
  "isPinned": 0
}
```

#### 编辑头条

```
PUT /api/v1/admin/headlines/{headlineId}
```

请求体同创建

#### 删除头条

```
DELETE /api/v1/admin/headlines/{headlineId}
```

### 12.6 评论管理

#### 评论列表

```
GET /api/v1/admin/comments
```

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `postId` | 否 | - | 按帖子 ID 筛选 |
| `userId` | 否 | - | 按用户 ID 筛选 |
| `page` | 否 | `1` | 页码 |
| `pageSize` | 否 | `20` | 每页条数 |

#### 管理员删除评论

```
DELETE /api/v1/admin/comments/{commentId}
```

### 12.7 反馈管理

#### 反馈列表

```
GET /api/v1/admin/feedbacks
```

Query 参数：`page`, `pageSize`

#### 修改反馈状态

```
PUT /api/v1/admin/feedbacks/{feedbackId}/status
```

Query 参数：`status`（`PENDING`/`RESOLVED`/`REJECTED`）

### 12.8 数据统计

```
GET /api/v1/admin/stats
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "totalUsers": 1024,
    "todayNewUsers": 12,
    "totalPosts": 5000,
    "todayNewPosts": 56,
    "totalComments": 20000,
    "todayNewComments": 120,
    "pendingPosts": 3,
    "pendingFeedbacks": 5,
    "bannedUsers": 2
  }
}
```

### 12.9 通知管理

#### 发送系统通知

```
POST /api/v1/admin/notifications
```

请求体：

```json
{
  "userIds": [4001, 4002],
  "title": "系统维护通知",
  "content": "系统将于今晚22:00进行维护升级，预计持续2小时",
  "targetType": null,
  "targetId": null
}
```

| 字段 | 必填 | 说明 |
|---|---|---|
| `userIds` | 否 | 接收用户 ID 列表，为空则发送给全体正常状态用户 |
| `title` | 是 | 消息标题 |
| `content` | 是 | 消息内容 |
| `targetType` | 否 | 关联目标类型（`POST`/`URL`/`null`） |
| `targetId` | 否 | 关联目标 ID |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": null
}
```

### 12.10 日志查看

> 通过 `leafone.log.enabled` 配置项控制开关，生产环境建议设为 `false`

#### 日志文件列表

```
GET /api/v1/admin/logs/files
```

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    {
      "name": "leafone.log",
      "size": 1048576,
      "lastModified": "2026-04-30T10:30:00"
    },
    {
      "name": "leafone-error.log",
      "size": 51200,
      "lastModified": "2026-04-30T09:15:00"
    },
    {
      "name": "leafone-access.log",
      "size": 2097152,
      "lastModified": "2026-04-30T10:35:00"
    }
  ]
}
```

#### 查看日志内容

```
GET /api/v1/admin/logs/files/{fileName}
```

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `lines` | 否 | `200` | 读取最后 N 行 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    "2026-04-30 10:30:00.123 [main] INFO  c.l.ForumApplication - Started ForumApplication in 3.45s",
    "2026-04-30 10:30:05.456 [http-nio-9090-exec-1] INFO  c.l.c.f.AccessLogFilter - GET 200 /api/v1/home 12ms 127.0.0.1"
  ]
}
```

#### 按关键词搜索日志

```
GET /api/v1/admin/logs/files/{fileName}/search
```

Query 参数：

| 参数 | 必填 | 默认值 | 说明 |
|---|---|---|---|
| `keyword` | 是 | - | 搜索关键词 |
| `limit` | 否 | `100` | 最大返回行数 |

响应：

```json
{
  "code": 0,
  "message": "success",
  "data": [
    "2026-04-30 10:30:05.789 [http-nio-9090-exec-3] ERROR c.l.a.s.AuthService - code2Session request failed"
  ]
}
```

> 文件名禁止包含 `..` `/` `\`，否则返回 `40000`。仅允许读取 `.log` 后缀文件

---

## 快速上手

### 前端请求示例（TypeScript + fetch）

```typescript
const BASE_URL = 'http://localhost:9090/api/v1';

// 账号密码登录
async function login(studentNo: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentNo, password }),
  });
  const { code, data } = await res.json();
  if (code === 0) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
  throw new Error('Login failed');
}

// 微信小程序登录（wx.login 获取 code）
async function wechatLogin() {
  const { code } = await wx.login();
  const res = await fetch(`${BASE_URL}/auth/wechat-login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  const { code: respCode, data } = await res.json();
  if (respCode === 0) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data; // { newUser, studentVerified, ... }
  }
  throw new Error('WeChat login failed');
}

// 刷新令牌
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  const { code, data } = await res.json();
  if (code === 0) {
    localStorage.setItem('token', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
  throw new Error('Refresh failed');
}

// 获取帖子列表
async function getPosts(params?: { moduleId?: number; page?: number; pageSize?: number }) {
  const qs = new URLSearchParams(params as any).toString();
  const res = await fetch(`${BASE_URL}/posts?${qs}`);
  return (await res.json()).data;
}

// 点赞（需要登录）
async function likePost(postId: number) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return (await res.json()).code === 0;
}
```

### Axios 拦截器示例

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:9090/api/v1',
  timeout: 10000,
});

// 请求拦截器：自动附加 Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一错误处理 + 自动刷新令牌
let refreshing = false;
let pendingQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

api.interceptors.response.use(
  (res) => res.data,
  async (err) => {
    const originalRequest = err.config;
    if (err.response?.data?.code === 40100 && !originalRequest._retry) {
      if (refreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      refreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const { code, data } = await api.post('/auth/refresh', { refreshToken });
        if (code === 0) {
          localStorage.setItem('token', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          pendingQueue.forEach((p) => p.resolve(data.accessToken));
          pendingQueue = [];
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        pendingQueue.forEach((p) => p.reject(refreshErr));
        pendingQueue = [];
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
```
