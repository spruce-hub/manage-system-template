<template>
  <template v-if="active">
    <div class="wrap-mark">
      <div class="clear" @click="active = false">
        <i class="iconfont icon-close-1"></i>
      </div>
      <img
        class="image"
        v-if="['JPG', 'JPGE', 'JPEG', 'PNG'].includes(type) && fileVal"
        :src="fileVal"
      />
      <div
        v-else-if="
          ['DOCX', 'DOC', 'PPT', 'PPTX', 'XLS', 'XLSX'].includes(type) &&
          fileVal
        "
        class="officeapps"
      >
        <iframe
          :src="`https://view.officeapps.live.com/op/view.aspx?src=${fileVal}`"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
      <div v-else-if="fileVal" class="officeapps">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          :src="fileVal"
        ></iframe>
      </div>
    </div>
  </template>
</template>
<script setup lang="ts">
import { http } from '@/apis'
const active = ref(<boolean>false)
const type = ref(<string>'')
const fileVal = ref(<string>'')
function open({ value }) {
  if (!value) {
    return window.$message.info('暂无法预览')
  } else if (typeof value !== 'string') {
    return window.$message.info('预览格式错误')
  }
  typeFn(value)
}
function typeFn(value) {
  let len: number = value.split('.').length - 1
  let str: string = value.split('.')[len].toUpperCase()
  let all: Array<string> = [
    'PDF',
    'DOC',
    'DOCX',
    'XLS',
    'XLSX',
    'JPG',
    'JPGE',
    'JPEG',
    'PPT',
    'PPTX',
    'PNG'
  ]
  if (!all.includes(str)) {
    return window.$message.info('该格式无法预览，请下载后预览')
  }
  type.value = str
  active.value = true
  if (['DOCX', 'DOC', 'PPT', 'PPTX', 'XLS', 'XLSX'].includes(type.value)) {
    fileVal.value = value
  } else {
    http
      .get(value, {
        headers: {
          'Content-Type': 'application/pdf'
        },
        responseType: 'arraybuffer'
      })
      .catch((data) => {
        const blob = new Blob([data], {
          type: 'application/pdf'
        })
        fileVal.value = window.URL.createObjectURL(blob)
      })
  }
}
defineExpose({
  open
})
</script>
<style scoped lang="less">
.wrap-mark {
  z-index: 1024;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  .image {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 1;
    transform: translate(-50%, -50%);
    max-width: 800px;
  }
  .clear {
    position: absolute;
    right: 20px;
    top: 20px;
    background: @white;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    i {
      font-size: 20px;
    }
  }
  .officeapps {
    position: absolute;
    width: 1000px;
    height: calc(100vh - 30px);
    overflow-y: auto;
    overflow-x: hidden;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>
