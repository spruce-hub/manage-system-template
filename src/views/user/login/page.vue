<template>
  <div class="login-page flex">
    <div class="pic-wrap">
      <img src="@/assets/img/login-left.jpg" alt="" />
    </div>
    <div class="form-content flex">
      <div class="form-wrap flex">
        <div class="logo-wrap">
          <img
            src="@/assets/img/nav-icon.png"
            alt="零爱商城后台"
            style="width: 171px; padding-right: 5px"
          />
          <p>登录&nbsp;&nbsp;零爱商城后台</p>
        </div>
        <n-form
          label-placement="top"
          size="large"
          :model="form"
          :rules="rules"
          ref="FormRef"
          require-mark-placement="left"
          style="position: relative"
        >
          <n-form-item label="账号" path="account">
            <n-input
              v-model:value="form.account"
              placeholder="请输入账号"
              clearable
            ></n-input>
          </n-form-item>
          <n-form-item label="密码" path="password">
            <n-input
              v-model:value="form.password"
              placeholder="请输入密码"
              clearable
              type="password"
              show-password-on="mousedown"
            ></n-input>
          </n-form-item>
        </n-form>
        <div class="flex justify-between">
          <n-checkbox v-model:checked="form.keep">
            30天内记住登录状态
          </n-checkbox>
        </div>
        <n-button
          type="primary"
          size="large"
          class="login"
          strong
          :loading="loading"
          @click="submit"
        >
          立即登录
        </n-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import Cookie from 'js-cookie'
import { generateRoutes } from '@/router/generateRoutes'
import { useRoute } from 'vue-router'
import { useUserInfo } from '@/store/userInfo'
import { useMenu } from '@/store/menu'
import md5 from 'js-md5'
import { FormInst } from 'naive-ui'
import { http, saveToken, setHttpToken } from '@/apis'
const router = useRouter()
const route = useRoute()
const form = ref({
  account: import.meta.env.DEV ? '13800138001' : '',
  password: import.meta.env.DEV ? '123456' : '',
  keep: false
})
const rules = {
  password: {
    required: true,
    trigger: 'blur',
    message: '请输入密码'
  },
  account: {
    required: true,
    trigger: 'blur',
    message: '请输入账号'
  }
}
const FormRef = ref(<FormInst>{})
if (Cookie.get('remember')) {
  form.value.keep = Cookie.get('remember') == '1'
}
// 登录
const loading = ref(<boolean>false)
const menu = useMenu()
function submit() {
  FormRef.value.validate((errors) => {
    if (errors) return
    let item = {
      account: form.value.account,
      password: md5(form.value.password).toUpperCase(),
      keep: form.value.keep
    }
    loading.value = true
    http
      .post('/admin-api/admin/login', { data: item })
      .then((res) => {
        window.$message.success('登录成功')
        const { data } = res
        saveToken(data.token_type + ' ' + data.access_token, {
          expires: form.value.keep ? 30 : 1
        })
        setHttpToken()
        saveCookieIfKeep()
        menuFn()
      })
      .finally(() => {
        loading.value = false
      })
  })
}
function saveCookieIfKeep() {
  if (form.value.keep) {
    Cookie.set('username', form.value.account, { expires: 30 })
    Cookie.set('password', form.value.password, { expires: 30 })
    Cookie.set('remember', '1', { expires: 30 })
  }
}
// 登录完成获取菜单权限，进行跳转
async function menuFn() {
  const userInfo = useUserInfo()
  userInfo.$reset()
  await userInfo.getUserInfo()
  menu.fetchPageMenu().then((all) => {
    generateRoutes(all)
    loading.value = false
    form.value = {
      account: '',
      password: '',
      keep: false
    }
    if (Cookie.get('token') && childenFn(all)) {
      router.push(childenFn(all))
    }
  })
}

function childenFn(all) {
  let name = ''
  tree(all)
  function tree(arr) {
    for (let index = 0; index < arr.length; index++) {
      const item = arr[index]
      if (item.children.length && !item.route_name) {
        return tree(item.children)
      } else if (item.route_name) {
        return (name = item.route_name)
      }
    }
  }
  return name || '/' //HACK:后期加入欢迎页
}
</script>
<style lang="less" scoped>
.login-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
}
.form-content {
  width: calc(100% - 750px);
  justify-content: center;
}
.form-wrap {
  flex-direction: column;
  justify-content: center;
  width: 60%;
  padding: 8%;
  .logo-wrap {
    margin: 0 auto 60px;
    text-align: center;
    p {
      letter-spacing: 2px;
      text-align: center;
      font-size: 20px;
      margin-top: 15px;
    }
  }
  .n-input :deep(.n-input__input-el) {
    height: 44px;
  }
  .login {
    margin: 30px 0;
  }
  .send-code {
    margin-left: 15px;
    height: 44px;
  }
  .wx-code {
    margin: 20px auto 30px;
    overflow: hidden;
    height: 250px;
    iframe {
      width: 250px;
      height: 250px;
    }
  }
  .wechat-login {
    width: 250px;
    margin: auto;
  }
}
.pic-wrap {
  background-color: @main-c;
  width: 750px;
  text-align: center;
  color: @white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 8vh;
  position: relative;
  img {
    width: 100%;
    margin-bottom: 20px;
  }
}
.login-type {
  span {
    cursor: pointer;
  }
  span:nth-child(2) {
    margin: 0 8px;
  }
  &.wechat-type {
    text-align: center;
  }
}
.expire {
  position: absolute;
  background: rgba(255, 255, 255, 0.85);
  width: 250px;
  height: 250px;
  text-align: center;
  left: 0;
  right: 0;
  margin: auto;
  top: 44px;
  line-height: 246px;
  z-index: 9;
  font-size: 16px;
}
@keyframes transY {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(15px);
  }
}
</style>
