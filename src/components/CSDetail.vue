<template>
  <n-drawer
    class="detaildrawer"
    :show="show"
    :width="iwidth"
    :close-on-esc="false"
    :mask-closable="false"
    :auto-focus="false"
    :trap-focus="false"
  >
    <n-drawer-content :body-content-style="bodyContentStyle">
      <div class="header" :style="headerStyle">
        <div class="flex justify-between items-center">
          <div class="flex justify-between items-center">
            <slot name="title"></slot>
            <div class="mr-8 text-18 text-c-0" v-if="!$slots.title">
              {{ title }}
            </div>
          </div>
          <n-space class="items-center">
            <template v-for="(item, index) in btnlist" :key="index">
              <n-button
                v-if="item.name !== 'icon' && index < 2"
                :type="item.type"
                :key="index"
                size="small"
                @click="btnChange(item, index)"
              >
                {{ item.name }}
              </n-button>
              <n-popover v-else-if="item.name === 'icon'" trigger="hover">
                <template #trigger>
                  <n-button size="small">
                    <i
                      class="iconfont icon-more"
                      style="transform: rotate(90deg)"
                    ></i>
                  </n-button>
                </template>
                <n-space vertical>
                  <template v-for="(vim, ix) in btnlist" :key="ix">
                    <n-button
                      text
                      v-if="ix > 2"
                      :key="ix"
                      @click="btnChange(vim, ix)"
                    >
                      {{ vim.name }}
                    </n-button>
                  </template>
                </n-space>
              </n-popover>
            </template>
            <i
              class="cursor-pointer hover-main iconfont icon-refresh text-20"
              :class="{ loading: loading }"
              @click="refresh()"
            ></i>
            <i
              class="cursor-pointer hover-main iconfont text-20"
              :class="zoom ? 'icon-a-packup' : 'icon-a-fullscreen'"
              @click="zoomChange"
            ></i>
            <i
              v-if="route.name !== '/details'"
              class="cursor-pointer hover-main iconfont icon-close-1 text-20"
              @click="clear"
            ></i>
          </n-space>
        </div>
        <div class="nav pt-16 flex" v-if="$slots.list">
          <slot name="list"></slot>
        </div>
      </div>
      <div v-if="$slots.approval" class="approval">
        <slot v-if="$slots.approval" name="approval"></slot>
      </div>
      <div class="flex w-full hiddle flex-initial">
        <div class="no-wrap" :class="{ wrap: $slots.follow && !checked }">
          <ul class="tabs flex">
            <li
              :class="{ active: number === index }"
              v-for="(item, index) in tabs"
              :key="index"
              @click="change(index)"
            >
              {{ item }}
            </li>
          </ul>
          <div class="arrow" v-if="$slots.follow" @click="arrowchange">
            <i
              class="iconfont icon-arrow_right"
              :class="{ 'no-arrow': checked }"
            ></i>
          </div>
          <slot></slot>
        </div>
        <div
          class="follow"
          :class="{ 'no-follow': checked }"
          v-if="$slots.follow"
        >
          <slot name="follow"></slot>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { openFullscreen, exitFullscreen } from '@/hooks/useOperation'
import { useRoute } from 'vue-router'
interface Props {
  width?: string
  tabs?: Array<any>
  title?: string
  number?: number
  show?: boolean
  buttons?: Array<{
    name: string
    type: string
    disabled: boolean
  }>
  bodyContentStyle?: object | string | undefined
  headerStyle?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  number: 0,
  show: false,
  tabs: () => [],
  buttons: () => []
})
const zoom = ref(<boolean>false)
const loading = ref(<boolean>false)
const iwidth = ref(<string>props.width || '80%')
const active = ref(<number>0)
const route = useRoute()
if (route.name === '/details') {
  iwidth.value = '100%'
}
// 放大
function zoomChange() {
  zoom.value = !zoom.value
  if (zoom.value) {
    iwidth.value = '100%'
    openFullscreen()
  } else {
    if (route.name === '/details') {
      iwidth.value = '100%'
    } else {
      iwidth.value = '80%'
    }
    exitFullscreen()
  }
}
const emit = defineEmits(['clear', 'refresh', 'change', 'btnchange'])
// 刷新
function refresh() {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
  emit('refresh')
}
// 关闭
function clear() {
  emit('clear')
}
//tab触发
function change(index) {
  active.value = index
  emit('change', index)
}
watch(
  () => props.number,
  (n) => {
    active.value = props.number
  }
)
const btnlist = ref(<any>[])
watch(
  () => props.buttons,
  (n) => {
    btnlist.value = props.buttons.filter((item) => !item.disabled)
    if (btnlist.value.length >= 3) {
      btnlist.value.splice(2, 0, {
        name: 'icon'
      })
    }
  },
  { immediate: true, deep: true }
)
// 按钮触发
function btnChange(item, index) {
  emit('btnchange', { row: item, index })
}

const checked = ref(<boolean>false)
function arrowchange() {
  checked.value = !checked.value
}
</script>
<style lang="less" scoped>
.content {
  padding: 20px;
}
.icon-refresh {
  &::before {
    display: block;
  }
  &.loading::before {
    display: block;
    transform: rotate(720deg);
    transition: all 1s;
  }
}
.hiddle {
  overflow: hidden;
}
.no-wrap {
  width: 100%;
  transition: all 0.5s;
  position: relative;
  &.wrap {
    transition: all 0.5s;
    width: calc(100% - 376px);
  }
  .arrow {
    position: absolute;
    top: 45px;
    right: 0px;
    cursor: pointer;
    background: #adb4c1;
    width: 12px;
    height: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    i {
      color: @white;
    }
    .no-arrow {
      transform: rotate(180deg);
    }
  }
}
.follow {
  transition: all 0.5s;
  width: 368px;
  overflow: hidden;
  border-left: 8px solid #f1f1f5;
  &.no-follow {
    width: 0;
    transform: translateX(368px);
    transition: all 0.5s;
  }
}
.approval {
  border-bottom: 8px solid #f1f1f5;
  padding: 10px 16px 0;
}
</style>
