<template>
  <n-drawer
    v-model:show="show"
    :width="300"
    placement="right"
    :close-on-esc="false"
    :auto-focus="false"
    :mask-closable="false"
  >
    <n-drawer-content>
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="text-18">设置</div>
          <div class="modal-icon" @click="clear">
            <i class="iconfont icon-close-1 text-c-2 text-24 weight-400"></i>
          </div>
        </div>
      </template>
      <template #footer>
        <n-space>
          <n-button type="primary" @click="submit">应用</n-button>
          <n-button color="#fff" class="text-c-0 other-btn" @click="reset">
            重置
          </n-button>
        </n-space>
      </template>
      <template #default>
        <div class="header flex items-center justify-between">
          <span>表头设置</span>
        </div>
        <div class="px-16 flex justify-between items-center mb-14">
          <span class="text-c-1 text-12">每页显示数量</span>
          <ul class="flex items-center">
            <li
              class="text-c-1 text-12"
              v-for="(item, index) in limits"
              :key="index"
              :class="{ active: item.value === size }"
              @click="titleChange(item)"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>
        <div class="px-16 flex justify-between items-center mb-14">
          <span class="text-c-1 text-12">表格行高设置</span>
          <ul class="flex items-center">
            <li
              class="text-c-1 text-12"
              v-for="(item, index) in radio"
              :key="index"
              :class="{ active: item.value === height }"
              @click="tableChange(item)"
            >
              {{ item.label }}
            </li>
          </ul>
        </div>
        <div class="px-16 flex justify-between items-center">
          <span class="text-c-1 text-12">恢复默认</span>
          <ul class="flex items-center">
            <li class="text-c-1 text-12" @click="recover">恢复</li>
          </ul>
        </div>
        <div class="header flex items-center justify-between">
          <span>表格设置</span>
          <n-popover trigger="hover">
            <template #trigger>
              <i class="iconfont icon-more cursor-pointer"></i>
            </template>
            <div>
              <p
                class="text-c-2 mb-4 cursor-pointer hover-main"
                @click="tabChange(1)"
              >
                恢复系统默认
              </p>
              <p
                class="text-c-2 cursor-pointer hover-main"
                @click="tabChange(0)"
              >
                关闭所有字段
              </p>
            </div>
          </n-popover>
        </div>
        <div class="px-16 mb-10">
          <n-input
            size="small"
            clearable
            @input="searchFn"
            v-model:value="search"
          >
            <template #prefix>
              <i class="iconfont icon-Search"></i>
            </template>
          </n-input>
        </div>
        <draggable
          :list="columnItems"
          handle=".icon-drag"
          :animation="100"
          item-key="id"
        >
          <template #item="{ element, index }">
            <div class="items">
              <div
                class="list flex items-center justify-between"
                v-if="
                  element.type !== 'selection' &&
                  !['设置', '操作'].includes(element.title)
                "
              >
                <div class="flex items-center">
                  <n-switch size="small" v-model:value="element.show" />
                  <p
                    style="font-size: 12px"
                    class="pl-8"
                    v-html="element.title"
                  ></p>
                </div>
                <div class="flex items-center">
                  <i
                    class="iconfont mr-4 cursor-pointer"
                    :class="[
                      element.fixed === 'left' ? 'icon-unlock' : 'icon-lock'
                    ]"
                    @click="lockChange(element)"
                  ></i>
                  <i
                    class="iconfont icon-upload mr-4 cursor-pointer"
                    v-if="istype ? index !== 1 : index !== 0"
                    @click="updown(index)"
                  ></i>
                  <i class="iconfont icon-drag cursor-pointer"></i>
                </div>
                <div
                  class="text-c-2 text-12 font"
                  v-if="element.fixed === 'left'"
                >
                  已锁定
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
import draggable from 'vuedraggable'
import { DataTableColumn } from 'naive-ui'
import { ref, reactive } from 'vue'
import { useTabsStore, useMenu, useUserInfo } from '@/store'
import { useRoute } from 'vue-router'
interface Props {
  columns: Array<DataTableColumn>
}
const props = withDefaults(defineProps<Props>(), {
  columns: () => []
})
const radio = reactive(<{ label: string; value: string }[]>[
  { label: '紧凑', value: 'small' },
  { label: '舒适', value: 'medium' },
  { label: '宽敞', value: 'large' }
])
const limits = reactive(<{ label: string; value: number }[]>[
  { label: '20', value: 20 },
  { label: '50', value: 50 },
  { label: '100', value: 100 }
])
const route: any = useRoute()
const show = ref(<boolean>false)
let columnAll = ref(<any>[])
let columnItems = ref(<any>[])
const search = ref(<string>'')
const store = useTabsStore()
const size = ref(<number>store.size) //分页数量
const istype = ref(<boolean>false)
const height = ref(<string>store.height) //行高
const menuStore = useMenu()
const info = useUserInfo()

function open() {
  show.value = true
  columnItems.value.forEach((vim: any) => {
    vim.sub_title = vim.title
  })
  istype.value = columnItems.value.some((vim: any) => vim.type === 'selection')

  columnAll.value = JSON.parse(JSON.stringify(columnItems.value))
}
let filters_len: number = 0
watch(
  () => props.columns,
  (newVal) => {
    let id = menuStore.$state.id
    let that = info.$state.userInfo.menu_columns
    // 客户报备比较特殊
    if (that && that[id] && route.path !== '/customer/report') {
      columnItems.value = newVal.filter((e) =>
        that[id].readable.includes(e.alias || e.key)
      )
    } else {
      columnItems.value = newVal
    }
    filters_len = columnItems.value.filter(
      (item: any) =>
        item.fixed &&
        !['设置', '操作'].includes(item.title) &&
        item.type !== 'selection'
    ).length
  },
  { immediate: true, deep: true }
)
// 是否锁定
function lockChange(item) {
  if (item.fixed === 'left') {
    filters_len--
    delete item.fixed
  } else {
    filters_len++
    if (filters_len > 5) {
      return window.$message.info('最多锁定5个')
    }
    item.fixed = 'left'
  }
}
// 操作表头
function titleChange(item) {
  size.value = item.value
}

function tableChange(item) {
  height.value = item.value
}

// 向上挪动
function updown(i) {
  columnItems.value[i] = columnItems.value.splice(
    i - 1,
    1,
    columnItems.value[i]
  )[0]
}

// 关闭所有字段
function tabChange(i) {
  columnItems.value.forEach((item: any) => {
    if (
      item.type !== 'selection' &&
      !['设置', '操作'].includes(item.title) &&
      i === 0
    ) {
      item.show = false
    } else {
      item.show = true
    }
  })
}
const time = ref(<any>null)
// 字段搜索
function searchFn(e) {
  clearTimeout(time.value)
  time.value = setTimeout(() => {
    empty()
    if (e) {
      columnItems.value.forEach((item: any) => {
        if (item.title && item.title.indexOf(e) !== -1) {
          item.title = setString(item.title, item.title.indexOf(e), '<span>')
          item.title = setString(
            item.title,
            item.title.indexOf(e) + e.length,
            '</span>'
          )
        }
      })
    } else {
      columnItems.value.forEach((vim: any) => {
        vim.title = vim.sub_title
      })
    }
  }, 800)
}
function setString(soure, start, newStr) {
  return soure.slice(0, start) + newStr + soure.slice(start)
}
// 关闭
function clear() {
  show.value = false
  size.value = store.size
  height.value = store.height
  search.value = ''
  empty()
}
// 重置
function reset() {
  search.value = ''
  empty()
  recover()
}
// 更换表头设置
function empty() {
  columnItems.value.forEach((item, index) => {
    if (columnAll.value[index] && !columnAll.value[index].fixed) {
      delete item.fixed
    }
    item = Object.assign(item, columnAll.value[index])
  })
}
// 恢复
function recover() {
  size.value = 50
  height.value = 'medium'
}

const emit = defineEmits(['update'])
// 应用
function submit() {
  const layout = JSON.parse(localStorage.getItem('layout') || '{}')
  let all: any = []
  all = columnItems.value.filter((item) => !item.show)
  layout[route.name] = all.map((item) => item.key)
  localStorage.setItem('layout', JSON.stringify(layout))

  const filtersAll = JSON.parse(localStorage.getItem('filtersAll') || '{}')
  let arr: any = []
  arr = columnItems.value.filter(
    (item: any) =>
      item.fixed &&
      !['设置', '操作'].includes(item.title) &&
      item.type !== 'selection'
  )
  filtersAll[route.name] = arr.map((item) => item.key)
  localStorage.setItem('filtersAll', JSON.stringify(filtersAll))

  const sortAll = JSON.parse(localStorage.getItem('sortAll') || '{}')
  let ttd: any = []
  ttd = columnItems.value.filter((item) => item.type !== 'selection')
  sortAll[route.name] = ttd.map((item) => item.key)
  localStorage.setItem('sortAll', JSON.stringify(sortAll))

  store.setTabsSize(size.value)
  store.setTabsHeight(height.value)
  show.value = false
  emit('update')
}
defineExpose({
  open
})
</script>
<style lang="less" scoped>
.list {
  padding: 7px 16px;
  border-radius: 2px;
  height: 40px;

  &:hover {
    background: #f4f7fc;
    .iconfont {
      display: block;
    }
    .font {
      display: none;
    }
  }
  ::v-deep(span) {
    background-color: #fff5d3;
  }
  .iconfont {
    display: none;
  }
  .font {
    display: block;
  }
}
.other-btn {
  border: 1px solid @line-c-1;
  &:focus,
  &:hover {
    color: @text-c-1;
  }
}
.n-drawer .n-drawer-content {
  :deep(.n-drawer-body-content-wrapper) {
    padding: 0;
  }
  :deep(.n-drawer-header) {
    min-height: 56px;
  }
}
.header {
  padding: 16px;
  font-weight: bold;
}
.px-16 {
  padding: 0 16px;
}
ul li {
  padding: 3px 6px;
  border: 1px solid @line-c-0;
  cursor: pointer;
  border-left: 0;
  &:nth-child(1) {
    border-left: 1px solid @line-c-0;
  }
  &:hover {
    background-color: @line-c-0;
  }
  &.active {
    color: @white;
    background-color: @main-c;
  }
}
</style>
