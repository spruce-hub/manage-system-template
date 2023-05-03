<template>
  <n-modal
    :show="show"
    preset="card"
    :auto-focus="false"
    :segmented="{ content: true, footer: true }"
    :title="items.name"
    :bordered="false"
    :style="`width:${items.width}px`"
    footer-style="display:flex;align-items:center; border: none"
    :content-style="`padding:${items.padding}px`"
    @close="cancel"
  >
    <div class="warn-body">
      <n-icon size="50" color="#F4934B" v-if="items.icon">
        <IconWarning />
      </n-icon>
      <div class="body-content">
        <p class="title" v-if="items.title" v-html="items.title"></p>
        <div class="text-c-1" v-if="items.html" v-html="items.html"></div>
      </div>
    </div>
    <template #footer>
      <n-button type="primary" :loading="loading" @click="ok">
        {{ items.okText }}
      </n-button>
      <n-button @click="cancel">
        {{ items.cancelText }}
      </n-button>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
import { NModal, NButton } from 'naive-ui'
import IconWarning from '@/assets/icons/IconWarning.vue'

const show = ref(<boolean>false)
const loading = ref(<boolean>false)
interface DialogItem {
  title?: string
  name?: string
  width?: string | number
  okText?: string
  cancelText?: string
  icon?: boolean
  padding?: number
  html?: string
}
const items = ref(<DialogItem>{
  width: 490,
  okText: '确认',
  cancelText: '取消',
  icon: true,
  name: '提示',
  padding: 40
})
const promiseState = ref(<any>{})
function open(value) {
  items.value = Object.assign(items.value, value)
  show.value = true
  return new Promise((resolve, reject) => {
    promiseState.value = { resolve, reject }
  })
}
function ok() {
  promiseState.value.resolve()
}
function cancel() {
  promiseState.value.reject()
  show.value = false
}

defineExpose({
  open,
  show,
  loading
})
</script>

<style lang="less" scoped>
.warn-body {
  display: flex;
  align-items: center;
  color: @text-c-1;
  i {
    margin-right: 16px;
  }
  .body-content {
    width: 100%;
    word-break: break-all;
  }
  .title {
    font-size: 18px;
    color: @text-c-0;
    margin-bottom: 4px;
  }
}
</style>
