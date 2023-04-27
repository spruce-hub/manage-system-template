<template>
  <div class="page-wrap">
    <ETablePage
      ref="tableRef"
      :columns="columns"
      bordered
      title="日志管理"
      :singleLine="false"
      api="admin-api/admin-user/log/list"
      :filterList="filterList"
      @update:checked-row-keys="tableCheckRowHandle"
      @onSelect="onSelect"
      :selectBtn="selectBtn"
    >
      <template #button>
        <n-space>
          <n-button type="primary" size="small" @click="exportDia(false)">
            导出日志列表
          </n-button>
        </n-space>
      </template>
    </ETablePage>
  </div>
  <Detail ref="DetailRef" @ok="tableRef.dataFn(tableRef.page)" />
  <ExportTableField name="监控记录" ref="ExportTableFieldRef" />
</template>
<script lang="ts" setup>
import { usePopover } from '@/hooks/usePrat'
import Detail from './components/LogDetail.vue'
const tableRef = ref(<any>{})
const DetailRef = ref(<typeof Detail>{})
const filterList = ref(<any>[
  {
    label: '用户类型：',
    type: 'select',
    key: 'special_type',
    options: [
      { value: '', label: '员工' },
      { value: 'agent', label: '经销商' }
    ]
  },
  {
    label: '最近登录日期：',
    key: 'last_login_at',
    type: 'datetimerange',
    defaultvalue: 'between',
    selecttype: ['区间']
  },
  {
    label: '最近操作日期：',
    key: 'last_action_at',
    type: 'datetimerange',
    defaultvalue: 'between',
    selecttype: ['区间']
  }
])
const selectBtn = ref(['导出'])
const columns = ref([
  // {
  //   type: 'selection'
  // },
  {
    title: '序号',
    key: 'ix',
    render(row, index) {
      return index + 1
    }
  },
  {
    title: '用户名称',
    key: 'name',
    render(row) {
      return usePopover(row.name, 'blue-c', () => {
        DetailRef.value.open(row)
      })
    }
  },
  {
    title: '用户类型',
    key: 'special_type_label'
  },
  {
    title: '登录次数',
    key: 'login_count'
  },
  {
    title: '最近登录时间',
    key: 'last_login_at'
  },
  {
    title: '操作次数',
    key: 'action_count'
  },
  {
    title: '最近操作行为',
    key: 'last_action'
  },
  {
    title: '最近操作时间',
    key: 'last_action_at'
  }
])
// 多选
const checkedRowKeys = ref([])
function tableCheckRowHandle(keys, rows) {
  checkedRowKeys.value = keys
}

// 选择
function onSelect(name) {
  if (name === '导出') {
    exportDia(true)
  }
}

// 导出日志
const ExportTableFieldRef = ref(<any>{})
function exportDia(batch: boolean) {
  ExportTableFieldRef.value.open(batch ? checkedRowKeys.value : null)
}
</script>
<style lang="less" scoped></style>
