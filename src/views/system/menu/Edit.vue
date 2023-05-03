<template>
  <Drawer
    width="500px"
    :show="active"
    :title="`${form.id ? '编辑' : '新增'}菜单`"
    @clear="clear"
    @submit="submit"
  >
    <div class="pb-10">
      <Formularies
        ref="FormRef"
        :rules="rules"
        :labelWidth="80"
        @update:value="update"
      >
      </Formularies>
      <div class="flex items" v-if="form.type !== 2">
        <div class="label text-12">接口API</div>
        <div class="input">
          <div class="mr-5 flex" v-for="(item, index) in apis" :key="index">
            <n-auto-complete
              class="mb-10"
              clearable
              :key="index"
              v-model:value="item.value"
              placeholder="请输入接口API"
              :options="options.apis"
              @update:value="change"
            />
            <i
              class="iconfont icon-close-1 add"
              v-if="index === apis.length - 1"
              @click="addChange"
            ></i>
            <i
              class="iconfont icon-close-1"
              v-if="apis.length !== 1"
              @click="deleteChange(index)"
            ></i>
          </div>
        </div>
      </div>
    </div>
  </Drawer>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { http } from '@/apis'
import { useMenu } from '@/store/menu'
import { useMenudata } from '@/store/interfaceApi'
interface formItem {
  name: string
  apis: Array<string>
  pid?: number
  status: number
  route_name: string
  sort?: number
  id?: number
  type?: number
  models?: string
}
const active = ref(false)
const rules = ref({})
const apis = ref([{ value: '' }])
const FormRef = ref(<any>{})
const menu = useMenu()
const menudata = useMenudata()
const form = ref(<formItem>{
  name: '',
  apis: [],
  pid: 0,
  route_name: '',
  status: 1,
  sort: undefined,
  id: undefined,
  type: undefined,
  models: undefined
})
const type = ref(<string>'add')
let name = ref(<string | undefined>'')
const options = ref(<{ apis: Array<any>; models: Array<any> }>{})
const optionsAll = ref(<{ apis: Array<any>; models: Array<any> }>{})
interface ParamsItem {
  type: string
  pid?: number
  id?: number
  name?: string
  level: number
}
async function open(params: ParamsItem) {
  options.value = await menudata.getMenudata()
  optionsAll.value = JSON.parse(JSON.stringify(options.value))
  active.value = true
  type.value = params.type
  name.value = params.name
  rules.value = {
    pname: {
      label: '父级名称',
      type: 'text',
      disabled: true,
      hiddle: true
    },
    type: {
      label: '类型',
      type: 'select',
      itype: 'number',
      required: true,
      message: '请选择类型',
      trigger: ['change'],
      options: [
        {
          label: '菜单',
          value: 1
        },
        {
          label: '操作功能',
          value: 2
        }
      ]
    },
    name: {
      label: '菜单名称',
      type: 'text',
      required: true,
      message: '请输入菜单名称',
      trigger: ['blur']
    },
    icon: {
      label: '图标',
      type: 'text'
    },
    route_name: {
      label: '路由名称',
      type: 'text'
    },
    sort: {
      label: '排序',
      type: 'number'
    },
    status: {
      label: '状态',
      type: 'switch',
      value: 1
    },
    models: {
      label: '数据模型',
      hiddle: params.level !== 3,
      type: 'select',
      options: options.value.models,
      max: 1
    }
  }
  form.value.id = params.id
  form.value.pid = params.pid
  if (params.id) {
    http
      .get('admin-api/admin/menu/show', { params: { id: params.id } })
      .then((res) => {
        Object.keys(form.value).forEach((item) => {
          form.value[item] = res.data[item]
        })
        Object.keys(rules.value).forEach((item) => {
          rules.value[item].value = res.data[item]
        })
        hiddleFn()
        if (res.data.apis.length) {
          apis.value = []
          res.data.apis.forEach((item) => {
            apis.value.push({ value: item })
          })
        }
        rulesFn()
      })
  } else {
    hiddleFn()
  }
}
function rulesFn() {
  rules.value['status'].hiddle = form.value.type === 2
  rules.value['sort'].hiddle = form.value.type === 2
  rules.value['icon'].hiddle = form.value.type === 2
  rules.value['name'].label = form.value.type === 2 ? '功能名称' : '菜单名称'
  rules.value['route_name'].label =
    form.value.type === 2 ? '授权标识' : '路由名称'
}
function hiddleFn() {
  if (form.value.pid !== 0) {
    rules.value['pname'].value = treeFn(form.value.pid) || name.value
    rules.value['pname'].hiddle = false
  }
}
function treeFn(pid) {
  let name = ''
  tree(menu.$state.menu, pid)
  function tree(all, pid) {
    all.forEach((item) => {
      if (item.children.length && pid !== item.pid) {
        tree(item.children, pid)
      }
      if (pid === item.id) {
        name = item.name
      }
    })
  }
  return name
}
// 触发表单内容
function update(key, e) {
  form.value[key] = e
  if (key === 'type') {
    rulesFn()
  }
  if (key === 'type' && e === 2) {
    form.value.status = 1
  }
}
// 添加
function addChange() {
  apis.value.push({
    value: ''
  })
}
// 过滤
function change(e) {
  let all = JSON.parse(JSON.stringify(optionsAll.value))
  if (e) {
    options.value.apis = all.apis.filter((item) => {
      return item.value.indexOf(e) !== -1
    })
  } else {
    options.value = all
  }
}
// 删除
function deleteChange(index) {
  apis.value.splice(index, 1)
}
// 取消
function clear() {
  active.value = false
  form.value = {
    name: '',
    apis: [],
    pid: 0,
    route_name: '',
    status: 1,
    sort: undefined,
    id: undefined,
    type: undefined,
    models: undefined
  }
  apis.value = [{ value: '' }]
}
// 提交
const emit = defineEmits(['ok'])
function submit() {
  FormRef.value
    .sure()
    .then((data) => {
      let vim = apis.value.filter((item) => item.value !== '')
      form.value.apis = vim.map((item) => item.value)
      let path =
        type.value === 'add'
          ? 'admin-api/admin/menu/create'
          : 'admin-api/admin/menu/update'
      form.value.route_name = form.value.route_name || ''
      http.post(path, { data: form.value }).then((res) => {
        window.$message.success(`${type.value === 'add' ? '新增' : '编辑'}成功`)
        emit('ok')
        clear()
      })
    })
    .catch((data) => {})
}

defineExpose({
  open
})
</script>
<style lang="less" scoped>
.items {
  .label {
    width: 80px;
    line-height: 34px;
    text-align: right;
    padding-right: 12px;
  }
  .input {
    width: calc(100% - 80px);
  }
  .iconfont {
    cursor: pointer;
    line-height: 34px;
    margin-left: 10px;
    font-size: 20px;
    &.add {
      transform: rotate(45deg) translateX(-2px);
    }
  }
}
</style>
