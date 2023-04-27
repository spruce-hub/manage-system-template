<template>
  <n-layout style="height: 100vh">
    <n-layout-header class="layout-header" bordered>
      <img src="@/assets/img/nav-icon.png" alt="" style="height: 27px" />
      <div class="flex items-center">
        <NewsPopover />
        <UserHandlePopover :other-end-url="otherEndUrl" />
      </div>
    </n-layout-header>
    <n-layout has-sider>
      <n-layout-sider
        bordered
        content-style="color:#4A5468;"
        :width="64"
        class="first-sider"
      >
        <i
          class="iconfont icon-arrow_double collapse-arrow"
          @click="switchMenuExpand"
          v-if="collapsed"
        ></i>
        <ul class="menu-top">
          <li
            v-for="(item, index) in pageMenu"
            :key="index"
            class="menu-top-item"
            :class="{
              'menu-top-active': index === activeIndex
            }"
            @click="clickMenuTop(index, item)"
          >
            <i
              style="font-size: 26px"
              v-if="index === activeIndex"
              class="iconfont"
              :class="item.icon"
            ></i>
            <svg
              v-else
              class="iconfont"
              aria-hidden="true"
              style="width: 26px; height: 26px"
            >
              <use :xlink:href="`#${item.icon}`"></use>
            </svg>
            <p class="text-12 mt-4">{{ item.name }}</p>
          </li>
        </ul>
      </n-layout-sider>
      <n-layout-sider
        :width="200"
        class="second-sider"
        :collapsed="collapsed"
        collapse-mode="width"
        :collapsed-width="0"
      >
        <i
          class="iconfont icon-arrow_double collapse-arrow"
          @click="switchMenuExpand"
        ></i>
        <div
          v-for="(item, index) in pageMenu[activeIndex]?.children"
          :key="index"
        >
          <p
            class="second-sider-title"
            :class="{ active: active === index }"
            @click="active = index"
          >
            {{ item.name }}
          </p>
          <div class="menu-second" :class="{ active: active === index }">
            <router-link
              v-for="vim in item.children"
              :key="vim.route_name"
              :to="'/' + vim.route_name"
            >
              <div
                :class="{ 'menu-middle-active': activeKey === vim.id }"
                @click="newTwoChange(vim)"
              >
                {{ vim.name }}
              </div>
            </router-link>
          </div>
        </div>
      </n-layout-sider>
      <n-layout-content>
        <router-view />
      </n-layout-content>
    </n-layout>
  </n-layout>
  <WebSocketInformation />
</template>
<script lang="ts" setup>
import { useMenu } from '@/store'
import NewsPopover from './NewsPopover/index.vue'
import UserHandlePopover from './UserHandlePopover/index.vue'
import WebSocketInformation from './WebSocketInformation/index.vue'
const router = useRouter()
const active = ref(<number>0)
// 导航栏收展的数据操作
const collapsed = ref(false)
function switchMenuExpand() {
  collapsed.value = !collapsed.value
}
const otherEndUrl = ref('')

const menuStore = useMenu()
const pageMenu: any = computed(() => {
  const result = []
  generate(menuStore.menu, result)
  return result
})
function generate(menu, container) {
  menu.forEach((vim) => {
    let menuItem: any = {
      name: vim.name,
      id: vim.id,
      type: vim.type as 1 | 2,
      pid: vim.pid,
      route_name: vim.route_name,
      icon: vim.icon
    }
    if (vim.children) {
      menuItem.children = []
      generate(vim.children, menuItem.children)
    }
    container.push(menuItem)
  })
}

// 点击了一级导航栏的数据操作
const activeIndex = ref(0)
function clickMenuTop(index: number, menu) {
  activeIndex.value = index
  active.value = 0
  if (menu.children?.length) {
    collapsed.value = false
    clickMenuSecond(menu.children[0])
  } else {
    activeKey.value = menu.id
    collapsed.value = true
    router.push(menu.route_name)
  }
}

// 点击了二级导航栏的数据操作
const activeKey = ref(0)

function newTwoChange(item) {
  menuStore.setMenuName(item.name)
  activeKey.value = item.id
}
function clickMenuSecond(item) {
  if (item.route_name) {
    activeKey.value = item.id
    router.push('/' + item.route_name)
  } else if (item.children) {
    clickMenuThird(item.children[0])
  }
}
// 点击了三级导航栏的数据惭怍
function clickMenuThird(item) {
  if (item.route_name) {
    activeKey.value = item.id
    router.push('/' + item.route_name)
  }
}

// 监测当前路由,设置对应的active菜单
watch(
  () => {
    return router.currentRoute.value.path
  },
  (val) => {
    for (let i = 0; i < pageMenu.value.length; ++i) {
      if (pageMenu.value[i].children) {
        for (let item of pageMenu.value[i].children!) {
          if ('/' + item.route_name === val) {
            activeIndex.value = i
            menuStore.setMenuName(item.name)
            activeKey.value = item.id
            return
          }
          if (item.children) {
            for (let vim of item.children) {
              if ('/' + vim.route_name === val) {
                activeIndex.value = i
                menuStore.setMenuName(item.name)
                activeKey.value = vim.id
                return
              }
            }
          }
        }
      }
    }
    if (pageMenu.value[activeIndex.value].route_name === val) {
      menuStore.setMenuName(pageMenu.value[activeIndex.value].name)
      activeKey.value = pageMenu.value[activeIndex.value].id
      collapsed.value = true
      return
    }
  },
  {
    immediate: true
  }
)
</script>
<style lang="less" scoped>
.layout-header {
  height: 50px;
  padding: 0 20px;
  color: @white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.collapse-arrow {
  margin-left: auto;
  width: 19px;
  height: 35px;
  line-height: 35px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s;
}
.first-sider {
  z-index: 2;
  .left-top-radius {
    position: absolute;
    right: -10px;
  }
  .collapse-arrow {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
  &:hover .collapse-arrow {
    opacity: 1;
  }
  .menu-top {
    padding: 10px;
    padding-bottom: 100px;
    li {
      padding: 10px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;
      line-height: 17px;
      height: 67px;
      cursor: pointer;
      &.menu-top-active {
        color: @main-c;
        p {
          transform: translateY(9px);
        }
        i {
          transform: translateY(5px);
        }
      }
    }
  }
}
.n-layout-sider {
  height: calc(100vh - 50px);
}
::v-deep(.n-layout-scroll-container) {
  background: #f1f1f5;
}
.second-sider :deep(.n-layout-sider-scroll-container) {
  height: calc(100vh - 50px);
  min-width: 200px;
  padding: 15px 0;
  z-index: 1;
  background-color: #fcfcfd;
  position: relative;
  border-right: 1px solid @line-c-1;
  .collapse-arrow {
    position: absolute;
    right: 20px;
    bottom: 20px;
    transform: rotate(180deg);
  }
  &:hover .collapse-arrow {
    opacity: 1;
  }
  .second-sider-title {
    color: @text-c-0;
    font-weight: bold;
    height: 36px;
    line-height: 36px;
    padding-left: 38px;
    position: relative;
    cursor: pointer;
    &.active::before {
      transition: all 0.5s;
      transform: translateY(-50%);
    }
    &::before {
      position: absolute;
      left: 25px;
      top: 50%;
      transition: all 0.5s;
      transform: translateY(-50%) rotate(-90deg);
      content: '';
      width: 0;
      height: 0;
      border-top: 4px solid @text-c-0;
      border-right: 4px solid transparent;
      border-left: 4px solid transparent;
    }
  }
  .menu-second {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.5s;
    &.active {
      transition: max-height 0.5s;
      max-height: 560px;
    }
    a {
      display: block;
      margin-top: 6px;
    }
    div {
      color: @text-c-1;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding-left: 38px;
      border-left: 2px solid transparent;

      &:hover,
      &.menu-middle-active {
        background-color: #f1f1f5;
        border-color: @main-c;
      }
    }
  }
}
</style>
