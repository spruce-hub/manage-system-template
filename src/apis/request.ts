import { extend } from 'umi-request'
import { clearToken, getToken } from './token'

export const http = extend({
  prefix: import.meta.env.DEV
    ? '/dev/'
    : 'https://lingaiapi.online.dev.fyunshan.com/',
  timeout: 60000,
  headers: {
    Authorization: getToken()
  }
})

http.interceptors.response.use(async (response, options) => {
  const data = await response.clone().json()
  const { ok, status, statusText } = response
  const { rejectByCode = true, errorMsg = true } = options
  if (ok) {
    if (data.code !== 200) {
      errorMsg && window.$message.error(data.message)
      if (rejectByCode) {
        return Promise.reject(data)
      }
    } else {
      return data
    }
  } else {
    const msg = status + ' ' + data.message || statusText
    switch ((status / 100).toFixed(0)) {
      case '4':
        window.$message.error(`请求错误：${msg}`)
        break
      case '5':
        window.$message.error(`服务器错误：${msg}`)
        break
      default:
        window.$message.error(msg)
        break
    }
    return Promise.reject(data)
  }
})

export function setHttpToken(str?: string) {
  const token = str || getToken()
  http.extendOptions({
    headers: {
      Authorization: token
    }
  })
}
