<template>
  <div class="w-full">
    <div class="flex w-full">
      <n-upload
        ref="uploadRef"
        @update:file-list="emit('update:file-list', $event)"
        :custom-request="customRequest"
        class="w-full upload"
        :multiple="multiple"
        @finish="onFinish"
        :disabled="disabled || loading || list.length >= max"
        :list-type="listType"
        @beforeUpload="beforeUpload"
        :show-file-list="false"
        :file-list="
          props.max !== 1 ? undefined : list.length ? list : undefined
        "
      >
        <template
          v-if="
            !$slots.content &&
            listType !== 'button' &&
            listType !== 'list-button'
          "
        >
          <n-upload-dragger>
            <i
              class="icon-image2 iconfont"
              style="font-size: 30px"
              v-if="!loading"
            />
            <n-spin size="small" v-else />
            <template v-if="listType !== 'image-card'">
              <p class="font-bold">
                {{ filename }}
              </p>
              <p class="text-c-2 text-12">
                只能上传{{ fileFormat.join('、') }}形式的文件
                {{ maxSize && `，单个文件不能超过${maxSize}M` }}
              </p>
            </template>
            <slot name="tips"></slot>
          </n-upload-dragger>
        </template>
        <template
          v-else-if="listType === 'button' || listType === 'list-button'"
        >
          <n-button
            v-if="listType === 'button'"
            type="info"
            class="w-full"
            :loading="loading"
          >
            {{ value ? '文件已上传，可替换' : filename }}
          </n-button>
          <n-button v-else type="info" class="w-full" :loading="loading">
            {{ filename }}
          </n-button>

          <p class="text-c-2 text-12 pt-4">
            只能上传{{ fileFormat.join('、') }}形式的文件
            {{ maxSize && `，单个文件不能超过${maxSize}M` }}
          </p>
        </template>
        <template v-else>
          <slot name="content"></slot>
        </template>
      </n-upload>
      <div
        class="showImg ml-8"
        v-if="
          value &&
          listType === 'button' &&
          ['.jpg', '.png', '.jpeg'].includes(value)
        "
      >
        <n-image width="34" height="34" :show-toolbar="false" :src="value" />
        <i @click="clear" class="iconfont icon-close_filled text-12"></i>
      </div>
    </div>
    <div class="list" v-if="showFileList">
      <div v-for="(item, index) in list" :key="index" class="flex w-full">
        <p>{{ item.name }}</p>
        <span class="icontext">
          <i
            class="ml-4 iconfont icon-a-fullscreen hover-main"
            @click="show(item, index)"
          ></i>
          <i
            class="ml-4 iconfont icon-upload hover-main"
            style="transform: rotate(180deg); font-size: 16px"
            @click="download(item, index)"
          ></i>
          <i
            class="ml-4 iconfont icon-close-1 hover-main"
            @click="remove(item, index)"
          ></i>
        </span>
      </div>
    </div>
    <Preview ref="PreviewRef" />
  </div>
</template>
<script lang="ts" setup>
import { UploadInst } from 'naive-ui'
import { useUploadFile, checkFile } from './methods'
import { ref } from 'vue'
interface Props {
  fileList?: Array<any>
  maxSize?: number
  disabled?: boolean
  multiple?: boolean
  showFileList?: boolean
  fileFormat?: Array<
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'mp4'
    | 'pdf'
    | 'ppt'
    | 'doc'
    | 'docx'
    | 'xls'
    | 'xlsx'
  >
  listType?: 'text' | 'image' | 'image-card' | 'button' | 'list-button'
  max?: number
  filename?: string
  defaults?: boolean
  value?: any
}
const list = ref(<any>[])
const uploadRef = ref<UploadInst>()
const loading = ref(<boolean>false)
const props = withDefaults(defineProps<Props>(), {
  showFileList: false,
  fileFormat() {
    return [
      'jpg',
      'png',
      'jpeg',
      'mp4',
      'pdf',
      'ppt',
      'docx',
      'doc',
      'xls',
      'xlsx'
    ]
  },
  text: '点击或拖拽文件到此处上传',
  disabled: false,
  listType: 'text',
  max: 99,
  filename: '选择上传附件',
  defaults: false
})
const emit = defineEmits(['update:file-list', 'clear', 'remove'])
const { doUploadRequest, onFinish } = useUploadFile()
function customRequest({ file, onFinish, onError, onProgress }) {
  if (list.length >= props.max) return false
  doUploadRequest(file, onFinish, onError, onProgress, props.defaults, (e) => {
    loading.value = false
    list.value.push({
      name: file.name,
      url: e.full_url
    })
    emit('update:file-list', {
      file,
      url: e.full_url,
      size: e.size,
      type: e.type
    })
  })
}
function beforeUpload({ file }) {
  return checkFile(
    file,
    {
      maxSize: props.maxSize,
      fileFormat: props.fileFormat
    },
    () => {
      loading.value = true
    }
  )
}
function remove(e, index) {
  if (props.disabled || loading.value) return false
  list.value.splice(index, 1)
  emit('remove', { row: e, index })
}
function download(item, index) {
  window.open(item.url)
}
const PreviewRef = ref(<any>{})
function show(item, index) {
  PreviewRef.value.open({ value: item.url })
}
watch(
  () => props.fileList,
  (newVal) => {
    if (newVal) {
      list.value = props.fileList
    }
  },
  { immediate: true, deep: true }
)
function clear() {
  emit('clear')
}
</script>

<style lang="less" scoped>
:deep(.upload) .n-upload-dragger {
  padding: 10px 20px;
}
::v-deep(.n-upload-trigger) {
  width: 100%;
}
.showImg {
  position: relative;
  z-index: 1;
  width: 34px;
  height: 34px;
  .iconfont {
    position: absolute;
    z-index: 2;
    top: -5px;
    right: 0;
    cursor: pointer;
  }
}
.list {
  margin: 10px 0;
  > div {
    margin: 4px 0;
    padding: 0 4px;
    position: relative;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icontext {
      display: flex;
      align-items: center;
    }
    i {
      border-radius: 2px;
      font-size: 17px;
      opacity: 0;
      display: inline-block;
    }
    &:hover {
      background-color: #f5f5f5;
      border-radius: 4px;
      cursor: pointer;
      i {
        opacity: 1;
      }
    }
    p {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      max-width: 95%;
      vertical-align: bottom;
    }
  }
}
</style>
