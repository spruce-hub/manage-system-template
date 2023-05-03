<template>
  <slot name="fields">
    <n-input
      v-model:value="val"
      type="text"
      v-if="type === 'text'"
      clearable
      :show-count="showCount"
      :readonly="readonly"
      :disabled="disabled"
      :maxlength="maxlength"
      :placeholder="placeholder ? placeholder : '请输入' + label"
      @update:value="update"
    />
    <n-input
      v-model:value="val"
      type="password"
      v-else-if="type === 'password'"
      clearable
      :disabled="disabled"
      :placeholder="placeholder ? placeholder : '请输入' + label"
      @update:value="update"
      show-password-on="mousedown"
    />
    <n-input
      v-model:value="val"
      type="textarea"
      v-else-if="type === 'textarea'"
      :rows="rows"
      :show-count="showCount"
      clearable
      :maxlength="maxlength"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="placeholder ? placeholder : '请输入' + label"
      @update:value="update"
    />
    <n-input-number
      style="width: 100%"
      v-else-if="type === 'number'"
      v-model:value="val"
      :readonly="readonly"
      :disabled="disabled"
      :precision="precision"
      :max="max"
      :min="min"
      :step="step"
      :placeholder="placeholder ? placeholder : '请输入' + label"
      clearable
      :show-button="showButton"
      @update:value="update"
    />
    <n-radio-group
      v-else-if="type === 'radio'"
      v-model:value="val"
      name="radiogroup"
      @update:value="update"
    >
      <n-space>
        <n-radio
          v-for="(item, index) in options"
          :key="index"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </n-radio>
      </n-space>
    </n-radio-group>
    <n-checkbox-group
      v-else-if="type === 'checkbox'"
      v-model:value="val"
      @update:value="update"
    >
      <n-space>
        <n-checkbox
          v-for="(item, index) in options"
          :key="index"
          :value="item.value"
          :disabled="item.disabled"
        >
          {{ item.label }}
        </n-checkbox>
      </n-space>
    </n-checkbox-group>
    <n-rate
      v-model:value="val"
      :allow-half="allowHalf"
      clearable
      :count="count"
      :readonly="readonly"
      :color="color"
      v-else-if="type === 'rate'"
      @update:value="update"
    />
    <n-switch
      v-else-if="type === 'switch'"
      v-model:value="val"
      :disabled="disabled"
      @update:value="update"
      :checked-value="checkedValue"
      :unchecked-value="uncheckedValue"
    />
    <n-time-picker
      v-model:value="val"
      style="width: 100%"
      v-else-if="type === 'time'"
      @update:value="update"
      clearable
    />
    <n-date-picker
      v-model:formatted-value="val"
      clearable
      style="width: 100%"
      :start-placeholder="startPlaceholder ? startPlaceholder : '开始' + label"
      :end-placeholder="endPlaceholder ? endPlaceholder : '结束' + label"
      :placeholder="placeholder ? placeholder : '请选择' + label"
      :disabled="disabled"
      :separator="separator"
      @update:formatted-value="update"
      :value-format="format"
      :is-date-disabled="previousDate"
      v-else-if="
        [
          'date',
          'datetime',
          'timestamp',
          'month',
          'year',
          'daterange',
          'quarterrange',
          'yearrange',
          'monthrange',
          'datetimerange'
        ].includes(type)
      "
      :type="type"
    />
    <n-select
      v-else-if="type === 'select'"
      :multiple="multiple"
      v-model:value="val"
      :options="options"
      :disabled="disabled"
      filterable
      clearable
      :label-field="labelField"
      :value-field="valueField"
      :placeholder="placeholder ? placeholder : '请选择' + label"
      :render-option="ellipsis ? renderOption : undefined"
      @update:value="update"
      :max-tag-count="max"
    />
    <EUploadFile
      v-else-if="type === 'file'"
      :listType="listType"
      :filename="filename"
      :disabled="disabled"
      :maxSize="maxSize"
      :max="max"
      :multiple="multiple"
      :fileFormat="fileFormat"
      :fileList="fileList"
      :showFileList="showFileList"
      @update:file-list="fileUpdate"
      :value="val"
      @clear="emit('clear')"
      @remove="emit('remove', $event)"
    >
    </EUploadFile>
    <n-cascader
      v-else-if="type === 'cascader'"
      v-model:value="val"
      :placeholder="placeholder"
      expand-trigger="hover"
      :options="options"
      separator=">"
      clearable
      :disabled="disabled"
      check-strategy="child"
      :label-field="labelField"
      :value-field="valueField"
      :show-path="false"
      :filterable="true"
      @update:value="update"
    />
    <RemoteSearch
      v-else-if="type === 'search'"
      :query="val"
      :placeholder="placeholder"
      :labelField="labelField"
      :valueField="valueField"
      :form="form"
      :multiple="multiple"
      :api="api"
      :method="method"
      :ellipsis="ellipsis"
      :disabled="disabled"
      :custom="custom"
      :options="options"
      @update:value="update"
      @clear="emit('clear')"
      :async="async"
    >
    </RemoteSearch>
    <n-auto-complete
      v-else-if="type === 'autocomplete'"
      clearable
      v-model:value="val"
      :placeholder="placeholder ? placeholder : '请选择' + label"
      :options="options"
      @update:value="update"
      :render-option="ellipsis ? renderOption : undefined"
    />
    <!--  独立为客户搜索企信宝而设立的 -->
    <n-auto-complete
      v-else-if="type === 'autocomplete2'"
      clearable
      v-model:value="val"
      :placeholder="placeholder ? placeholder : '请选择' + label"
      :options="options"
      @update:value="update"
      :render-option="ellipsis ? renderOption2 : undefined"
    />
  </slot>
</template>
<script lang="ts" setup>
import { h, VNode } from 'vue'
import { NTooltip, SelectOption, UploadFileInfo } from 'naive-ui'
import { useFormItem } from 'naive-ui/es/_mixins'

interface Props {
  custom?: boolean
  type?: string
  placeholder?: string
  value?: any
  label?: string
  rows?: number
  showCount?: boolean
  maxlength?: number
  readonly?: boolean
  disabled?: boolean
  max?: number
  min?: number
  precision?: number
  step?: number
  showButton?: boolean
  options?: Array<any>
  count?: number
  color?: string
  allowHalf?: boolean
  checkedValue?: string | number
  uncheckedValue?: string | number
  startPlaceholder?: string
  endPlaceholder?: string
  separator?: string
  multiple?: boolean
  labelField?: string
  valueField?: string
  ellipsis?: boolean
  listType?: 'text' | 'image' | 'image-card' | 'button' | 'list-button'
  filename?: string
  maxSize?: number
  fileFormat?: Array<'jpg' | 'jpeg' | 'png' | 'mp4' | 'pdf'>
  showFileList?: boolean
  fileList?: UploadFileInfo[]
  format?: string
  method?: string
  api?: string
  form?: any
  async?: boolean
  previousDate?: any
}

const props = withDefaults(defineProps<Props>(), {
  type: '',
  listType: 'button',
  showButton: false,
  checkedValue: 1,
  uncheckedValue: 0,
  method: 'get',
  format: 'yyyy-MM-dd HH:mm:ss',
  options: () => []
})
const formItem = useFormItem({})
const {
  nTriggerFormChange,
  nTriggerFormBlur,
  nTriggerFormInput,
  nTriggerFormFocus
} = formItem
const val = ref(<any>'')
watch(
  props,
  (newVal) => {
    val.value = newVal.value
  },
  { immediate: true, deep: true }
)
watch(
  () => props.value,
  (newVal) => {
    if (newVal === null) return false
    if (
      ['text', 'password', 'textarea', 'number', 'search'].includes(props.type)
    ) {
      nTriggerFormBlur()
      nTriggerFormFocus()
      nTriggerFormInput()
    } else {
      nTriggerFormChange()
    }
  }
)
function renderOption({ node, option }: { node: VNode; option: SelectOption }) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => option[props.labelField || 'label']
  })
}
// 独立为客户搜索企信宝而设立的
function renderOption2({
  node,
  option
}: {
  node: VNode
  option: SelectOption
}) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () =>
      `${option['name']}  法人：${option['oper_name']}  状态：${option['status']}`
  })
}
const emit = defineEmits(['update:value', 'clear', 'remove'])
function update(e, options) {
  emit('update:value', e, options)
}

function fileUpdate(e) {
  try {
    emit('update:value', e.url, e.file, e.size, e.type)
  } catch (error) {}
}
</script>
<style scoped lang="less"></style>
