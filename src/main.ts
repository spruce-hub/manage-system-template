import { createApp } from 'vue'
import AppRoot from './AppRoot.vue'
import router, { toFirstRoute } from './router'
import { createPinia } from 'pinia'
import { useUserInfo } from '@/store/userInfo'
import { useMenu } from '@/store/menu'
import { generateRoutes } from './router/generateRoutes'
import '@/assets/css/reset.css'
import '@/assets/css/naive-ui-global.less'
import { getToken } from './apis'

mountApp()

function mountApp() {
  const app = createApp(AppRoot)
  const pinia = createPinia()
  app.use(router).use(pinia)
  app.mount('#app')

  router.isReady().then(() => {
    const token = getToken()
    const userInfoStore = useUserInfo()
    const menuStore = useMenu()
    if (token) {
      userInfoStore.getUserInfo()
      menuStore.fetchPageMenu().then((pageMenu) => {
        generateRoutes(pageMenu)
        const currentRoute = router.currentRoute.value
        // 检测是否有权限进入当前页面
        if (
          router.hasRoute(currentRoute.path) &&
          currentRoute.path !== '/login'
        ) {
          router.replace(currentRoute.fullPath)
        } else {
          toFirstRoute()
        }
      })
    } else if (!['/login'].includes(window.location.pathname)) {
      router.push('/login')
    }
  })
}
