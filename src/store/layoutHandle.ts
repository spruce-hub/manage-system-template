import { defineStore } from 'pinia'
// 用于在子组件中调整框架布局
export const useLayoutHandleStore = defineStore('layoutHandle', {
  state: () => {
    return {
      layoutContentStyle: {
        padding: '20px 16px 20px 20px'
      } as Record<string, string>,
      layoutContainerStyle: {
        boxShadow: '0px 1px 5px rgba(51, 52, 57, 0.05)',
        borderRadius: '10px 10px 0 0',
        backgroundColor: '#fff'
      } as Record<string, string>,
      contentBodyStyle: {
        overflowX: 'auto'
      } as Record<string, string>
    }
  },
  actions: {
    setLayoutContentStyle(
      style: Record<string, string>,
      options?: { restoreOnUnmounted: boolean }
    ) {
      const { restoreOnUnmounted = true } = options || {}
      this.layoutContentStyle = style
      if (restoreOnUnmounted) {
        onUnmounted(() => {
          this.layoutContentStyle = {
            padding: '20px 16px 20px 20px'
          }
        })
      }
    },
    setLayoutContainerStyle(
      style: Record<string, string>,
      options?: { restoreOnUnmounted: boolean }
    ) {
      const { restoreOnUnmounted = true } = options || {}
      this.layoutContainerStyle = style
      if (restoreOnUnmounted) {
        onUnmounted(() => {
          this.layoutContainerStyle = {
            boxShadow: '0px 1px 5px rgba(51, 52, 57, 0.05)',
            borderRadius: '10px 10px 0 0',
            backgroundColor: '#fff'
          }
        })
      }
    },
    setContentBodyStyle(
      style: Record<string, string>,
      options?: { restoreOnUnmounted: boolean }
    ) {
      const { restoreOnUnmounted = true } = options || {}
      this.contentBodyStyle = style
      if (restoreOnUnmounted) {
        onUnmounted(() => {
          this.contentBodyStyle = {
            overflowX: 'auto'
          }
        })
      }
    }
  }
})
