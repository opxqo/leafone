<!-- 学生认证管理页面 -->
<template>
  <div class="verification-page art-full-height">
    <!-- 搜索栏 -->
    <VerificationSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams" />

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData" />

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />

      <!-- 审核弹窗 -->
      <VerificationDialog
        v-model:visible="dialogVisible"
        :data="currentItem"
        @refresh="refreshData"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchVerifications } from '@/api/leafone'
  import VerificationSearch from './modules/verification-search.vue'
  import VerificationDialog from './modules/verification-dialog.vue'
  import { ElTag, ElImage } from 'element-plus'

  defineOptions({ name: 'Verification' })

  type VerificationItem = Api.LeafOne.VerificationItem

  const dialogVisible = ref(false)
  const currentItem = ref<VerificationItem | null>(null)

  const searchForm = ref({
    verified: undefined as number | undefined
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
      apiFn: fetchVerifications,
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
          formatter: (row: VerificationItem) => {
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
          prop: 'realName',
          label: '真实姓名',
          width: 100,
          formatter: (row: VerificationItem) => row.realName || '-'
        },
        {
          prop: 'college',
          label: '学部',
          width: 120,
          formatter: (row: VerificationItem) => row.college || '-'
        },
        {
          prop: 'major',
          label: '专业',
          width: 120,
          formatter: (row: VerificationItem) => row.major || '-'
        },
        {
          prop: 'verified',
          label: '状态',
          width: 90,
          formatter: (row: VerificationItem) => {
            const map: Record<number, { text: string; type: string }> = {
              0: { text: '待审核', type: 'warning' },
              1: { text: '已通过', type: 'success' },
              2: { text: '已拒绝', type: 'danger' }
            }
            const { text, type } = map[row.verified] ?? { text: '未知', type: 'info' }
            return h(ElTag, { type: type as any, size: 'small' }, () => text)
          }
        },
        {
          prop: 'createdAt',
          label: '提交时间',
          width: 170
        },
        {
          prop: 'operation',
          label: '操作',
          width: 70,
          fixed: 'right',
          formatter: (row: VerificationItem) =>
            h(ArtButtonTable, {
              type: 'view',
              onClick: () => showDialog(row)
            })
        }
      ]
    }
  })

  const showDialog = (row: VerificationItem) => {
    currentItem.value = row
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  const handleSearch = (params: Record<string, any>) => {
    replaceSearchParams(params)
    getData()
  }
</script>
