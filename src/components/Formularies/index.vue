<template>
  <n-form
    ref="iformRef"
    :require-mark-placement="requireMarkPlacement"
    :model="formFlelds"
    :rules="rulesFlelds"
    class="form"
    :class="{ nomessage: nomessage }"
    :label-align="labelAlign"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
  >
    <n-grid x-gap="30" :cols="spans || 3">
      <template v-for="(item, key, index) in rules">
        <n-gi :span="item.span || 1" v-if="!item.hiddle">
          <n-form-item :key="index" :label="item.label" :path="key">
            <template #label v-if="item.labelSlot">
              <slot
                :name="item.labelSlot"
                :index="index"
                :key="key"
                :row="item"
              ></slot>
            </template>
            <div class="flex w-full items-center">
              <slot
                v-if="item.before"
                :name="item.before"
                :index="index"
                :key="key"
                :row="item"
              ></slot>
              <Fields
                ref="fieldsRef"
                :type="item.type"
                :label="item.label"
                :value="item.value"
                :rows="item.rows"
                :show-count="item.showCount"
                :maxlength="item.maxlength"
                :max="item.max"
                :min="item.min"
                :precision="
                  item.precision !== undefined || item.label === '排序'
                    ? item.precision || 0
                    : 2
                "
                :step="item.step"
                :showButton="item.showButton"
                :options="item.options"
                :placeholder="item.placeholder"
                :count="item.count"
                :color="item.color"
                :allowHalf="item.allowHalf"
                :checkedValue="item.checkedValue"
                :uncheckedValue="item.uncheckedValue"
                :startPlaceholder="item.startPlaceholder"
                :endPlaceholder="item.endPlaceholder"
                :separator="item.separator"
                :multiple="item.multiple"
                :labelField="item.labelField"
                :valueField="item.valueField"
                :ellipsis="item.ellipsis"
                :listType="item.listType"
                :maxSize="item.maxSize"
                :filename="item.filename"
                :fileFormat="item.fileFormat"
                :showFileList="item.showFileList"
                :disabled="disabled || item.disabled"
                :readonly="item.readonly"
                :fileList="item.fileList"
                :format="item.format"
                :api="item.api"
                :method="item.method"
                :async="item.async"
                :custom="item.custom"
                :form="item.form"
                :previousDate="item.previousDate"
                @update:value="
                  (value, file, size, type) =>
                    update(key, value, file, size, type)
                "
                @clear="clear(key, item)"
                @remove="$emit('remove', $event)"
              >
                <template v-if="item.slot" #fields>
                  <slot
                    :name="item.slot"
                    :index="index"
                    :key="key"
                    :row="item"
                  ></slot>
                </template>
              </Fields>
              <slot
                v-if="item.after"
                :name="item.after"
                :index="index"
                :key="key"
                :row="item"
              ></slot>
            </div>
          </n-form-item>
        </n-gi>
      </template>
    </n-grid>
  </n-form>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Fields from './Fields.vue'
import { FormInst } from 'naive-ui'
import { http } from '@/apis'
interface Props {
  rules: any
  labelPlacement?: 'left' | 'top'
  labelAlign?: 'left' | 'right'
  labelWidth?: number | string | 'auto'
  requireMarkPlacement?: 'left' | 'right' | 'right-hanging'
  spans?: number
  nomessage?: boolean
  code?: string // 审批模板，只要传了审核模板就代表该内容需要进行审核（优先级低），
  dataColumn?: any //审核详情数据（优先级高）
  disabled?: boolean // 全盘禁用
}
const props = withDefaults(defineProps<Props>(), {
  labelPlacement: 'left',
  labelAlign: 'right',
  requireMarkPlacement: 'left',
  spans: 1,
  nomessage: false,
  disabled: false,
  rules: () => {}
})
const formFlelds = ref({})
const rulesFlelds = ref({})
const data_column = ref({})
onMounted(() => {
  if (props.dataColumn && JSON.stringify(props.dataColumn) !== '{}') {
    // 传了审批模板,默认全部隐藏
    Object.keys(props.rules).forEach((item) => {
      let vim = props.rules[item]
      vim.hiddle = true
    })
    data_column.value = props.dataColumn
    rulesFn(data_column.value)
  } else if (props.code) {
    // 传了审批模板,默认全部隐藏
    Object.keys(props.rules).forEach((item) => {
      let vim = props.rules[item]
      vim.hiddle = true
    })
    http
      .get('admin-api/approval/template/get-data-column', {
        params: { code: props.code }
      })
      .then(({ data }) => {
        data_column.value = data.data_column
        rulesFn(data_column.value)
      })
  } else {
    rulesFn(data_column.value)
  }
})
watch(props.rules, (newVal) => {
  rulesFn(data_column.value)
})
function rulesFn(data) {
  Object.keys(props.rules).forEach((item) => {
    let vim = props.rules[item]
    // 附件
    if (!vim.value && vim.type !== 'file' && vim.value !== 0) {
      vim.value = null
    }
    // 联动：affiliate
    if (!vim.disabled && vim.affiliate && vim.affiliate.length) {
      let keys = vim.form ? Object.keys(vim.form) : []
      if (keys.length)
        vim.affiliate.forEach((e) => {
          if (keys.includes(e)) vim.form[e] = props.rules[e]?.value
        })
      vim.disabled = vim.affiliate.some((e) => {
        return !props.rules[e].value
      })
    }
    // 验证器
    formFlelds.value[item] = vim.value
    if (vim.required || vim.required === false) {
      let rouleItem = [
        'message',
        'asyncValidator',
        'renderMessage',
        'required',
        'trigger',
        'validator',
        'type'
      ]
      rulesFlelds.value[item] = new Object()
      rouleItem.forEach((e) => {
        if (vim[e] && e !== 'type') {
          rulesFlelds.value[item][e] = vim[e]
        } else {
          rulesFlelds.value[item]['type'] = vim['itype']
        }
      })
    }
    // 审核控制
    if (JSON.stringify(data) !== '{}' && !vim.filter) {
      vim.disabled =
        vim.disabled || props.disabled || !data[vim.alias || item]?.writable
      vim.hiddle = !data[vim.alias || item]?.readable
    } else if (vim.filter) {
      vim.hiddle = false
    }

    if (vim.type === 'number' && vim.value) vim.value = +vim.value
  })
}
const fieldsRef = ref(<typeof Fields>{})
const emit = defineEmits(['update:value', 'remove'])
function update(key, value, file, size, type) {
  if (key !== 'file') {
    formFlelds.value[key] = value
    props.rules[key].value = value
  }
  Object.keys(props.rules).forEach((item) => {
    let vim = props.rules[item]
    if (vim.affiliate && vim.affiliate.includes(key)) {
      vim.disabled = vim.affiliate.some((e) => {
        return !props.rules[e].value
      })
    }
  })
  let val = !value && value !== 0 ? undefined : value
  emit('update:value', key, val, file, size, type)
}

const iformRef = ref(<FormInst>{})

//NOTE: 表单提交操作
function sure() {
  return new Promise((resolve, reject) => {
    iformRef.value.validate((errors) => {
      if (errors) {
        reject(formFlelds.value)
      } else {
        resolve(formFlelds.value)
      }
    })
  })
}
function clear(key, item) {
  item.value = undefined
  emit('update:value', key, item.value)
}
defineExpose({
  sure,
  data_column: data_column
})
</script>

<style scoped lang="less"></style>
