<template>
  <div v-if="headerShow" class="etable-header flex items-start justify-between">
    <div class="w-full flex items-center pl-16 mb-14" v-if="nav.length">
      {{ satausName }}：
      <div
        class="flex border-normal pl-14 pr-14 pt-4 pb-4 hover-main cursor-pointer nav-item"
        v-for="(item, index) in nav"
        :key="index"
        :class="active === index ? 'active main-c' : ''"
        @click="navChange(index)"
      >
        {{ item.name }} <span v-if="item.num">（{{ item.num }}）</span>
      </div>
    </div>
    <div class="flex flex-wrap items-center" v-if="filterList.length">
      <Filters
        v-for="(item, index) in filterList"
        :key="index"
        :items="item"
        @update:value="filtersChange"
        ref="FiltersRef"
      />
      <slot name="drawer-content"></slot>
      <n-button
        class="btn mb-14"
        size="small"
        @click="filtersChange('--empty', '')"
      >
        清空筛选
      </n-button>
    </div>
    <div class="flex">
      <template v-if="searchShow">
        <!-- @update:value="keywordChange" -->
        <n-input
          v-if="!$slots.button"
          class="mb-14 mr-10"
          :style="{ width: '185px', height: '30px', 'line-height': '30px' }"
          @keyup.enter="dataFn()"
          size="small"
          v-model:value="form.keyword"
          placeholder="输入关键词搜索"
        >
          <template #prefix>
            <i class="iconfont icon-Search text-18 text-c-1"></i>
          </template>
        </n-input>
      </template>
      <n-space>
        <template v-if="buttons?.length">
          <n-button
            :type="item.type"
            @click="buttonChange(item)"
            size="small"
            v-for="(item, index) in buttons"
            :key="index"
            >{{ item.name }}</n-button
          >
        </template>
        <slot name="button"></slot>
      </n-space>
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
  <div
    style="position: relative"
    class="flex"
    :class="{ 'h-full': flexHeight, 'h-44': headerShow }"
    :style="{ height: height }"
  >
    <n-data-table
      class="tableStyle"
      :size="store.height"
      :bordered="bordered"
      :single-line="singleLine"
      :columns="columnsItem"
      :data="list"
      :pagination="paginationShow ? pagination : false"
      :scroll-x="scrollX"
      :summary="props.summary"
      remote
      :flex-height="flexHeight"
      v-model:checked-row-keys="checkedRowKeys"
      :row-key="(row: any) =>row.id"
      :children-key="childrenkey"
      @update:checked-row-keys="tableCheckRowHandle"
      style="flex-grow: 1"
      :loading="loading"
    >
    </n-data-table>
  </div>
</template>
<script lang="ts" setup>
import { NImage, DataTableColumn } from 'naive-ui'
import image from '@/assets/img/txt.png'
import { useTabsStore, usePerm } from '@/store'
import { usePopover } from '@/hooks/usePrat'
import { http } from '@/apis'
import { onMounted, ref, reactive, watch } from 'vue'
import { get } from 'lodash'
import Filters from './Filters.vue'
interface Props {
  columns: Array<DataTableColumn>
  data?: Array<object>
  headerShow?: boolean
  singleLine?: boolean
  bordered?: boolean
  selectBtn?: Array<any>
  flexHeight?: boolean
  filterList?: Array<any>
  childrenkey?: string
  rowKeys?: Array<number | string>
  buttons?: Array<{ name: string; type: string }>
  height?: string
  async?: boolean
  api?: string
  paginationShow?: boolean
  satausName?: string
  nav?: Array<any>
  searchShow?: boolean
  method?: string
  summary?: Function
}
const active = ref(<number>0)
const store = useTabsStore()
const pages = ref(<number>1)
const pagination = reactive({
  page: 1,
  itemCount: 0,
  simple: true,
  pageSize: store.size,
  showQuickJumper: true,
  suffix: markRaw((info: any) => h('span', `共 ${info.itemCount} 条`)),
  onUpdatePage: markRaw((page: number) => {
    pagination.page = page
    pages.value = page
    dataFn(page)
  })
})
const props = withDefaults(defineProps<Props>(), {
  singleLine: true,
  bordered: false,
  flexHeight: false,
  childrenkey: 'children',
  height: 'auto',
  async: false,
  api: '',
  filterList: () => [],
  paginationShow: true,
  headerShow: false,
  rowKeys: () => [],
  method: 'get',
  nav: () => [],
  searchShow: true
})
const loading = ref(<boolean>false)
const list = ref(<Object[]>[])
const columnsItem = ref(<Array<DataTableColumn>>[])
const checkedRowKeys = ref(<Array<number | string>>[])
let form = ref(<any>{ keyword: '', order: {} })
const scrollX = computed(() => {
  return props.columns.reduce((acc, vim) => {
    return acc + Number(vim.width)
  }, 0)
})

onMounted(() => {
  if (props.api && !props.async) {
    dataFn()
  }
  if (props.rowKeys && props.rowKeys.length) {
    checkedRowKeys.value = props.rowKeys
  }
})
const perm = usePerm()
const permIist: Array<string> = perm.$state.list
const selectBtnItem = ref(<any>[])
/**
 * '*'如果是直接是星号且只有1个是最高权限
 * 如果数组为空则没有任何按钮权限
 */
if (permIist.includes('*') && permIist.length === 1) {
  selectBtnItem.value = props.selectBtn
} else {
  selectBtnItem.value = props.selectBtn?.filter((item) => {
    if (item.uid) {
      return permIist.includes(item.uid)
    } else {
      return true
    }
  })
}

props.columns.forEach((item: any, index: number) => {
  item.ellipsis = true
  item.resizable = true
  if (item.type !== 'selection' && !item.width) {
    item.width = 150
  } else if (item.type === 'selection') {
    item.width = 40
    item.fixed = 'left'
  }
  if (item.show !== false) {
    item.show = true //HACK: 选择展示字段，本地默认全部显示，后期是否后端接入待定
  }
  if (item.type === 'image') {
    item.render = (row) => {
      return h(NImage, {
        style: 'width:30px;max-height:30px;',
        src: get(row, item.key) || image,
        'show-toolbar': false
      })
    }
  }
  if (!item.render) {
    item.render = (row) =>
      get(row, item.key) || get(row, item.key) === 0
        ? usePopover(get(row, item.key))
        : '-'
  }
  //DESC:想要固定这些位置，需要将其他的内容设置宽度即可
  //（因为需要沾满整个屏幕宽度，才可看到具体效果）
  if (item.type === 'selection') {
    item.fixed = 'left'
  }
  if (['设置', '操作'].includes(item.title)) {
    item.fixed = 'right'
  }
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
watch(
  () => props.columns,
  (newValue, oldValue) => {
    columnFilter(newValue)
  },
  { immediate: true, deep: true }
)
// 过滤隐藏字段
function columnFilter(vim) {
  columnsItem.value = vim.filter((item) => {
    return item.show !== false
  })
}
// 第一种形式直接展示数据
watch(
  () => props.data,
  (newValue, oldValue) => {
    if (newValue) {
      list.value = newValue
    }
  },
  { immediate: true, deep: true }
)
// 第二种形式请求方式处理
function dataFn(page = 1, data = {}, cd?: Function) {
  if (JSON.stringify(data) !== '{}') {
    form.value = { ...form.value, ...data }
  }
  loading.value = true
  let obj: any = {
    params: {
      page,
      pageSize: store.size,
      ...form.value
    }
  }
  if (props.method === 'post') {
    obj = {
      page,
      pageSize: store.size,
      ...form.value
    }
  }
  http[props.method](props.api, obj)
    .then(({ data }) => {
      list.value = (data.list || data).map((e, i) => {
        return {
          id: e.id || i,
          ...e
        }
      })
      // pagination.itemCount = data.total || data.list?.length || data.length
      if (data.total) {
        pagination.itemCount = data.total
      } else if (data.list?.length) {
        pagination.itemCount = data.list?.length
      } else if (data.length) {
        pagination.itemCount = data.length
      }
      if (cd) cd(data)
      loading.value = false
    })
    .catch((res) => {
      loading.value = false
    })
}

//NOTE:tab切换
function navChange(index) {
  active.value = index
  emit('onNav', active.value)
}
const emit = defineEmits([
  'update:checked-row-keys',
  'onSelect',
  'onNav',
  'filterschange',
  'onButton'
])
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
  emit('update:checked-row-keys', keys, rows)
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
  if (key === 'template_code' && !value) {
    // 特殊处理审批，不同项目可以删除
    form.value['template_code'] = [
      'in',
      ['customer_credit', 'customer_delay', 'product_special_price']
    ]
  } else if (key === '--empty') {
    initForm()
  } else if ((type === 'datetimerange' || type === 'daterange') && value) {
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
function buttonChange(item) {
  emit('onButton', item)
}
function initForm() {
  props.filterList.forEach((item) => {
    item.value = null
    delete form.value[item.key]
  })
  form.value.keyword = ''
  if (props.filterList.some((e) => e.type === 'search')) {
    FiltersRef.value.forEach((vim) => {
      vim.keywordFn()
    })
  }
  if (props.nav && props.nav.length) {
    let all = props.nav
    form.value.status = all[0].value
  }
  // 特殊处理审批，不同项目可以删除
  if (props.filterList.some((e) => e.key === 'template_code')) {
    form.value['template_code'] = [
      'in',
      ['customer_credit', 'customer_delay', 'product_special_price']
    ]
  }
}
function initAxtive() {
  active.value = 0
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
  () => props.api.substring(0, props.api.indexOf('?')),
  (newValue, oldValue) => {
    initForm()
    dataFn(1)
  }
)
defineExpose({
  dataFn,
  initForm,
  initAxtive,
  page: pages.value,
  excelData,
  excelDataAll,
  keysFn,
  keyAllsFn
})
</script>

<style lang="less" scoped>
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
  .n-data-table-td .n-data-table-td__ellipsis {
    width: 100%;
    img {
      width: 100%;
    }
  }
  .n-data-table-td:nth-child(1) .n-data-table-td__ellipsis {
    width: calc(100% - 24px);
  }
}
.selected {
  height: 36px;
  line-height: 36px;
  padding-bottom: 10px;
  color: @text-c-1;
  .n-button {
    border: 1px solid @line-c-1;
  }
  > span {
    color: @main-c;
  }
}
.h-44 {
  height: calc(100% - 44px) !important;
}
</style>
