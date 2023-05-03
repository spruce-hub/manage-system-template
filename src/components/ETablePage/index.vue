<template>
  <div class="layout-content" id="layout-content">
    <div class="top flex items-center py-4" v-if="title || $slots.button">
      <div class="title flex items-center">
        <span class="text-c-0">{{ menuStore.$state.name }}</span>
        <i
          v-if="menuStore.$state.name"
          class="iconfont icon-arrow_right text-20"
          style="padding: 0 6px"
        ></i>
        <span class="text-c-1">{{ title }}</span>
        <slot name="title" v-if="$slots.title"></slot>
      </div>
      <div class="flex items-center content">
        <div v-if="search" class="mr-10">
          <!-- @update:value="keywordChange" -->
          <n-input
            size="small"
            v-model:value="form.keyword"
            :placeholder="placeholder"
            :style="{ width: '185px', height: '30px', 'line-height': '30px' }"
            @keyup.enter="dataFn()"
          >
            <template #suffix>
              <i class="iconfont icon-Search text-c-1"></i>
            </template>
          </n-input>
        </div>
        <div>
          <!-- NOTE:自定义新建，导入，导出 -->
          <n-space>
            <template v-if="buttonsItem?.length">
              <n-button
                @click="buttonChange(item)"
                :type="item.type"
                size="small"
                v-for="(item, index) in buttonsItem"
                :key="index"
                >{{ item.name }}</n-button
              >
            </template>
            <slot name="button"></slot>
          </n-space>
        </div>
      </div>
    </div>
    <div class="content-body" :class="{ height: title || $slots.button }">
      <template v-if="navListShow">
        <div
          class="w-full flex items-center pl-16 mb-14"
          v-if="nav.length || navList.length"
        >
          {{ satausName }}：
          <div
            class="flex border-normal pl-14 pr-14 pt-4 pb-4 hover-main cursor-pointer nav-item"
            v-for="(item, index) in nav.length ? nav : navList"
            :key="index"
            :class="active === index ? 'active main-c' : ''"
            @click="navChange(index)"
          >
            {{ item.name || item[navLabel] }}
            <span v-if="item.num || item.count"
              >（{{ item.num || item[navValue] }}）</span
            >
          </div>
        </div>
      </template>
      <div
        class="flex header"
        :style="{
          'justify-content': !filterList.length ? 'flex-end' : 'space-between'
        }"
      >
        <div v-if="filterList.length">
          <div class="flex flex-wrap">
            <div v-for="(item, index) in filterList" :key="index">
              <Filters
                :items="item"
                @update:value="filtersChange"
                @change="settop()"
                ref="FiltersRef"
              />
            </div>
            <!-- NOTE:自定义高级筛选 -->
            <slot name="drawer-content"></slot>
            <n-button
              class="btn mb-14"
              size="small"
              @click="filtersChange('--empty', '')"
            >
              清空筛选
            </n-button>
          </div>
        </div>
        <div class="flex items-center">
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <i
                @click="sortsRef.open()"
                class="iconfont icon-setting text-20 cursor-pointer"
              ></i>
            </template>
            设置
          </n-tooltip>
          <n-tooltip trigger="hover" placement="top">
            <template #trigger>
              <i
                @click="dataFn()"
                :class="{ loading: loading }"
                class="iconfont icon-refresh text-20 ml-20 cursor-pointer"
              ></i>
            </template>
            刷新
          </n-tooltip>
        </div>
      </div>
      <div
        class="flex items-center selected text-12"
        v-if="selectBtnItem && selectBtnItem.length && checkedRowKeys.length"
      >
        已选中&nbsp;<span>{{ checkedRowKeys.length }}</span
        >&nbsp;项
        <n-space v-if="selectBtnItem && selectBtnItem.length" class="ml-8">
          <n-button
            @click="onSelect(item)"
            color="#fff"
            text-color="#4A5468"
            v-for="(item, index) in selectBtnItem"
            :key="index"
            size="small"
          >
            {{ item.name }}
          </n-button>
        </n-space>
        <div class="ml-10" v-if="$slots.select">
          <!-- NOTE:自定义选中选择功能 -->
          <slot name="select"></slot>
        </div>
      </div>
      <UTable
        :checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="list"
        :pagination="pagination"
        :loading="loading"
        :single-line="singleLine"
        :bordered="bordered"
        :flex-height="true"
        :childrenkey="childrenkey"
        @update:checked-row-keys="tableCheckRowHandle"
        @update:sorter="handleSorterChange"
        @update:filter="filterChange"
      >
      </UTable>
    </div>
  </div>

  <Sorts :columns="columns" ref="sortsRef" @update="dataFn()" />
</template>
<script lang="ts" setup>
import Filters from './Filters.vue'
import UTable from './UTable.vue'
import Sorts from './Sorts.vue'
import { http } from '@/apis'
import { DataTableColumn } from 'naive-ui'
import { useTabsStore, usePerm } from '@/store'
import { onUnmounted } from 'vue'
import { useMenu } from '@/store'
import { get } from 'lodash'

interface Props {
  placeholder?: string
  header?: boolean
  columns: Array<DataTableColumn>
  singleLine?: boolean
  bordered?: boolean
  search?: boolean
  title?: string
  buttons?: Array<{ name: string; type: string; uid?: string }>
  selectBtn?: Array<any>
  childrenkey?: string
  filterList?: Array<any>
  satausName?: string
  nav?: any
  async?: boolean
  api?: string
  method?: string
  navListShow?: boolean // nav 是否显示
  navInitCursor?: number // nav 初始索引指向
  navEditFiled?: string // nav 点击后需要查询的key
  navLabel?: string // nav 显示标题的key字段
  navValue?: string // nav 显示数量的value字段
}
const menuStore = useMenu()
const store = useTabsStore()
const props = withDefaults(defineProps<Props>(), {
  header: true,
  singleLine: true,
  bordered: false,
  search: true,
  filterList: () => [],
  satausName: '审核状态',
  nav: () => [],
  async: false,
  method: 'get',
  navListShow: true,
  navInitCursor: 0,
  navEditFiled: 'status',
  navLabel: 'title',
  navValue: 'count',
  placeholder: '输入关键词搜索'
})
const sortsRef = ref(<typeof Sorts>{})
const active = ref(<number>props.navInitCursor)
const emit = defineEmits([
  'update:checked-row-keys',
  'onSelect',
  'onNav',
  'filterschange',
  'onButton'
])
let form = ref(<any>{ keyword: '', order: {} })
const checkedRowKeys = ref(<Array<number | string>>[])
const pagesNum = ref(<number>1)
const pagination = ref(pagesFn({ pages: 1, count: 0, total: 0 }))

const perm = usePerm()
const permIist: Array<string> = perm.$state.list
const selectBtnItem = ref(<any>[])
const buttonsItem = ref(<any>[])
if (permIist.includes('*') && permIist.length === 1) {
  selectBtnItem.value = props.selectBtn
  buttonsItem.value = props.buttons
} else {
  selectBtnItem.value = props.selectBtn?.filter((item) => {
    if (item.uid) {
      return permIist.includes(item.uid)
    } else {
      return true
    }
  })
  buttonsItem.value = props.buttons?.filter((item) => {
    if (item.uid) {
      return permIist.includes(item.uid)
    } else {
      return true
    }
  })
}

//NOTE:排序
function handleSorterChange(e) {
  let vim: any = props.columns.find((item: any) => {
    return item.key === e.columnKey
  })
  if (vim.sortOrder === undefined) return
  if (!e) {
    vim.sortOrder = false
    return
  }
  vim.sortOrder = vim.key === e.columnKey ? e.order : undefined
  switch (e.order) {
    case 'descend':
      form.value.order[vim.key] = 'desc'
      break
    case 'ascend':
      form.value.order[vim.key] = 'asc'
      break
    default:
      form.value.order[vim.key] = undefined
      break
  }
  dataFn()
}
//NOTE:筛选
const FiltersRef = ref(<typeof Filters>{})
function filtersChange(
  key,
  value,
  type = 'text',
  mode = 'eq',
  affiliate: Array<string> = []
) {
  if (key === '--empty') {
    props.filterList.forEach((item) => {
      item.value = null
      if (Object.keys(form.value).some((vim) => ['code'].includes(vim))) {
        let em = {
          code: form.value.code,
          isCc: false,
          status: 0
        }
        form.value = em
      } else if ((props.nav && props.nav.length) || navList.value.length) {
        let all = props.nav.length ? props.nav : navList.value
        form.value = {
          status: all[0][props.navEditFiled]
        }
      } else {
        form.value = {}
      }
      active.value = 0
    })
    form.value.keyword = ''
    if (props.filterList.some((e) => e.type === 'search')) {
      FiltersRef.value.forEach((vim) => {
        vim.keywordFn()
      })
    }
  } else if (
    (type === 'datetimerange' ||
      type === 'daterange' ||
      type === 'monthrange') &&
    value
  ) {
    form.value[key] = ['between']
    form.value[key] = form.value[key].concat(...value)
  } else if (key === 'keyword') {
    form.value['keyword'] = value
  } else if (mode === 'eq') {
    form.value[key] = value || value === 0 ? value : undefined
  } else if (value || value === 0) {
    form.value[key] = [mode, value]
  } else {
    form.value[key] = undefined
  }
  props.filterList.forEach((item) => {
    if (affiliate.includes(item.key)) {
      item.value = null
      form.value[item.key] = undefined
    }
  })
  dataFn()
  emit('filterschange', key, value)
}
let time: any = null
//NOTE:过滤
function filterChange({ key, value }) {
  form.value[key] = value
  clearTimeout(time)
  time = setTimeout(() => {
    dataFn()
  }, 800)
}
let list = ref(<any>[])
const navList = ref<Array<Record<string, any>>>([])
const loading = ref(<boolean>false)
onMounted(() => {
  if (!props.async) {
    dataFn()
  }
})
function dataFn(page: number = 1, cd?: Function, data = {}) {
  if (JSON.stringify(data) !== '{}') {
    form.value = { ...form.value, ...data }
  }
  loading.value = true
  let obj: any = {
    params: {
      page,
      pageSize: Number(store.size),
      ...form.value
    }
  }
  if (props.method === 'post') {
    obj = {
      page,
      pageSize: Number(store.size),
      ...form.value
    }
  }
  http[props.method](props.api, obj)
    .then((res) => {
      loading.value = false
      // 特殊处理菜单管理列表
      if (props.api === 'admin-api/admin-user/menu/tree') {
        list.value = sortFn(res.data.tree)
      } else {
        list.value = res.data.list || res.data.tree || res.data
      }
      pagination.value = pagesFn({
        pages: page,
        count: Math.ceil(pagination.value.itemCount || 1 / Number(store.size)),
        total: res.data.total || res.data.length
      })
      settop()
      if (cd) cd()

      if (props.navListShow && !props.nav?.length && res.data.tab.length) {
        navList.value = res.data.tab
      }
    })
    .catch(() => {
      loading.value = false
    })
}
function sortFn(all) {
  tree(all)
  function tree(vim) {
    vim.sort((a: any, b: any) => b.sort - a.sort)
    vim.forEach((item) => {
      if (item.children && item.children.length) {
        sortFn(item.children)
      }
    })
  }
  return all
}
// 分页函数
function pagesFn({ count, total, pages }) {
  return {
    page: pages,
    itemCount: total,
    simple: true,
    pageSize: store.size,
    pageCount: count,
    showQuickJumper: true,
    suffix: markRaw((info: any) => h('span', `共 ${info.itemCount} 条`)),
    onUpdatePage: markRaw((page: number) => {
      pagesNum.value = page
      dataFn(page)
    })
  }
}

//NOTE:tab切换
function navChange(index) {
  active.value = index
  if (props.nav.length) {
    emit('onNav', active.value)
  } else if (navList.value.length) {
    form.value[props.navEditFiled] =
      navList.value[active.value][props.navEditFiled] === ''
        ? undefined
        : navList.value[active.value][props.navEditFiled]
    dataFn()
  }
}
//NOTE:选中后的操作
function onSelect({ name }) {
  if (!checkedRowKeys.value.length) {
    return window.$message.info('请选择内容')
  }
  emit('onSelect', name)
}
//NOTE:多选操作
const rowsList = ref(<any>[])
function tableCheckRowHandle(keys, rows) {
  checkedRowKeys.value = keys
  rowsList.value = rows
  settop()
  emit('update:checked-row-keys', keys, rows)
}
function buttonChange(item) {
  emit('onButton', item)
}
// 导出excel的数据
function excelData() {
  let excel: any = [] //导出选项
  let columnsExcel: any = [] // 可导出选项
  columnsExcel = props.columns.filter(
    (item: any) =>
      (['设置', '操作'].includes(item.title) || item.type !== 'selection') &&
      item.show
  )
  columnsExcel = columnsExcel.map((vim) => {
    return {
      title: vim.title,
      key: vim.key
    }
  })
  rowsList.value.forEach((item) => {
    let OBJ_DATA = {}
    columnsExcel.forEach((vim) => {
      if (vim.title !== '序号') OBJ_DATA[vim.title] = get(item, vim.key)
    })
    excel.push(OBJ_DATA)
  })
  return excel
}

function excelDataAll() {
  let excel: any = [] //导出选项
  let columnsExcel: any = [] // 可导出选项
  columnsExcel = props.columns.filter(
    (item: any) =>
      ['设置', '操作'].includes(item.title) || item.type !== 'selection'
  )
  columnsExcel = columnsExcel.map((vim) => {
    return {
      title: vim.title,
      key: vim.key
    }
  })
  rowsList.value.forEach((item) => {
    let OBJ_DATA = {}
    columnsExcel.forEach((vim) => {
      if (vim.title !== '序号') OBJ_DATA[vim.title] = get(item, vim.key)
    })
    excel.push(OBJ_DATA)
  })
  return excel
}
function keysFn() {
  let columnsExcel: any = [] // 可导出选项
  columnsExcel = props.columns.filter(
    (item: any) =>
      (['设置', '操作'].includes(item.title) || item.type !== 'selection') &&
      item.show
  )
  return columnsExcel.map((vim) => {
    return {
      title: vim.title,
      key: vim.key
    }
  })
}
function keyAllsFn() {
  let columnsExcel: any = [] // 可导出选项
  columnsExcel = props.columns.filter(
    (item: any) =>
      ['设置', '操作'].includes(item.title) || item.type !== 'selection'
  )
  return columnsExcel.map((vim) => {
    return {
      title: vim.title,
      key: vim.key
    }
  })
}

watch(
  () => list.value,
  (newValue, oldValue) => {
    let rows: any = []
    let ids = newValue.map((item: any) => item.id)
    checkedRowKeys.value = checkedRowKeys.value.filter((key) =>
      ids.includes(key)
    )
    rows = newValue.filter((item: any) =>
      checkedRowKeys.value.includes(item.id)
    )
    emit('update:checked-row-keys', checkedRowKeys.value, rows)
  }
)
watch(
  () => props.columns,
  (newValue, oldValue) => {
    settop()
  },
  { immediate: true, deep: true }
)
let top = ref(<number>0)
window.onresize = () => settop()
function settop() {
  nextTick(() => {
    let dom: any = document.querySelector('.tableStyle')
    top.value = dom?.offsetTop || 0
  })
}
onUnmounted(() => settop())
defineExpose({
  dataFn,
  page: pagesNum,
  excelData,
  excelDataAll,
  keysFn,
  keyAllsFn
})
</script>
<style lang="less" scoped>
.icon-refresh {
  &::before {
    display: block;
  }
  &.loading::before {
    display: block;
    transform: rotate(720deg);
    transition: all 1s;
  }
}
.layout-content {
  background: @white;
  margin: 8px;
  height: calc(100vh - 70px);
  .content-body {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    position: relative;
    &.height {
      height: calc(100% - 50px);
    }
    .nav-item {
      background: #f6f8fa;
    }
    .active {
      background: @white;
    }
  }
  .header {
    padding: 0 16px;
    justify-content: space-between;
    align-items: flex-start;
    .btn {
      height: 30px;
      line-height: 30px;
    }
  }
}
.top {
  min-height: 50px;
  justify-content: space-between;
  padding: 16px 16px 10px;
  .title {
    font-size: 16px;
  }
  .content {
    justify-content: flex-end;
  }
}
::v-deep(.n-drawer) {
  .n-drawer-content {
    display: block;
  }
  .n-drawer-body-content-wrapper {
    height: initial !important;
    overflow: initial !important;
  }
}
.n-popover .n-popover__content {
  padding: 0;
}
.selected {
  height: 36px;
  line-height: 36px;
  padding: 0 16px 10px;
  color: @text-c-1;
  .n-button {
    border: 1px solid @line-c-1;
  }
  > span {
    color: @main-c;
  }
}
</style>
