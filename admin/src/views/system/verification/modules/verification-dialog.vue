<!-- 学生认证审核弹窗 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    title="认证审核"
    width="500px"
    align-center
  >
    <template v-if="data">
      <div class="user-header">
        <ElImage
          :src="data.avatarUrl"
          :preview-src-list="[data.avatarUrl]"
          preview-teleported
          class="avatar"
        />
        <div class="user-basic">
          <p class="nickname">{{ data.nickname }}</p>
          <p class="id">ID: {{ data.userId }}</p>
        </div>
      </div>

      <ElDescriptions :column="2" border class="mt-4">
        <ElDescriptionsItem label="真实姓名">{{ data.realName || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="学号">{{ data.studentNo || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="学部">{{ data.college || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="专业">{{ data.major || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="年级">{{ data.grade || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="手机号">{{ data.phone || '-' }}</ElDescriptionsItem>
        <ElDescriptionsItem label="认证状态" :span="2">
          <ElTag :type="statusType" size="small">{{ statusText }}</ElTag>
        </ElDescriptionsItem>
        <ElDescriptionsItem label="提交时间" :span="2">{{ data.createdAt }}</ElDescriptionsItem>
      </ElDescriptions>
    </template>

    <template #footer>
      <div class="dialog-footer">
        <ElSpace v-if="data?.verified === 0">
          <ElButton type="success" @click="handleApprove" :loading="loading">通过</ElButton>
          <ElButton type="danger" @click="handleReject" :loading="loading">拒绝</ElButton>
        </ElSpace>
        <ElButton @click="dialogVisible = false">关闭</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { verifyStudent } from '@/api/leafone'

  type VerificationItem = Api.LeafOne.VerificationItem

  interface Props {
    visible: boolean
    data?: VerificationItem | null
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'refresh'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()
  const loading = ref(false)

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const statusText = computed(() => {
    const map: Record<number, string> = { 0: '待审核', 1: '已通过', 2: '已拒绝' }
    return map[props.data?.verified ?? 0] ?? '未知'
  })

  const statusType = computed(() => {
    const map: Record<number, string> = { 0: 'warning', 1: 'success', 2: 'danger' }
    return (map[props.data?.verified ?? 0] ?? 'info') as any
  })

  const handleApprove = async () => {
    if (!props.data) return
    try {
      loading.value = true
      await verifyStudent(props.data.userId, true)
      ElMessage.success('已通过认证')
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // failed
    } finally {
      loading.value = false
    }
  }

  const handleReject = async () => {
    if (!props.data) return
    try {
      await ElMessageBox.confirm('确定要拒绝该认证申请吗？', '拒绝认证', {
        confirmButtonText: '确定拒绝',
        cancelButtonText: '取消',
        type: 'warning'
      })
      loading.value = true
      await verifyStudent(props.data.userId, false)
      ElMessage.success('已拒绝认证')
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // cancelled
    } finally {
      loading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .user-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 4px;

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
    }

    .nickname {
      font-size: 18px;
      font-weight: 600;
    }

    .id {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
