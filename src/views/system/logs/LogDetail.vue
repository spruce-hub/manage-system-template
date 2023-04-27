<template>
  <CSDetail
    :show="show"
    :tabs="tabs"
    @refresh="change(active)"
    @clear="clear"
    @change="change"
    :number="active"
  >
    <template #title>
      <div class="flex items-center">
        <n-tag type="success" size="small"> 日志 </n-tag>
        <span class="ml-8 text-18 text-c-0">{{ items.name }}</span>
      </div>
    </template>
    <template #list>
      <div class="flex navlist">
        <div>
          <div class="text-12 text-c-2">用户类型</div>
          <div class="text-c-1 text-14 mt-4">
            {{ items.special_type_label }}
          </div>
        </div>
        <div>
          <div class="text-12 text-c-2">登录次数</div>
          <div class="text-c-1 text-14 mt-4">{{ items.login_count }}</div>
        </div>
        <div>
          <div class="text-12 text-c-2">最近登录时间</div>
          <div class="text-c-1 text-14 mt-4">{{ items.last_login_at }}</div>
        </div>
        <div>
          <div class="text-12 text-c-2">操作次数</div>
          <div class="text-c-1 text-14 mt-4">{{ items.action_count }}</div>
        </div>
        <div>
          <div class="text-12 text-c-2">最近操作时间</div>
          <div class="text-c-1 text-14 mt-4">{{ items.last_action_at }}</div>
        </div>
      </div>
    </template>
    <div class="content">
      <ETable
        :key="active"
        header-show
        ref="tableRef"
        :singleLine="false"
        :columns="active === 0 ? loginColumns : actionColumns"
        :api="items.api"
        flexHeight
        bordered
        :row-keys="checkedRowKeys"
        @update:checked-row-keys="tableCheckRowHandle"
        :filterList="active === 0 ? loginFilterList : actionFilterList"
        @onSelect="onSelect"
        :selectBtn="selectBtn"
      >
      </ETable>
    </div>
  </CSDetail>
  <ActionDetail ref="ActionDetailRef" />
</template>

<script lang="ts" setup>
import { http } from '@/apis'
import { usePopover } from '@/hooks/usePrat'
import ActionDetail from './ActionDetail.vue'
const show = ref(<boolean>false)
const active = ref(<number>0)
const items = ref(<any>{})
const selectBtn = ref(['导出'])
const ActionDetailRef = ref({} as typeof ActionDetail)
// 登录日志
const loginFilterList = ref(<any>[
  {
    label: '登录日期：',
    key: 'last_login_at',
    type: 'datetimerange',
    defaultvalue: 'between',
    selecttype: ['区间']
  },
  {
    label: '状态：',
    type: 'select',
    key: 'method',
    options: [
      { value: '登录成功', label: '登录成功' },
      { value: '登录失败', label: '登录失败' }
    ]
  }
])
const loginColumns = ref(<any>[
  // {
  //   type: 'selection'
  // },
  {
    title: '序号',
    key: 'ix',
    render(row, index) {
      return index + 1
    },
    width: 50
  },
  {
    title: '登录时间',
    key: 'created_at'
  },
  {
    title: '状态',
    key: 'method',
    width: 70
  },
  {
    title: '登录IP',
    key: 'ip',
    width: 120
  },
  {
    title: '登录地址',
    key: 'local'
  },
  {
    title: 'UserAgent',
    key: 'ua',
    width: 220
  }
])
// 操作日志
const actionFilterList = ref(<any>[
  {
    label: '操作行为：',
    key: 'method',
    type: 'select',
    options: [],
    width: 100
  }
])
const actionColumns = ref(<any>[
  // {
  //   type: 'selection'
  // },
  {
    title: '序号',
    key: 'ix',
    render(row, index) {
      return index + 1
    },
    width: 50
  },
  {
    title: '操作行为',
    key: 'method'
  },
  {
    title: '最近操作时间',
    key: 'updated_at',
    sorter: 'default'
  },
  {
    title: '操作次数',
    key: 'count',
    sorter: 'default'
  },
  {
    title: '操作',
    key: '',
    render(row) {
      return usePopover('查看详情', '', () => {
        ActionDetailRef.value.open(row.id)
      })
    },
    width: 80
  }
])

const tabs = ref(<Array<string>>['登录日志', '操作日志'])
async function open(row) {
  actionFilterList.value[0].options = await (
    await http.get('admin-api/admin-user/log/options')
  ).data
  items.value = row
  change(0)
  show.value = true
}
function change(index) {
  checkedRowKeys.value = []
  active.value = index
  items.value.api = `admin-api/admin-user/log/${
    index === 0 ? 'login' : 'action'
  }-list?uid=${items.value.id}`
}

const checkedRowKeys = ref([])
// 多选
function tableCheckRowHandle(keys, rows) {
  checkedRowKeys.value = keys
}

// 操作按钮
const emit = defineEmits(['ok'])
// 选择
function onSelect(name) {}
// 关闭
function clear() {
  show.value = false
  items.value = {}
}
defineExpose({ open })
</script>
<style lang="less" scoped>
.navlist {
  width: 1200px;
  flex-wrap: wrap;
}
.content {
  padding: 20px;
  height: calc(100vh - 235px);
  overflow-y: auto;
  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
}
</style>
