/**
 * API 接口类型定义模块
 *
 * 提供所有后端接口的类型定义
 *
 * ## 主要功能
 *
 * - 通用类型（分页参数、响应结构等）
 * - 认证类型（登录、用户信息等）
 * - 系统管理类型（用户、角色等）
 * - 全局命名空间声明
 *
 * ## 使用场景
 *
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 接口文档类型同步
 *
 * ## 注意事项
 *
 * - 在 .vue 文件使用需要在 eslint.config.mjs 中配置 globals: { Api: 'readonly' }
 * - 使用全局命名空间，无需导入即可使用
 *
 * ## 使用方式
 *
 * ```typescript
 * const params: Api.Auth.LoginParams = { userName: 'admin', password: '123456' }
 * const response: Api.Auth.UserInfo = await fetchUserInfo()
 * ```
 *
 * @module types/api/api
 * @author Art Design Pro Team
 */

declare namespace Api {
  /** 通用类型 */
  namespace Common {
    /** 分页参数 */
    interface PaginationParams {
      /** 当前页码 */
      current: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
    }

    /** 通用搜索参数 */
    type CommonSearchParams = Pick<PaginationParams, 'current' | 'size'>

    /** 分页响应基础结构 */
    interface PaginatedResponse<T = any> {
      records: T[]
      current: number
      size: number
      total: number
    }

    /** 启用状态 */
    type EnableStatus = '1' | '2'
  }

  /** 认证类型 */
  namespace Auth {
    /** 登录参数 */
    interface LoginParams {
      studentNo: string
      password: string
    }

    /** 登录响应 */
    interface LoginResponse {
      accessToken: string
      refreshToken: string
      userId: string
      role: string
      studentVerified: boolean
      newUser: boolean
    }

    /** 用户信息 */
    interface UserInfo {
      userId: string
      nickname: string
      avatarUrl: string
      role: string
      roles?: string[]
      phone?: string
      studentNo?: string
      dorm?: string
      gender?: number
      status?: number
    }
  }

  /** LeafOne 后端类型 */
  namespace LeafOne {
    /** 分页响应 */
    interface PageResult<T> {
      records: T[]
      page: number
      pageSize: number
      total: number
    }

    /** 统计数据 */
    interface Stats {
      totalUsers: number
      todayNewUsers: number
      totalPosts: number
      todayNewPosts: number
      totalComments: number
      todayNewComments: number
      pendingPosts: number
      pendingFeedbacks: number
      bannedUsers: number
    }

    /** 用户 */
    interface User {
      id: string
      openid?: string
      phone?: string
      studentNo?: string
      dorm?: string
      nickname: string
      avatarUrl: string
      gender: number
      role: string
      status: number
      lastLoginAt?: string
      createdAt: string
      updatedAt: string
    }

    /** 帖子 */
    interface Post {
      id: string
      userId: string
      moduleCode: string
      title: string
      summary?: string
      content: string
      coverUrl?: string
      locationName?: string
      status: number
      isPinned: number
      isFeatured: number
      viewCount: number
      likeCount: number
      commentCount: number
      favoriteCount: number
      createdAt: string
      updatedAt: string
    }

    /** 版块 */
    interface Module {
      id: string
      code: string
      name: string
      description: string
      iconKey: string
      sortOrder: number
      postCountToday: number
      enabled: number
      createdAt: string
      updatedAt: string
    }

    /** 话题 */
    interface Topic {
      id: string
      name: string
      description: string
      heatScore: number
      postCount: number
      enabled: number
      createdAt: string
      updatedAt: string
    }

    /** 头条 */
    interface Headline {
      id: string
      title: string
      summary: string
      coverUrl: string
      targetType?: string
      targetId?: string
      externalUrl?: string
      isPinned: number
      viewCount: number
      publishedAt: string
      createdAt: string
      updatedAt: string
    }

    /** 评论 */
    interface Comment {
      id: string
      postId: string
      userId: string
      parentId?: string
      content: string
      status: number
      likeCount: number
      createdAt: string
      updatedAt: string
    }

    /** 反馈 */
    interface Feedback {
      id: string
      userId: string
      type: string
      title: string
      content: string
      contactInfo?: string
      status: string
      createdAt: string
      updatedAt: string
    }

    /** 学生认证审核项 */
    interface VerificationItem {
      userId: string
      nickname: string
      avatarUrl: string
      phone?: string
      studentNo?: string
      realName?: string
      college?: string
      major?: string
      grade?: string
      verified: number
      createdAt?: string
    }

    /** 缓存状态 */
    interface CacheStatus {
      available: boolean
      info?: {
        version: string
        usedMemory: string
        connectedClients: string
        uptimeDays: string
        totalKeys: string
      }
      dormPowerCaches?: CacheEntry[]
      authCaches?: CacheEntry[]
    }

    interface CacheEntry {
      key: string
      ttlSeconds?: number
      value?: string
    }
  }

  /** 系统管理类型 */
  namespace SystemManage {
    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    interface UserListItem {
      id: number
      avatar: string
      status: string
      userName: string
      userGender: string
      nickName: string
      userPhone: string
      userEmail: string
      userRoles: string[]
      createBy: string
      createTime: string
      updateBy: string
      updateTime: string
    }

    /** 用户搜索参数 */
    type UserSearchParams = Partial<
      Pick<UserListItem, 'id' | 'userName' | 'userGender' | 'userPhone' | 'userEmail' | 'status'> &
        Api.Common.CommonSearchParams
    >

    /** 角色列表 */
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    interface RoleListItem {
      roleId: number
      roleName: string
      roleCode: string
      description: string
      enabled: boolean
      createTime: string
    }

    /** 角色搜索参数 */
    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'roleId' | 'roleName' | 'roleCode' | 'description' | 'enabled'> &
        Api.Common.CommonSearchParams & {
          startTime: string | null
          endTime: string | null
        }
    >
  }
}
