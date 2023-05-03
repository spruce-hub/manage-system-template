import { http } from '@/apis'
import * as xlsx from 'xlsx/xlsx.mjs'
// 判断key是否在对象内
export function isValidKey(
  key: string | number | symbol,
  object: object
): key is keyof typeof object {
  return key in object
}
// 下载文件
export function download(url: string, name?: string) {
  fetch(url)
    .then(async (res) => await res.blob())
    .then((blob) => {
      // 创建隐藏的可下载链接
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = URL.createObjectURL(blob)
      // 保存下来的文件名
      a.download =
        name ||
        url.split('.')[url.split('.').length - 2] +
          '.' +
          url.split('.')[url.split('.').length - 1]
      document.body.appendChild(a)
      a.click()
      // 移除元素
      document.body.removeChild(a)
    })
}

export function blobDownLoad(res: any, fileName?: string, type?: string) {
  const data = res
  const url = window.URL.createObjectURL(
    new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })
  )
  const link = document.createElement('a')
  if (fileName) {
    link.download = fileName
    // link.download = `${fileName}.${type?.toLowerCase() || 'xlsx'}`
  }
  link.style.display = 'none'
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 获取表单项配置
export async function getFormSetting(code) {
  let fields = []
  await http
    .get('admin-api/approval/template/get-data-column?code=' + code)
    .then((res) => {
      fields = res.data.data_column
    })
  return fields
}

/**
 * 导出 excel 文件
 * @param array JSON 数组
 * @param sheetName 第一张表名
 * @param fileName 文件名
 *
 * array格式：[{'姓名'：'你好'},{'性别':'男'}]
 */
export function exportExcelFile({
  array,
  sheetName = 'sheet1',
  fileName = '表格',
  fileType = 'XLSX'
}) {
  const jsonWorkSheet = xlsx.utils.json_to_sheet(array)
  const workBook = {
    SheetNames: [sheetName],
    Sheets: {
      [sheetName]: jsonWorkSheet
    }
  }
  return xlsx.writeFile(workBook, `${fileName}.${fileType}`)
}
