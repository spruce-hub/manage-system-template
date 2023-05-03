import { http } from '@/apis'
import { defineStore } from 'pinia'

interface optionsItem {
  label: string
  value: number
}
// 获取商品详情数据
export const useGoods = defineStore('goods', {
  state: () => {
    return {
      goods: {
        cover_img: '',
        open_features: 0,
        is_new: 1,
        features: [
          {
            title: '',
            sub_title: '',
            cover_img: ''
          }
        ],
        tags: [],
        name: '',
        sub_title: '',
        spu_code: '',
        mls_code: '',
        tdt_code: '',
        sms_code: '',
        code_id: '',
        icon: '',
        has_group: false,
        special_attributes: [],
        common_attributes: [],
        groups: [],
        sku_attachments: [],
        skus: [],
        attachments: [],
        related_products: [
          {
            id: new Date().getTime() + '',
            name: ''
          }
        ],
        sku_scenes: []
      }
    }
  },
  actions: {
    setGoods(data: any) {
      this.goods = data
    }
  }
})

// 获取属性接口
export const useAttribute = defineStore('attribute', {
  state: () => {
    return {
      attr: []
    }
  },
  actions: {
    setAttribute(data: any) {
      this.attr = data
    },
    async getAttribute() {
      if (this.attr.length) {
        return this.attr
      }
      const { data } = await http.get('admin-api/product/attribute/options')
      this.attr = data
      return this.attr
    }
  }
})

// 获取品牌接口
export const useBrand = defineStore('brand', {
  state: () => {
    return {
      brand: []
    }
  },
  actions: {
    setBrand(data: any) {
      this.brand = data
    },
    async getBrand() {
      if (this.brand.length) {
        return this.brand
      }
      const { data } = await http.get('admin-api/product/brand/options')
      this.brand = data
      return this.brand
    }
  }
})

// 获取属性筛选方式选项
export const useAttributeOptions = defineStore('attributeOptions', {
  state: () => {
    return {
      attributeOptions: [] as Array<optionsItem>
    }
  },
  actions: {
    setattributeOptions(data: any) {
      this.attributeOptions = data
    },
    async getattributeOptions() {
      if (this.attributeOptions.length) {
        return this.attributeOptions
      }
      const { data } = await http.get(
        'admin-api/product/attribute/filter-options'
      )
      this.attributeOptions = data
      return this.attributeOptions
    }
  }
})

// 获取权限选项
export const useAuthority = defineStore('authority', {
  state: () => {
    return {
      data: {
        department: [] as Array<optionsItem>, // 部门
        role: [] as Array<optionsItem>, // 角色
        leader: [] as Array<optionsItem>, // 负责人
        identity: [] as Array<optionsItem> // 身份
      }
    }
  },
  actions: {
    async getAuthority() {
      if (this.data.department.length) {
        return this.data
      }
      const { data } = await http.get('admin-api/admin/user/options')
      this.data = data
      return this.data
    }
  }
})

//获取ERP未绑定的账号
export const useAccount = defineStore('account', {
  state: () => {
    return {
      data: []
    }
  },
  actions: {
    async getAccount() {
      if (this.data.length) {
        return this.data
      }
      const { data } = await http.get(
        'admin-api/admin/user/other-account-list'
      )
      this.data = data
      return this.data
    }
  }
})

// 获取角色选项
export const useRole = defineStore('role', {
  state: () => {
    return {
      data: {
        data_permissions: [] as Array<optionsItem>,
        admin_user: [] as Array<optionsItem>
      }
    }
  },
  actions: {
    async getRole() {
      if (this.data.data_permissions.length) {
        return this.data
      }
      const { data } = await http.get('admin-api/admin/role/options')
      this.data = data
      return data
    }
  }
})
// 获取协议选项
export const useAgreement = defineStore('agreement', {
  state: () => {
    return {
      agr: [] as Array<optionsItem>
    }
  },
  actions: {
    async getAgr() {
      if (this.agr.length) {
        return this.agr
      }
      const { data } = await http.get('admin-api/setting/agreement/options')
      this.agr = data.type
      return this.agr
    }
  }
})
// 获取数据模型
export const useMenudata = defineStore('menudata', {
  state: () => {
    return {
      menu: {} as {
        apis: Array<any>
        models: Array<any>
      }
    }
  },
  actions: {
    async getMenudata() {
      if (JSON.stringify(this.menu) !== '{}') {
        return this.menu
      }
      const { data } = await http.get('admin-api/admin/menu/options')
      this.menu = data
      return this.menu
    }
  }
})

// 获取附件分类选项
export const useAttachment = defineStore('attachment', {
  state: () => {
    return {
      attachmentdata: [] as Array<optionsItem>
    }
  },
  actions: {
    async getAttachment() {
      if (this.attachmentdata.length) {
        return this.attachmentdata
      }
      const { data } = await http.get(
        'admin-api/product/attachment/type-options'
      )
      this.attachmentdata = data
      return data
    }
  }
})
