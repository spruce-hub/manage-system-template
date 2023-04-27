<template>
  <div class="timeline-item">
    <div class="timeline-item-header" v-if="headerShow">
      <slot name="header">
        <span class="timeline-item-header-time">{{
          get(data, timeFile) || '-'
        }}</span>
        <span class="timeline-item-header-date">{{
          get(data, dateFile) || '-'
        }}</span>
      </slot>
    </div>

    <div class="timeline-item-icon">
      <slot name="icon">
        <i class="timeline-item-default-icon" :class="{ active: active }" />
      </slot>
    </div>
    <div class="timeline-item-line" />
    <div class="timeline-item-default">
      <slot name="default" :timelineData="data"> </slot>
    </div>
    <div class="timeline-item-footer" v-if="$slots.footer">
      <slot name="footer"> </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { get } from 'lodash'

type Props = {
  active?: boolean
  headerShow?: boolean
  data: Record<string, any>
  timeFile: string
  dateFile: string
}
const props = withDefaults(defineProps<Props>(), {
  active: false,
  headerShow: true,
  dateFile: 'date',
  timeFile: 'time'
})

const emit = defineEmits(['click'])
</script>

<style lang="less" scoped>
.timeline-item {
  position: relative;
  display: flex;
  flex-direction: row;
  .timeline-item-header {
    width: var(--timeline-item-header-width);
    .timeline-item-header-time,
    .timeline-item-header-date {
      display: block;
      text-align: right;
      font-size: 12px;
      line-height: 18px;
    }
    .timeline-item-header-time {
      color: #122341;
    }
    .timeline-item-header-date {
      color: #8b92a0;
    }
  }
  .timeline-item-icon {
    height: var(--timeline-item-icon-size);
    width: var(--timeline-item-icon-size);
    box-sizing: content-box;
    display: flex;
    align-items: center;
    padding: 6px 12px 0;
    .timeline-item-default-icon {
      height: inherit;
      width: inherit;
      border-radius: 50%;
      background-color: var(--timeline-item-icon-default-color);
      &.active {
        background-color: var(--timeline-item-icon-primary-color);
      }
    }
  }
  .timeline-item-default {
    flex: 1;
    font-size: 14px;
    color: #122341;
  }
  .timeline-item-footer {
    width: var(--timeline-item-footer-width);
    font-size: 12px;
    line-height: 19px;
    text-align: right;
    color: #adb4c1;
    margin-left: 30px;
  }
  .timeline-item-line {
    height: calc(
      100% + var(--timeline-row-gap) - 6px - var(--timeline-item-icon-size)
    );
    width: 2px;
    position: absolute;
    top: calc(var(--timeline-item-icon-size) + 6px + 3px);
    left: calc(
      var(--timeline-item-header-width) + (var(--timeline-item-icon-size) / 2) +
        12px - 1px
    );
    background-color: var(--timeline-item-icon-line-color);
  }
}
</style>
