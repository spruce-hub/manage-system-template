<template>
  <n-select
    v-model:value="keyword"
    filterable
    :placeholder="placeholder"
    :options="option"
    :loading="loading"
    clearable
    :label-field="labelField"
    :value-field="valueField"
    :multiple="multiple"
    remote
    @search="handleSearch"
    @clear="clear"
    :disabled="disabled"
    @update:value="update"
    :render-option="ellipsis ? renderOption : undefined"
  />
</template>
<script lang="ts" setup>
import { ref, VNode, onMounted } from 'vue'
import { NTooltip, SelectOption } from 'naive-ui'
import { http } from '@/apis'
interface Props {
  placeholder?: string
  query?: any
  labelField?: string
  valueField?: string
  form?: any
  api?: string
  ellipsis?: boolean
  method?: string
  disabled?: boolean
  async?: boolean
  multiple?: boolean
  options?: Array<any>
  custom?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入',
  query: null,
  ellipsis: false,
  method: 'get',
  form: {
    keyword: ''
  },
  custom: false,
  multiple: false
})
const keyword = ref(<string | null>'')
let loading = ref<Boolean>(false)
let time: any = null
let option = ref(<any>[])
const emit = defineEmits(['update:value', 'clear'])
function dataFn(val) {
  let from = {}
  if (props.custom) {
    if (props.method === 'get') {
      from = {
        params: { ...props.form, name: ['like', val], hasPage: false }
      }
    } else {
      from = {
        ...props.form,
        hasPage: false,
        name: val ? ['like', val] : undefined
      }
    }
  } else {
    if (props.method === 'get') {
      from = {
        params: { ...props.form, keyword: val, hasPage: false }
      }
    } else {
      from = {
        ...props.form,
        hasPage: false,
        keyword: val
      }
    }
  }
  if ((props.async && !val) || (props.async && !val.length)) return false
  loading.value = true
  http[props.method](props.api, from).then(({ data }) => {
    loading.value = false
    if (props.api === 'admin-api/customer/report/auto-completion') {
      data = data.map((e) => {
        return {
          ...e,
          my_name: `${e.name} 法人：${e.oper_name} 状态：${e.status}`
        }
      })
      option.value = data
    } else {
      option.value = data.list || data
    }
  })
}
onMounted(() => {
  if (props.async) return false
  dataFn('')
})
// 执行搜索操作,创建渲染函数
function handleSearch(val: string) {
  clearTimeout(time)
  time = setTimeout(() => {
    dataFn(val)
  }, 800)
}
function clear() {
  emit('clear')
}
function update(value: any) {
  emit('update:value', value, option.value)
}
function renderOption({ node, option }: { node: VNode; option: SelectOption }) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => option[props.labelField || 'label']
  })
}
watch(
  () => props.query,
  (newVal) => {
    keyword.value = newVal
    if (!newVal && props.async) {
      option.value = []
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => props.form,
  (newVal) => {
    // if (Object.values(newVal)?.filter((e) => e)?.length)
    // dataFn('')
  },
  { immediate: true, deep: true }
)
watch(
  () => props.options,
  (newVal) => {
    if (newVal) {
      option.value = newVal
    }
  },
  { immediate: true, deep: true }
)
function keywordFn() {
  keyword.value = null
}
defineExpose({
  keywordFn
})
</script>
<style lang="less"></style>
