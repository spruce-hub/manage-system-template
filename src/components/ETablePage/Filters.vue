<template>
  <div
    class="mr-10 mb-14 flex items-center fields"
    v-if="items.type === 'text'"
  >
    <span class="name">{{ items.label }}</span>
    <n-input
      size="small"
      :style="{ width: items.width || '100px' }"
      clearable
      v-model:value="items.value"
      @update:value="update"
    />
  </div>
  <div
    class="mr-10 mb-14 flex items-center fields"
    v-else-if="items.type === 'select'"
  >
    <span class="name">{{ items.label }}</span>
    <n-select
      size="small"
      filterable
      :style="{ width: items.width || '100px' }"
      v-model:value="items.value"
      clearable
      :multiple="items.multiple"
      :options="items.options"
      @update:value="update"
      :render-option="renderOption"
      :max-tag-count="1"
      @focus="emit('change')"
      @blur="emit('change')"
    />
  </div>
  <div
    class="mr-10 mb-14 flex items-center fields"
    v-else-if="
      [
        'date',
        'timestamp',
        'month',
        'year',
        'daterange',
        'quarterrange',
        'yearrange',
        'monthrange',
        'datetimerange'
      ].includes(items.type)
    "
  >
    <span class="name">{{ items.label }}</span>
    <n-date-picker
      size="small"
      :style="{ width: items.width || '300px' }"
      v-model:formatted-value="items.value"
      clearable
      :shortcuts="items.shortcuts"
      :type="items.type"
      :value-format="items.format || 'yyyy-MM-dd HH:mm:ss'"
      @update:formatted-value="update"
    />
  </div>
  <div
    class="mr-10 mb-14 flex items-center fields"
    v-else-if="items.type === 'cascader'"
  >
    <span class="name">{{ items.label }}</span>
    <n-cascader
      :style="{ width: items.width || '150px' }"
      v-model:value="items.value"
      expand-trigger="hover"
      size="small"
      :options="items.options"
      separator=">"
      clearable
      check-strategy="child"
      :label-field="items.labelField"
      :value-field="items.valueField"
      :show-path="false"
      :filterable="true"
      @update:value="update"
    />
  </div>
  <div
    v-else-if="items.type === 'search'"
    class="mr-10 mb-14 flex items-center fields"
  >
    <span class="name">{{ items.label }}</span>
    <RemoteSearch
      size="small"
      :style="{ width: items.width || '150px' }"
      :query="items.value"
      :labelField="items.labelField"
      :valueField="items.valueField"
      :form="items.form"
      :api="items.api"
      :method="items.method"
      :ellipsis="true"
      @update:value="update"
      :async="items.async"
      ref="RemoteSearchRef"
    >
    </RemoteSearch>
  </div>
</template>
<script lang="ts" setup>
import { h, VNode } from 'vue'
import { NTooltip, SelectOption } from 'naive-ui'
interface listItem {
  type: string
  mode: string
  async: boolean
  value: any
  key: string
  label: string
  width?: string
  labelField?: string
  valueField?: string
  multiple: boolean
  format?: string
  form: any
  api: string
  method: string
  affiliate?: Array<string>
  options?: Array<{
    label: string
    value: string | number
  }>
  shortcuts?: Record<string, any> | number | null | undefined
}

interface Props {
  items: listItem
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:value', 'change'])
const RemoteSearchRef = ref(<any>{})
let time: any = null
function keywordFn() {
  RemoteSearchRef.value.keywordFn()
}
function update(value) {
  clearTimeout(time)
  if (props.items.type === 'text' && value) {
    time = setTimeout(() => {
      emit(
        'update:value',
        props.items.key,
        value,
        props.items.type,
        props.items.mode,
        props.items.affiliate || []
      )
    }, 800)
  } else {
    emit(
      'update:value',
      props.items.key,
      value,
      props.items.type,
      props.items.mode,
      props.items.affiliate || []
    )
  }
}
function renderOption({ node, option }: { node: VNode; option: SelectOption }) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => option['label']
  })
}
defineExpose({
  keywordFn
})
</script>
<style scoped lang="less">
.name {
  line-height: 26px;
  color: @text-c-1;
  white-space: nowrap;
}
.fields {
  background: @white;
  border: 1px solid @line-c-1;
  border-radius: 2px;
  padding-left: 10px;
  transition: all 0.5s;
  &:focus-within,
  &:hover {
    transition: all 0.5s;
    border-color: @main-c;
  }
}
::v-deep(.n-base-selection__state-border),
::v-deep(.n-input__state-border),
::v-deep(.n-base-selection__border),
::v-deep(.n-input__border) {
  border: 0;
  display: none;
}
</style>
