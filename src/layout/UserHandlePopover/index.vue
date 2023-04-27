<template>
  <n-dropdown
    trigger="hover"
    :options="rightTopOpts"
    @select="rightTopSelect"
    show-arrow
    class="right-menu"
  >
    <div class="right-top-wrap flex justify-center">
      <span class="staff-avatar">
        <img
          v-if="info.$state.userInfo.face_url"
          :src="info.$state.userInfo.face_url"
        />
        <img v-else src="@/assets/img/customer.png" />
      </span>
      <i class="iconfont icon-show_more text-c-1 mt-4"></i>
    </div>
  </n-dropdown>
</template>
<script lang="ts" setup>
import { clearToken, http } from '@/apis'
import { redirectToLogin } from '@/router'
import { useUserInfo } from '@/store'
import { useRouter } from 'vue-router'
const router = useRouter()
const info = useUserInfo()
// 表头的操作
const rightTopOpts = [
  {
    label: '账户管理',
    key: 'user'
  },
  {
    label: '清除缓存',
    key: 'clear'
  },
  {
    label: '退出登录',
    key: 'logOut'
  }
]
function rightTopSelect(key: string) {
  if (key === 'user') {
    router.push('/user')
  } else if (key === 'clear') {
    http.post('/admin-api/system/clear-cache').then((res) => {
      window.$message.success('清除缓存成功')
    })
  } else if (key === 'logOut') {
    clearToken()
    redirectToLogin()
    info.$reset()
    window.$message.success('退出成功')
  }
}
</script>
<style lang="less" scoped>
.right-top-wrap {
  color: @white;
  cursor: pointer;
  .staff-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    text-align: center;
    line-height: 32px;
    overflow: hidden;
    display: flex;
    img {
      width: 100%;
    }
  }
}
</style>
