<template>
  <n-config-provider
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme-overrides="themeOverrides"
    abstract
  >
    <!-- 组件库的样式调节器 -->
    <!-- <n-theme-editor> -->
    <n-loading-bar-provider>
      <n-message-provider>
        <App />
      </n-message-provider>
    </n-loading-bar-provider>
    <!-- </n-theme-editor> -->
    <n-global-style />
  </n-config-provider>
</template>
<script lang="ts" setup>
import { zhCN, dateZhCN } from 'naive-ui'
import App from './App.vue'
import {
  // NThemeEditor,
  NGlobalStyle,
  NMessageProvider,
  NLoadingBarProvider,
  NConfigProvider
} from 'naive-ui'
import themeOverrides from '@/assets/css/naive-ui-theme-overrides'
</script>
<style>
/* .n-element { */
/* left: 11px; */
/* } */
</style>
