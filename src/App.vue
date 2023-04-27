<template>
  <router-view />
</template>
<script lang="ts" setup>
import { onMounted } from 'vue'
import { loadingBarApiRef } from '@/router'
import { useLoadingBar, useMessage } from 'naive-ui'
const loadingBar = useLoadingBar()
const message = useMessage()
onMounted(() => {
  // 挂载message
  window.$message = message

  // 调用loadingBar
  loadingBarApiRef.value = loadingBar
})
</script>
<style></style>
