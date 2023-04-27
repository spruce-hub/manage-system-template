import { http } from '@/apis'
import { defineStore } from 'pinia'
// 菜单栏
export const useMenu = defineStore('menu', {
  state: () => {
    return {
      menu: [],
      name: ''
    }
  },
  actions: {
    setMenuName(value) {
      this.name = value
    },
    async fetchPageMenu() {
      await http.get('admin-api/admin-user/sys-conf/menu').then((res) => {
        this.menu = res.data.tree
      })
      return this.menu
    }
  }
})

// 全局设置
export const useTabsStore = defineStore('tabs', {
  state: () => {
    return {
      size: 50,
      height: 'medium'
    }
  },
  actions: {
    setTabsSize(value) {
      this.size = value
      localStorage.setItem('tabsSise', value + '')
    },
    setTabsHeight(value) {
      this.height = value
      localStorage.setItem('tabsHeight', value)
    },
    defaultTabs() {
      this.size = 50
      this.height = 'medium'
      localStorage.setItem('tabsSise', '50')
      localStorage.setItem('tabsHeight', 'medium')
    }
  }
})
