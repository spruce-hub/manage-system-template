<template>
  <div class="flex user">
    <div class="side">
      <div class="userimg">
        <img
          v-if="userinfo.$state.userInfo.face_url"
          :src="userinfo.$state.userInfo.face_url"
        />
        <img v-else src="@/assets/img/customer.png" />
        <p>{{ userinfo.$state.userInfo.name }}</p>
      </div>
      <ul>
        <li
          @click="change(index)"
          :class="{ active: active === index }"
          v-for="(item, index) in list"
          :key="index"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
    <div class="views">
      <info v-if="active === 0" />
      <pass v-if="active === 1" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import info from './info.vue'
import pass from './pass.vue'
import { useUserInfo } from '@/store'
const userinfo = useUserInfo()
const list = ref([
  {
    name: '个人信息'
  },
  {
    name: '账户密码'
  }
])
const active = ref(<number>0)

function change(e) {
  active.value = e
}
</script>
<style lang="less" scoped>
.user {
  margin: 10px;
  height: calc(100% - 20px);
}
.side {
  margin-right: 10px;
  border-radius: 5px;
  background: @white;
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200px;
  .userimg {
    text-align: center;
    img {
      width: 60px;
      height: 60px;
      border: 1px solid @line-c-0;
      border-radius: 50%;
      overflow: hidden;
    }
    p {
      padding: 5px 0;
    }
  }
  ul {
    width: 100%;
    li {
      padding: 10px;
      cursor: pointer;
      text-align: center;
      &:hover {
        color: @main-c;
      }
      &.active {
        background-color: @main-c-hover;
        color: @main-c;
      }
    }
  }
}
.views {
  width: calc(100% - 210px);
  background: @white;
  border-radius: 5px;
}
</style>
