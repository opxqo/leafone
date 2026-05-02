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
    verified?: number
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
      label: '认证状态',
      key: 'verified',
      type: 'select',
      props: {
        placeholder: '请选择状态',
        options: [
          { label: '待审核', value: 0 },
          { label: '已通过', value: 1 },
          { label: '已拒绝', value: 2 }
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
