import { http } from '@/apis'
import Cookie from 'js-cookie'
import { defineStore } from 'pinia'

// 获取当前登录用户的所有功能权限集
export const usePerm = defineStore('perms', {
  state: () => {
    return {
      list: []
    }
  },
  actions: {
    async getPermItem() {
      if (this.list && this.list.length) {
        return this.list
      }
      const { data } = await http.post(
        'admin-api/admin/role/get-all-action-permissions'
      )
      this.list = data
      return this.list
    }
  }
})

export const useUserInfo = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: {} as {
        id: number
        name: string
        face_url: string
        account: string
        identity: Array<string>
        has_wecom_account: boolean
        approval_count: number
        special_type: string
      }
    }
  },
  actions: {
    setUserInfo(data) {
      this.userInfo.id = data.id
      this.userInfo.name = data.name
      this.userInfo.face_url = data.face_url
    },
    setUserImg(data) {
      this.userInfo.face_url = data
    },
    async getUserInfo() {
      if (this.userInfo.id) {
        return this.userInfo
      }
      await http.get('admin-api/personal/info').then((res) => {
        this.userInfo = {
          id: res.data.id,
          face_url: res.data.face_url,
          name: res.data.name,
          account: res.data.account,
          approval_count: res.data.approval_count,
          has_wecom_account: res.data.has_wecom_account,
          identity: res.data.identity,
          special_type: res.data.special_type
        }
        Cookie.set('userInfo', JSON.stringify(this.userInfo), {
          expires: 30
        })
      })
      return this.userInfo
    }
  }
})
