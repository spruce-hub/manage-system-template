import { throttle } from 'lodash'
/*
  用于统一管理无数据时的占位字符
  注意: 如果单独引用占位字符，请引用emptyPlaceholder变量。
*/
export const emptyPlaceholder = '-'
export const emptyFormat = (data: string | number | undefined | null) => {
  return data || emptyPlaceholder
}

/*
  向服务器请求异步组件时失败的交互，一般出现于版本更新后
*/
export const handleImportError = (error: Error) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.$message.info('检测到网站存在更新，即将自动刷新')
    setTimeout(() => {
      location.reload()
    }, 1500)
  }
}

/*
  对消息提醒进行节流
*/
export const throttleMessage = throttle((type, msg) => {
  window.$message[type](msg)
}, 3000)

/*
  对元素进行聚焦，并把光标移到末尾
*/
export const focusElementEnd = (element) => {
  element.focus()
  const range = window.getSelection() //创建光标range
  if (range) {
    range.selectAllChildren(element) //range 选择obj下所有子内容
    range.collapseToEnd() //光标移至最后
  }
}
