<template>
  <div class="page-wrap">
    <div class="page_navigation flex items-center">
      <span>账户密码</span>
    </div>
    <Formularies
      class="page_form"
      ref="FormRef"
      labelPlacement="left"
      labelWidth="110"
      labelAlign="right"
      :rules="rules"
      @update:value="update"
    />
    <n-divider />
    <div class="page_operation">
      <n-button class="page_operation_button" size="large" @click="clear">
        取消
      </n-button>
      <n-button
        class="page_operation_button"
        size="large"
        @click="submit"
        type="primary"
      >
        保存
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { http } from '@/apis'
import { clearToken } from '@/apis'
import { redirectToLogin } from '@/router'
import md5 from 'js-md5'
interface formItem {
  password: string
  new_password: string
}
const FormRef = ref(<any>{})
const form = ref(<formItem>{
  password: '',
  new_password: ''
})

const rules = ref({
  password: {
    label: '原始密码',
    type: 'password',
    required: true,
    message: '请输入原始密码',
    value: '',
    trigger: ['blur', 'change']
  },
  new_password: {
    label: '新密码',
    type: 'password',
    required: true,
    value: '',
    trigger: ['blur', 'change'],
    validator(rule, val: string) {
      if (!val || val.length < 6) {
        return new Error('请输入6位数以上的密码')
      }
      return true
    }
  },
  new_password2: {
    label: '确认密码',
    type: 'password',
    required: true,
    value: '',
    trigger: ['blur', 'change'],
    validator(rule, val) {
      if (val !== form.value.new_password) {
        return new Error('请输入确认密码')
      }
      return true
    }
  }
})

function clear() {
  form.value = {
    password: '',
    new_password: ''
  }
  rules.value['password'].value = ''
  rules.value['new_password'].value = ''
  rules.value['new_password2'].value = ''
}
function submit() {
  FormRef.value.sure().then((data) => {
    let item = {
      password: md5(form.value.password).toUpperCase(),
      new_password: md5(form.value.new_password).toUpperCase()
    }
    http.post('admin-api/personal/reset-password', item).then((res) => {
      window.$message.success('修改成功')
      clearToken()
      redirectToLogin()
    })
  })
}
// 获取表单数据
function update(key, e) {
  form.value[key] = e
}
</script>

<style lang="less" scoped>
.page-wrap {
  margin: 8px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  .page_navigation {
    width: 100%;
    padding: 16px;
    & > span {
      font-size: 16px;
      line-height: 22px;
      &:first-child {
        color: @text-c-0;
      }
    }
  }
  .page_form {
    flex: 1;
    width: 40%;
    justify-content: unset;
    align-items: unset;
    flex-direction: column;
    :deep(.n-form-item) {
      margin-bottom: 24px;
    }
  }
  .page_operation {
    margin-bottom: 24px;
    .page_operation_button {
      width: 100px;
      &:not(:first-child) {
        margin-left: 20px;
      }
    }
  }
}
</style>
