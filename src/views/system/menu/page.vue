<template>
  <div class="page-wrap">
    <ETablePage
      ref="tableRef"
      :columns="columns"
      bordered
      api="admin-api/admin-user/menu/tree"
      title="菜单管理"
      :singleLine="false"
      :search="false"
    >
      <template #button>
        <n-button type="primary" size="small" @click="editChange">
          新增一级菜单
        </n-button>
      </template>
    </ETablePage>
    <Edit
      ref="EditRef"
      @ok="tableRef.dataFn(tableRef.page, menuStore.fetchPageMenu())"
    />
    <Dialog ref="DialogRef" />
  </div>
</template>
<script lang="ts" setup>
import { useMenu } from '@/store'
import { useButton, useTag } from '@/hooks/usePrat'
import { useDelete } from '@/hooks/useOperation'
import Edit from './components/Edit.vue'
const EditRef = ref(<typeof Edit>{})
const tableRef = ref(<any>{})
const DialogRef = ref(<any>{})
const columns = ref([
  {
    title: '菜单ID',
    key: 'id'
  },
  {
    title: '菜单名称',
    key: 'name'
  },
  // {
  //   title: '图标',
  //   key: 'icon'
  // },
  {
    title: '路由名称',
    key: 'route_name'
  },
  {
    title: '排序',
    key: 'sort'
  },
  {
    title: '类型',
    key: 'level',
    render(row) {
      if (row.type === 1) {
        let number = '一级'
        let type = 'info'
        let style = {}
        switch (row.level) {
          case 2:
            number = '二级'
            type = ''
            style = {
              color: '#7aa8d2',
              textColor: '#ffffff',
              borderColor: '#5797d2'
            }
            break
          case 3:
            number = '三级'
            type = ''
            style = {
              color: '#95d6b5',
              textColor: '#ffffff',
              borderColor: '#57d294'
            }
            break
        }
        return useTag(number + '菜单', type, style)
      } else {
        return useTag('功能操作', 'warning')
      }
    }
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      return useTag(
        row.status === 1 ? '启用' : '禁用',
        row.status === 1 ? 'success' : 'error'
      )
    }
  },
  {
    title: '操作',
    key: 'operation',
    width: '160',
    fixed: 'right',
    render(row) {
      let name = !row.status ? row.name : ''
      return [
        row.level <= 2 && row.type === 1
          ? useButton(
              '新增下级',
              () => {
                EditRef.value.open({ type: 'add', pid: row.id, id: 0, name })
              },
              'mr-4'
            )
          : '',
        useButton(
          '编辑',
          () => {
            EditRef.value.open({ type: 'edit', pid: row.pid, id: row.id })
          },
          'mr-4'
        ),
        useButton('删除', () => {
          deleteDia(row.name, row.id)
        })
      ]
    }
  }
])
const menuStore = useMenu()
// 新建分类
function editChange() {
  EditRef.value.open({ type: 'add', pid: 0, id: 0 })
}
// 删除
function deleteDia(name, id = undefined) {
  useDelete({
    element: DialogRef.value,
    tableEl: tableRef.value,
    name,
    form: { id },
    api: 'admin-api/admin-user/menu/destroy',
    success: () => menuStore.fetchPageMenu()
  })
}
</script>
<style lang="less" scoped></style>
