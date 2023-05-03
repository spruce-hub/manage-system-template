<template>
  <n-data-table
    :size="store.height"
    class="tableStyle"
    :bordered="bordered"
    :single-line="singleLine"
    :columns="columnsItem"
    :data="data"
    :pagination="pagination"
    :scroll-x="scrollX"
    remote
    :flex-height="flexHeight"
    v-model:checked-row-keys="rowKeys"
    :row-key="(row: any) => row.id"
    :children-key="childrenkey"
    :style="`flex-grow: 1`"
    :loading="loading"
  >
  </n-data-table>
</template>
<script lang="ts" setup>
import { NImage } from 'naive-ui'
import image from '@/assets/img/txt.png'
import { useTabsStore, useMenu, useUserInfo, usePerm } from '@/store'
import { useEnumStatus, useFilteringType } from '@/hooks/useEnum'
import { usePopover, useForm } from '@/hooks/usePrat'
import { get, cloneDeep } from 'lodash'
import { useBrand } from '@/store/interfaceApi'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
interface Props {
  columns: Array<any>
  data: Array<object>
  pagination: object | false
  loading?: boolean
  singleLine?: boolean
  bordered?: boolean
  flexHeight?: boolean
  childrenkey: string
}
const store = useTabsStore()
const menuStore = useMenu()
const info = useUserInfo()
const perm = usePerm()
const props = withDefaults(defineProps<Props>(), {
  singleLine: true,
  bordered: false,
  flexHeight: false,
  childrenkey: 'children'
})
const columnsItem = ref(<Array<any>>[])
const rowKeys = ref<number[]>([])
const route: any = useRoute()
const scrollX = computed(() => {
  return props.columns.reduce((acc, vim) => {
    return acc + Number(vim.width)
  }, 0)
})
const emit = defineEmits(['update:filter'])
const OBJComments = ref(<Array<any>>cloneDeep(props.columns))
let v: number = 0
const permIist: Array<string> = perm.$state.list
async function columnsFn({ layoutItem, filtersItem, sortItem }) {
  // let brand = useBrand()
  // let optionsAll = await Promise.all([useFilteringType(), brand.getBrand()])

  OBJComments.value.forEach((item, index: number) => {
    if (item.type === 'selection') {
      v = 1
    }
    if (sortItem.indexOf(item.key) !== -1) {
      let num = sortItem.indexOf(item.key)
      props.columns[num + v] = item
    }
  })
  props.columns.forEach((item: any, index) => {
    item.show = !layoutItem.includes(item.key)
    item.ellipsis = true
    item.resizable = true
    if (item.type !== 'selection' && !item.width) {
      item.width = 150
    }
    // 多选固定
    if (item.type === 'selection') {
      item.width = 40
      item.fixed = 'left'
    }
    // 操作固定
    if (['设置', '操作'].includes(item.title)) {
      item.fixed = 'right'
    }
    // 自定义固定
    if (filtersItem.includes(item.key)) {
      item.fixed = 'left'
    }
    // 过滤
    // if (
    //   !['设置', '操作'].includes(item.title) &&
    //   !['id', 'sort'].includes(item.key) &&
    //   item.type !== 'image'
    // ) {
    //   item.filterMultiple = false
    //   item.filterOptionValue = null
    //   let key_name = 'status'
    //   let options: any = useEnumStatus('启用', '禁用')
    //   if (item.key === 'is_new') {
    //     options = useEnumStatus('是', '否')
    //   } else if (route.name === 'products/goods' && item.key !== 'brand_name') {
    //     key_name = 'status'
    //     options = useEnumStatus('上架', '下架')
    //   }
    //   else if (item.key === 'filter_type') {
    //     options = optionsAll[0]
    //   } else if (item.key === 'brand_name') {
    //     key_name = 'brand_id'
    //     options = optionsAll[1]
    //   }

    //   item.renderFilterMenu = ({ hide }) => {
    //     if (
    //       [
    //         'status',
    //         'status_label',
    //         'is_new'
    //         // 'filter_type',
    //         // 'brand_name'
    //       ].includes(item.key)
    //     ) {
    //       return h(
    //         'div',
    //         { class: 'p-4' },
    //         useForm({
    //           type: 'select',
    //           options,
    //           click(e) {
    //             emit('update:filter', {
    //               key: key_name,
    //               value: e
    //             })
    //           }
    //         })
    //       )
    //     } else if (['created_at', 'updated_at'].includes(item.key)) {
    //       return h(
    //         'div',
    //         { class: 'p-4' },
    //         useForm({
    //           type: 'datetimerange',
    //           click(e) {
    //             if (e && e.length) {
    //               let all = ['between']
    //               let date1 = dayjs(new Date(e[0])).format(
    //                 'YYYY-MM-DD HH:mm:ss'
    //               )
    //               let date2 = dayjs(new Date(e[1])).format(
    //                 'YYYY-MM-DD HH:mm:ss'
    //               )
    //               emit('update:filter', {
    //                 key: item.key,
    //                 value: [...all, date1, date2]
    //               })
    //             } else {
    //               emit('update:filter', {
    //                 key: item.key,
    //                 value: e
    //               })
    //             }
    //           }
    //         })
    //       )
    //     } else {
    //       return h(
    //         'div',
    //         { class: 'p-4' },
    //         useForm({
    //           type: 'input',
    //           click(e) {
    //             emit('update:filter', {
    //               key: item.key,
    //               value: e
    //             })
    //           }
    //         })
    //       )
    //     }
    //   }
    //   item.renderFilterIcon = () => {
    //     return h('i', {
    //       class: 'iconfont icon-screen'
    //     })
    //   }
    //   item.filter = (value, row) => {}
    // }
    // 排序，（id,sort）
    if (['id', 'sort'].includes(item.key)) {
      item.sortOrder = false
      item.sorter = 'default'
    }
    // 图片类型
    if (item.type === 'image') {
      item.width = 100
      item.render = (row) => {
        return h(NImage, {
          style: 'width:30px;max-height:30px;',
          src: get(row, item.key) || image,
          'show-toolbar': false
        })
      }
    }
    if (['status', 'status_label', 'is_new', 'sort', 'id'].includes(item.key)) {
      item.width = 100
    }
    if (!item.render) {
      item.render = (row) =>
        get(row, item.key) || get(row, item.key) === 0
          ? usePopover(get(row, item.key))
          : '-'
    }
    // if (sortItem.indexOf(item.key) !== -1) {
    //   let num = sortItem.indexOf(item.key)
    //   props.columns.splice(num + v, 0, item)
    // }

    /**
     * 按钮权限
     *  ‘*’代表超级管理员，最高权限
     * */
    if (permIist.includes(item.uid)) {
      item.render = (row) => {
        return usePopover(row[item.key])
      }
    }
    if (
      ['operation', 'setup'].includes(item.key) &&
      JSON.stringify(permIist) !== '["*"]'
    ) {
      props.columns[index] = {
        ...item,
        render(row) {
          let all = item.render(row)
          if (Array.isArray(all)) {
            return all.filter((e) => {
              return permIist.includes(e?.props?.uid) || !e?.props?.uid
            })
          } else {
            return item.render(row)
          }
        }
      }
    }
  })
}
let layout: any = {}
let filtersAll: any = {}
let sortAll: any = {}
if (
  !localStorage.getItem('layout') ||
  !localStorage.getItem('filtersAll') ||
  !localStorage.getItem('sortAll')
) {
  layout[route.name] = []
  filtersAll[route.name] = []
  let all: any = []
  all = props.columns.filter((item) => item.type !== 'selection')
  sortAll[route.name] = all.map((item) => item.key)
  localStorage.setItem('layout', JSON.stringify(layout))
  localStorage.setItem('filtersAll', JSON.stringify(filtersAll))
  localStorage.setItem('sortAll', JSON.stringify(sortAll))
  columnsFn({
    layoutItem: layout[route.name],
    filtersItem: filtersAll[route.name],
    sortItem: sortAll[route.name]
  })
} else {
  layout = JSON.parse(localStorage.getItem('layout') || '{}')
  filtersAll = JSON.parse(localStorage.getItem('filtersAll') || '{}')
  sortAll = JSON.parse(localStorage.getItem('sortAll') || '{}')
  Object.keys(layout).forEach((item) => {
    if (!layout[route.name]) {
      layout[route.name] = []
      localStorage.setItem('layout', JSON.stringify(layout))
    }
  })
  Object.keys(filtersAll).forEach((item) => {
    if (!filtersAll[route.name]) {
      filtersAll[route.name] = []
      localStorage.setItem('filtersAll', JSON.stringify(filtersAll))
    }
  })
  Object.keys(sortAll).forEach((item) => {
    if (!sortAll[route.name]) {
      sortAll[route.name] = []
      localStorage.setItem('sortAll', JSON.stringify(sortAll))
    }
  })
  columnsFn({
    layoutItem: layout[route.name] || [],
    filtersItem: filtersAll[route.name] || [],
    sortItem: sortAll[route.name] || []
  })
}
watch(
  () => props.columns,
  (newValue, oldValue) => {
    let id = menuStore.$state.id
    let that = info.$state.userInfo.menu_columns
    // 客户报备比较特殊
    if (that && that[id] && route.path !== '/customer/report') {
      columnsItem.value = newValue.filter((item) => {
        return item.show && that[id].readable.includes(item.alias || item.key)
      })
    } else {
      columnsItem.value = newValue.filter((item) => {
        return item.show
      })
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less">
.n-data-table {
  background-color: @white;
  .n-data-table-indent {
    display: none;
  }
  &.data-table_backstage {
    .n-data-table-th {
      font-weight: normal;
    }
  }
  .n-data-table-expand-trigger {
    display: inline-block;
  }
  .share {
    position: absolute;
    top: 50%;
    right: 0;
    z-index: 2;
    transform: translateY(-50%);
    opacity: 0;
    cursor: pointer;
  }
  .n-data-table-td {
    &:hover .share {
      opacity: 1;
    }
    .n-data-table-td__ellipsis {
      width: 100%;
      position: relative;
      img {
        width: 100%;
      }
    }
  }
  .n-data-table-td:nth-child(1) .n-data-table-td__ellipsis {
    width: calc(100% - 24px);
  }
}
</style>
