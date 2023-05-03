/**
 * @Description: 删除操作
 * @param {*} params
 * @return {*}
 */
import { http } from '@/apis'
export function useDelete(params) {
  const { element, tableEl, name, api, form, success } = params
  let html = ''
  if (!Array.isArray(form.id)) {
    html = `您正在将“<span class="main-c">${name}</span>”进行删除，是否继续？`
  } else {
    html = `您正在将${name}进行删除，是否继续？`
  }
  element
    .open({
      title: '删除',
      html,
      okText: '继续'
    })
    .then(() => {
      element.loading = true
      http
        .post(api, { data: form })
        .then((res) => {
          tableEl.dataFn(tableEl.page)
          element.loading = false
          element.show = false
          window.$message.success('删除成功')
          success()
        })
        .catch((res) => {
          element.loading = false
          element.show = false
        })
    })
}
// 任意操作
export function useOper(params) {
  const { element, title, html, api, form, success, method, icon } = params
  element
    .open({
      title,
      html,
      okText: '继续',
      icon: icon != undefined ? icon : true
    })
    .then(() => {
      element.loading = true
      http[method || 'get'](api, {
        ...form
      })
        .then((res) => {
          element.loading = false
          element.show = false
          success()
        })
        .catch((res) => {
          element.loading = false
          element.show = false
        })
    })
}

/**
 * @Description: 设置状态
 * @param {*} params
 * @return {*}
 */
export function useSetStatus(params) {
  const { element, tableEl, name, status, api, okText, clearText, form, key } =
    params
  const is_status_ok = okText || '启用'
  const is_status_error = clearText || '禁用'

  let html = ''
  if (!Array.isArray(form.id)) {
    html = `您正在将“<span class="main-c">${name}</span>”进行${
      status === 1 ? is_status_ok : is_status_error
    }，是否继续？`
  } else {
    html = `您正在将${name}进行${
      status === 1 ? is_status_ok : is_status_error
    }，是否继续？`
  }

  element
    .open({
      title: status === 1 ? is_status_ok : is_status_error,
      html,
      okText: '继续'
    })
    .then(() => {
      element.loading = true
      http
        .post(api, {
          ...form
        })
        .then((res) => {
          tableEl.dataFn(tableEl.page)
          element.loading = false
          element.show = false
          window.$message.success(
            `${status === 1 ? is_status_ok : is_status_error}成功`
          )
        })
        .catch((res) => {
          element.loading = false
          element.show = false
        })
    })
}

// 全屏
export function openFullscreen() {
  const elem: any = document.getElementsByTagName('body')[0]
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.mozRequestFullScreen) {
    elem.mozRequestFullScreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen()
  }
}
// 取消全屏
export function exitFullscreen() {
  const elem: any = document
  if (elem.exitFullscreen) {
    elem.exitFullscreen()
  } else if (elem.webkitCancelFullScreen) {
    elem.webkitCancelFullScreen()
  } else if (elem.mozCancelFullScreen) {
    elem.mozCancelFullScreen()
  } else if (elem.msExitFullscreen) {
    elem.msExitFullscreen()
  }
}
