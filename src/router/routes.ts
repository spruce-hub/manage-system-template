import { RouteRecordRaw } from 'vue-router'

function useRoutes() {
  const routes: RouteRecordRaw[] = [
    {
      name: 'layout',
      path: '/',
      component: () => import('@/layout/base.vue'),
      children: []
    },
    {
      name: '/login',
      path: '/login',
      component: () => import('@/views/user/login/page.vue')
    }
  ]
  return routes
}

const routes = useRoutes()

export default routes
