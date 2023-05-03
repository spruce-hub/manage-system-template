<template>
  <n-drawer
    :show="show"
    @update:show="$emit('update:show', $event)"
    :width="width"
    :auto-focus="false"
    :close-on-esc="false"
    :mask-closable="false"
    :trap-focus="trapFocus"
  >
    <n-drawer-content>
      <template #header>
        <div class="flex items-center justify-between w-full">
          <div class="title">
            {{ title }}
            <slot name="title"></slot>
          </div>
          <n-space>
            <slot name="button"></slot>
            <n-button
              :loading="loading"
              size="medium"
              type="primary"
              @click="submit"
              v-if="isok"
            >
              {{ okText }}
            </n-button>
            <n-button
              :loading="loading"
              v-if="iscancel"
              size="medium"
              class="default"
              type="default"
              @click="clear"
            >
              {{ cancelText }}
            </n-button>
          </n-space>
        </div>
      </template>
      <template #default>
        <div class="flex items-center">
          <div class="leftdrawer" v-if="list.length">
            <n-anchor
              ref="anchorRef"
              :bound="67"
              affix
              ignore-gap
              :show-rail="false"
              type="block"
            >
              <n-anchor-link
                :title="item.name"
                :href="`#${item.name}`"
                v-for="(item, index) in list"
                :key="index"
              >
              </n-anchor-link>
            </n-anchor>
          </div>
          <div class="rightdrawer" ref="content" :class="{ no: !list.length }">
            <slot></slot>
          </div>
        </div>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
<script lang="ts" setup>
interface Props {
  loading?: boolean
  show?: boolean
  isok?: boolean
  iscancel?: boolean
  title?: string
  okText?: string
  cancelText?: string
  width?: number | string
  list?: Array<{ name: string; link: string }>
  trapFocus?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  loading: false,
  show: false,
  okText: '提交',
  cancelText: '取消',
  isok: true,
  trapFocus: true,
  iscancel: true,
  width: 'calc(100vw - 300px)',
  list: () => []
})
const emit = defineEmits(['clear', 'submit', 'update:show'])
/**
 * @Description: 取消
 * @return {*}
 */
function clear() {
  emit('clear')
}

/**
 * @Description: 提交
 * @return {*}
 */
function submit() {
  emit('submit')
}
</script>
<style lang="less" scoped>
.default {
  background: @white;
}
.n-button {
  min-width: 76px;
}

.n-drawer .n-drawer-content :deep(.n-drawer-body-content-wrapper) {
  padding: 0;
  .leftdrawer {
    width: 180px;
    background: #fcfcfd;
    border-right: 1px solid @line-c-1;
    height: calc(100vh - 67px);
    padding: 20px 0;
    overflow: hidden;
    .n-anchor-link {
      height: 36px;
      line-height: 36px;
      margin-top: 8px;
      color: @text-c-1;
      border-right: 2px solid transparent;
      cursor: pointer;
      text-align: center;
      &:hover {
        color: @main-c;
      }
      &.active {
        color: @main-c;
        border-color: @main-c;
      }
    }
  }
  .rightdrawer {
    width: calc(100% - 180px);
    height: calc(100vh - 67px);
    overflow-y: auto;
    padding: 40px;
    &.no {
      width: 100%;
      padding: 20px;
    }
  }
}
</style>
