<!-- 用户详情/编辑弹窗 -->
<template>
  <ElDialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑用户' : '用户详情'"
    width="540px"
    align-center
    @close="resetState"
  >
    <!-- 查看模式 -->
    <template v-if="!isEdit && userData">
      <div class="user-detail">
        <div class="user-header">
          <ElImage
            :src="userData.avatarUrl"
            :preview-src-list="[userData.avatarUrl]"
            preview-teleported
            class="avatar"
          />
          <div class="user-basic">
            <p class="nickname">{{ userData.nickname }}</p>
            <p class="id">ID: {{ userData.id }}</p>
          </div>
        </div>

        <ElDescriptions :column="2" border class="mt-4">
          <ElDescriptionsItem label="学号">{{ userData.studentNo || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="手机号">{{ userData.phone || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="性别">{{ genderText(userData.gender) }}</ElDescriptionsItem>
          <ElDescriptionsItem label="宿舍">{{ userData.dorm || '-' }}</ElDescriptionsItem>
          <ElDescriptionsItem label="角色">
            <ElTag :type="userData.role === 'ORGANIZER' ? 'warning' : userData.role === 'ADMIN' ? 'danger' : 'info'" size="small">
              {{ userData.role === 'ORGANIZER' ? '组织者' : userData.role === 'ADMIN' ? '管理员' : '普通用户' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="状态">
            <ElTag :type="userData.status === 1 ? 'success' : 'danger'" size="small">
              {{ userData.status === 1 ? '正常' : '已封禁' }}
            </ElTag>
          </ElDescriptionsItem>
          <ElDescriptionsItem label="注册时间" :span="2">{{ userData.createdAt }}</ElDescriptionsItem>
          <ElDescriptionsItem label="最近登录" :span="2">{{ userData.lastLoginAt || '-' }}</ElDescriptionsItem>
        </ElDescriptions>
      </div>
    </template>

    <!-- 编辑模式 -->
    <template v-if="isEdit">
      <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <ElFormItem label="昵称" prop="nickname">
          <ElInput v-model="formData.nickname" placeholder="请输入昵称" />
        </ElFormItem>
        <ElFormItem label="学号" prop="studentNo">
          <ElInput v-model="formData.studentNo" placeholder="请输入学号" />
        </ElFormItem>
        <ElFormItem label="手机号" prop="phone">
          <ElInput v-model="formData.phone" placeholder="请输入手机号" />
        </ElFormItem>
        <ElFormItem label="性别" prop="gender">
          <ElSelect v-model="formData.gender" placeholder="请选择性别">
            <ElOption label="未知" :value="0" />
            <ElOption label="男" :value="1" />
            <ElOption label="女" :value="2" />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="宿舍" prop="dorm">
          <ElInput v-model="formData.dorm" placeholder="请输入宿舍" />
        </ElFormItem>
        <ElFormItem label="头像URL" prop="avatarUrl">
          <ElInput v-model="formData.avatarUrl" placeholder="请输入头像URL" />
        </ElFormItem>
      </ElForm>
    </template>

    <template #footer>
      <div class="dialog-footer">
        <template v-if="!isEdit">
          <ElSpace>
            <ElButton type="primary" @click="enterEdit">编辑</ElButton>
            <ElButton
              v-if="userData?.status === 1"
              type="danger"
              @click="handleBan"
              :loading="actionLoading"
            >封禁</ElButton>
            <ElButton
              v-if="userData?.status === 2"
              type="success"
              @click="handleUnban"
              :loading="actionLoading"
            >解封</ElButton>
            <ElButton
              v-if="userData?.role === 'USER'"
              type="warning"
              @click="handleRoleChange('ADMIN')"
              :loading="actionLoading"
            >设为管理员</ElButton>
            <ElButton
              v-if="userData?.role === 'USER'"
              type="warning"
              plain
              @click="handleRoleChange('ORGANIZER')"
              :loading="actionLoading"
            >设为组织者</ElButton>
            <ElButton
              v-if="userData?.role === 'ADMIN' || userData?.role === 'ORGANIZER'"
              type="info"
              @click="handleRoleChange('USER')"
              :loading="actionLoading"
            >设为普通用户</ElButton>
            <ElButton
              type="danger"
              plain
              @click="handleDelete"
              :loading="actionLoading"
            >删除</ElButton>
          </ElSpace>
          <ElButton @click="dialogVisible = false">关闭</ElButton>
        </template>
        <template v-else>
          <ElButton @click="isEdit = false">取消</ElButton>
          <ElButton type="primary" @click="handleSave" :loading="saveLoading">保存</ElButton>
        </template>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { banUser, unbanUser, updateUserRole, updateUser, deleteUser } from '@/api/leafone'
  import type { FormInstance, FormRules } from 'element-plus'

  interface Props {
    visible: boolean
    userData?: Api.LeafOne.User | null
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'refresh'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const actionLoading = ref(false)
  const saveLoading = ref(false)
  const isEdit = ref(false)
  const formRef = ref<FormInstance>()

  const formData = reactive({
    nickname: '',
    studentNo: '',
    phone: '',
    gender: 0,
    dorm: '',
    avatarUrl: ''
  })

  const rules: FormRules = {
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
  }

  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  const genderText = (gender?: number) => {
    const map: Record<number, string> = { 0: '未知', 1: '男', 2: '女' }
    return map[gender ?? 0] ?? '未知'
  }

  const enterEdit = () => {
    if (!props.userData) return
    Object.assign(formData, {
      nickname: props.userData.nickname || '',
      studentNo: props.userData.studentNo || '',
      phone: props.userData.phone || '',
      gender: props.userData.gender ?? 0,
      dorm: props.userData.dorm || '',
      avatarUrl: props.userData.avatarUrl || ''
    })
    isEdit.value = true
  }

  const resetState = () => {
    isEdit.value = false
  }

  const handleSave = async () => {
    if (!props.userData || !formRef.value) return
    try {
      await formRef.value.validate()
      saveLoading.value = true
      await updateUser(props.userData.id, { ...formData })
      ElMessage.success('保存成功')
      isEdit.value = false
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // validation or request failed
    } finally {
      saveLoading.value = false
    }
  }

  const handleBan = async () => {
    if (!props.userData) return
    try {
      await ElMessageBox.confirm('确定要封禁该用户吗？', '封禁用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      actionLoading.value = true
      await banUser(props.userData.id)
      ElMessage.success('封禁成功')
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // cancelled
    } finally {
      actionLoading.value = false
    }
  }

  const handleUnban = async () => {
    if (!props.userData) return
    try {
      actionLoading.value = true
      await unbanUser(props.userData.id)
      ElMessage.success('解封成功')
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // failed
    } finally {
      actionLoading.value = false
    }
  }

  const handleRoleChange = async (role: string) => {
    if (!props.userData) return
    const roleName = role === 'ORGANIZER' ? '组织者' : role === 'ADMIN' ? '管理员' : '普通用户'
    try {
      await ElMessageBox.confirm(`确定要将该用户设为${roleName}吗？`, '修改角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      actionLoading.value = true
      await updateUserRole(props.userData.id, role)
      ElMessage.success(`已设为${roleName}`)
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // cancelled
    } finally {
      actionLoading.value = false
    }
  }

  const handleDelete = async () => {
    if (!props.userData) return
    try {
      await ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复。', '删除用户', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'error'
      })
      actionLoading.value = true
      await deleteUser(props.userData.id)
      ElMessage.success('删除成功')
      emit('refresh')
      dialogVisible.value = false
    } catch (error) {
      // cancelled
    } finally {
      actionLoading.value = false
    }
  }
</script>

<style scoped lang="scss">
  .user-detail {
    .user-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;

      .avatar {
        width: 64px;
        height: 64px;
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
  }

  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
</style>
