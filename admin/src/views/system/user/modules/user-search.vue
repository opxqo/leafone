<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface SearchParams {
    keyword?: string
    role?: string
    status?: number
  }

  interface Props {
    modelValue: SearchParams
  }
  interface Emits {
    (e: 'update:modelValue', value: SearchParams): void
    (e: 'search', params: SearchParams): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  const formItems = computed(() => [
    {
      label: '关键字',
      key: 'keyword',
      type: 'input',
      placeholder: '搜索昵称/学号/手机号',
      clearable: true
    },
    {
      label: '角色',
      key: 'role',
      type: 'select',
      props: {
        placeholder: '请选择角色',
        options: [
          { label: '普通用户', value: 'USER' },
          { label: '管理员', value: 'ADMIN' },
          { label: '组织者', value: 'ORGANIZER' }
        ]
      }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: [
          { label: '正常', value: 1 },
          { label: '已封禁', value: 2 }
        ]
      }
    }
  ])

  function handleReset() {
    emit('reset')
  }

  async function handleSearch(params: SearchParams) {
    await searchBarRef.value.validate()
    emit('search', params)
  }
</script>
