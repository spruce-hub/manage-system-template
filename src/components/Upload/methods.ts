import { http } from '@/apis'
import { throttleMessage } from '@/utils'
import axios from 'axios'

const ossHttp = axios.create()
export function useUploadFile() {
  const currentFileUrl = ref('')

  function doUploadRequest(
    file,
    onFinish: () => void,
    onError: () => void,
    onProgress: (any) => void,
    defaults,
    cd: Function
  ) {
    if (!defaults) {
      http
        .get('admin-api/common/upload/config', {
          params: {
            file_name: file.name
          }
        })
        .then(({ data }) => {
          const formData = new FormData()
          Object.keys(data.post_params).forEach((key) => {
            formData.append(key, data.post_params[key])
          })
          formData.append(data.file_key, file.file)
          ossHttp({
            url: data.up_url,
            method: data.post_type,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: formData,
            onUploadProgress: ({ progress = 0 }) => {
              onProgress && onProgress({ percent: Math.ceil(progress * 100) })
            }
          }).then(({ data }) => {
            const res: any = data
            if (res.code === 200) {
              currentFileUrl.value = res.data.full_url
              onFinish()
              cd({ ...res.data })
            } else {
              throttleMessage('error', res.msg)
              onError && onError()
            }
          })
        })
    } else {
      cd({ file })
    }
  }
  function onFinish({ file }) {
    throttleMessage('success', '上传成功')
    return file
  }

  return {
    doUploadRequest,
    currentFileUrl,
    onFinish
  }
}

// 判断上传类型
interface Options {
  maxSize?: number
  fileFormat?: Array<{}>
  cd?: Function
}
export function checkFile(
  file: Required<import('naive-ui').UploadFileInfo>,
  options?: Options,
  cd?: Function
) {
  const { maxSize, fileFormat = ['jpg', 'jpeg', 'png', 'pdf'] } = options || {}
  const nowSize = file.file!.size / 1024 / 1024
  const fileType = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!fileType || !fileFormat.includes(fileType as any)) {
    window.$message.info('文件格式不正确')
    return false
  }

  if (maxSize) {
    if (nowSize > maxSize) {
      window.$message.error(`文件大小不能超过${Math.floor(maxSize)}M`)
      return false
    }
  } else {
    if (['png', 'jpg', 'jpeg'].includes(fileType!)) {
      if (nowSize > 5) {
        window.$message.error(`图像大小不能超过5M`)
        return false
      }
    } else if ('mp4' === fileType) {
      if (nowSize > 50) {
        window.$message.error(`视频大小不能超过50M`)
        return false
      }
    } else if (nowSize > 20) {
      window.$message.error(`文件大小不能超过20M`)
      return false
    }
  }
  if (cd) cd()
  return true
}
