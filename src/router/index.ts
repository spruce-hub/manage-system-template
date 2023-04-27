import { LoadingBarApi } from 'naive-ui'
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import routes from './routes'

export const loadingBarApiRef = {} as Ref<LoadingBarApi>

function createAppRouter(routes: RouteRecordRaw[]) {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  router.beforeEach((to, from, next) => {
    if (!from || to.path !== from.path) {
      if (loadingBarApiRef.value) {
        loadingBarApiRef.value.start()
      }
    }
    next()
  })

  router.afterEach((to, from) => {
    if (!from || to.path !== from.path) {
      if (loadingBarApiRef.value) {
        loadingBarApiRef.value.finish()
      }
    }
  })

  return router
}

const router = createAppRouter(routes)

export function toFirstRoute() {
  router.push(router.getRoutes()[0].path)
}

export function redirectToLogin() {
  router.push('/login')
}

export default router
