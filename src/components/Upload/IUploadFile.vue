<template>
  <n-upload
    class="upload"
    style="width: auto"
    ref="uploadRef"
    :show-file-list="false"
    :custom-request="customRequest"
    @before-upload="beforeUpload"
    :disabled="disabled || loading"
  >
    <div class="flex">
      <slot v-if="!loading" />
      <n-spin size="small" style="width: 15px; height: 15px" v-else />
    </div>
  </n-upload>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  UploadCustomRequestOptions,
  UploadFileInfo,
  UploadInst
} from 'naive-ui/es/components'
import { http } from '@/apis'
import axios from 'axios'
const ossHttp = axios.create()
const loading = ref(<boolean>false)
type Props = {
  uploadType?: Array<string>
  disabled: boolean
}
const props = withDefaults(defineProps<Props>(), {
  uploadType: () => [],
  disabled: false
})
const uploadRef = ref<UploadInst>()

const current = reactive({
  up_url: '',
  post_type: '',
  file_key: ''
})
let uploadParams = reactive({
  key: '',
  success_action_status: 200,
  OSSAccessKeyId: '',
  policy: '',
  signature: '',
  callback: ''
})

const emit = defineEmits(['finish'])

function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}
// 获取oss签名配置
function beforeUpload(opt: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  if (props.uploadType.length) {
    if (!checkFile(opt.file)) {
      return false
    }
  }
  return http
    .get('admin-api/common/upload/config', {
      params: {
        file_name: opt.file.name
      }
    })
    .then(({ data }) => {
      current.up_url = data.up_url
      current.post_type = data.post_type
      current.file_key = data.file_key
      uploadParams = Object.assign(uploadParams, data.post_params)
      return data
    })
}
// 上传文件
function customRequest(config: UploadCustomRequestOptions) {
  const formData = new FormData()
  for (let key in uploadParams) {
    if (isValidKey(key, uploadParams)) {
      formData.append(key, uploadParams[key])
    }
  }
  if (config.file.file) {
    formData.append(current.file_key, config.file.file)
  }
  ossHttp({
    url: current.up_url,
    method: current.post_type,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  }).then(({ data }) => {
    const res: any = data
    if (res.code === 200) {
      emit('finish', {
        ...res.data
      })
      loading.value = false
      uploadRef.value?.clear()
    }
  })
}
function checkFile(file) {
  let fileType = file.name.split('.').pop()?.toLowerCase() ?? ''
  let isCorrectType = props.uploadType.includes(fileType)
  if (!isCorrectType) {
    window.$message.info('文件格式不正确')
    return false
  }
  loading.value = true
  return true
}
</script>

<style lang="less" scoped></style>
