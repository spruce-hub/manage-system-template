<template>
  <div
    class="timeline"
    :class="{ 'line-show': !lastLineShow }"
    :style="{
      '--timeline-item-header-width': headerWidth,
      '--timeline-item-icon-size': iconSize,
      '--timeline-item-footer-width': footerWidth,
      '--timeline-item-icon-default-color': iconDefaultColor,
      '--timeline-item-icon-primary-color': iconPrimaryColor,
      '--timeline-item-icon-line-color': lineColor,
      '--timeline-row-gap': rowGap
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
type Props = {
  horizontal?: boolean
  headerWidth?: string
  iconSize?: string
  footerWidth?: string
  iconDefaultColor?: string
  iconPrimaryColor?: string
  lineColor?: string
  lastLineShow?: boolean
  rowGap?: string
}
const props = withDefaults(defineProps<Props>(), {
  headerWidth: '68px',
  iconSize: '6px',
  footerWidth: '48px',
  iconDefaultColor: '#ADB4C1',
  iconPrimaryColor: '#F2645F',
  lineColor: '#ECEEF2',
  lastLineShow: false,
  rowGap: '36px'
})
</script>

<style lang="less" scoped>
.timeline {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  row-gap: var(--timeline-row-gap);
  line-height: 1.25;
  &.line-show {
    :deep(.timeline-item:last-child) {
      padding-bottom: var(--timeline-row-gap);
      .timeline-item-line {
        display: none;
      }
    }
  }
}
</style>
