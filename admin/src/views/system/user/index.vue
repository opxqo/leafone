<!-- 用户管理页面 -->
<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <UserSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></UserSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 用户详情弹窗 -->
      <UserDialog
        v-model:visible="dialogVisible"
        :user-data="currentUserData"
        @refresh="refreshData"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchUsers } from '@/api/leafone'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'
  import { ElTag, ElImage } from 'element-plus'

  defineOptions({ name: 'User' })

  type UserItem = Api.LeafOne.User

  // 弹窗相关
  const dialogVisible = ref(false)
  const currentUserData = ref<UserItem | null>(null)

  // 搜索表单
  const searchForm = ref({
    keyword: undefined as string | undefined,
    role: undefined as string | undefined,
    status: undefined as number | undefined
  })

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchUsers,
      apiParams: {
        page: 1,
        pageSize: 20
      },
      paginationKey: {
        current: 'page',
        size: 'pageSize'
      },
      columnsFactory: () => [
        { type: 'index', width: 55, label: '序号' },
        {
          prop: 'userInfo',
          label: '用户',
          minWidth: 200,
          formatter: (row: UserItem) => {
            return h('div', { class: 'user flex-c' }, [
              h(ElImage, {
                class: 'size-8 rounded-full',
                src: row.avatarUrl,
                previewSrcList: [row.avatarUrl],
                previewTeleported: true
              }),
              h('div', { class: 'ml-2 overflow-hidden' }, [
                h('p', { class: 'user-name font-medium truncate' }, row.nickname),
                h('p', { class: 'text-xs text-gray-400 truncate' }, `学号: ${row.studentNo || '-'}`)
              ])
            ])
          }
        },
        {
          prop: 'phone',
          label: '手机号',
          width: 130,
          formatter: (row: UserItem) => row.phone || '-'
        },
        {
          prop: 'gender',
          label: '性别',
          width: 70,
          formatter: (row: UserItem) => {
            const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
            return map[row.gender] ?? '未知'
          }
        },
        {
          prop: 'role',
          label: '角色',
          width: 90,
          formatter: (row: UserItem) => {
            const roleMap: Record<string, { text: string; type: string }> = {
              ORGANIZER: { text: '组织者', type: 'warning' },
              ADMIN: { text: '管理员', type: 'danger' },
              USER: { text: '用户', type: 'info' }
            }
            const { text, type } = roleMap[row.role] ?? { text: '用户', type: 'info' }
            return h(ElTag, { type: type as any, size: 'small' }, () => text)
          }
        },
        {
          prop: 'status',
          label: '状态',
          width: 80,
          formatter: (row: UserItem) => {
            const isNormal = row.status === 1
            return h(
              ElTag,
              { type: isNormal ? 'success' : 'danger', size: 'small' },
              () => (isNormal ? '正常' : '已封禁')
            )
          }
        },
        {
          prop: 'createdAt',
          label: '注册时间',
          width: 170
        },
        {
          prop: 'operation',
          label: '操作',
          width: 70,
          fixed: 'right',
          formatter: (row: UserItem) =>
            h(ArtButtonTable, {
              type: 'view',
              onClick: () => showDialog(row)
            })
        }
      ]
    }
  })

  const showDialog = (row: UserItem): void => {
    currentUserData.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const handleSearch = (params: Record<string, any>) => {
    replaceSearchParams(params)
    getData()
  }
</script>
