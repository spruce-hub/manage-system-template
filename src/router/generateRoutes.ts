import router from './index'
import { PagesMap } from './pagesMap'
type AsyncPagesKey = keyof typeof PagesMap

// 动态生成路由
export function generateRoutes(menu) {
  const pagesMap: any = PagesMap
  addRoute(menu, pagesMap)
  router.addRoute({
    name: 'not-found',
    path: '/:pathMatch(.*)*',
    component: () => import('../views/404.vue')
  })
  router.addRoute('layout', {
    name: '/user',
    path: '/user',
    component: () => import('../views/user/setting/page.vue'),
    meta: {
      title: '账户设置'
    }
  })
}
function addRoute(menu, pagesMap) {
  menu.forEach((vim: any) => {
    if (vim && !Array.isArray(vim)) {
      const path = vim.route_name
      router.addRoute('layout', {
        name: path,
        path: '/' + path,
        component: pagesMap[path as AsyncPagesKey] || import('../views/404.vue')
      })
    }
    if (vim.children) {
      addRoute(vim.children, pagesMap)
    }
  })
}
