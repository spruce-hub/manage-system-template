import { resolveComponent } from 'vue'
import {
  NButton,
  NInput,
  NInputNumber,
  NSelect,
  NPopover,
  NIcon,
  NTag,
  NTooltip,
  SelectOption,
  NImage,
  NDatePicker
} from 'naive-ui'
import { VNode } from 'vue'
/**
 * 设置列表字段为必选项,带星号
 * @template T
 * @param {name} 标题名称
 * @param {obj} 可扩展
 * **/
export function useTitleName(name: string, obj?: any) {
  return h(
    'div',
    {
      class: 'flex items-center'
    },
    {
      default: () => [
        h(
          'span',
          {
            style: 'color:red'
          },
          {
            default: () => '*'
          }
        ),
        h(
          'span',
          {
            class: 'pl-4'
          },
          { default: () => name }
        ),
        obj
      ]
    }
  )
}

/**
 * 列表内置表单操作
 * @template T
 * @param {type} 表单类型
 * @param {value} 展示的值
 * @param {click} 返回的事件函数
 * @param {option} 用于select的选项
 * @param {disabled} 是否禁用
 * @param {labelField} 用于select的选项，字段描述
 * @param {valueField} 用于select的选项，字段关键
 * @param {ellipsis} 用于select的选项，是否启用悬浮
 * **/
interface FormParam {
  type: string
  value?: any
  click?: Function
  clear?: Function
  blur?: Function
  options?: Array<any>
  disabled?: boolean
  labelField?: string
  valueField?: string
  ellipsis?: boolean
  precision?: number
  min?: number
  max?: number
}
export function useForm(param: FormParam) {
  const {
    type,
    value,
    click,
    options,
    disabled,
    labelField,
    valueField,
    ellipsis,
    blur,
    precision,
    min,
    max,
    clear
  } = param

  interface datatype {
    size: string
    value: any
    onUpdateValue: Function
    onClear?: Function
    onBlur?: Function
    type?: string
    autosize?: boolean
    labelField?: string
    valueField?: string
    min?: number
    max?: number
    clearable: boolean
    showButton?: boolean
    disabled?: boolean
    renderOption?: any
    ellipsis?: boolean
    filterable: boolean
    precision?: number
    options?: Array<{
      label: string | number
      value: Array<string | number> | string | number | null
      disabled?: boolean
    }>
  }
  let DATA_BASE: datatype = {
    size: 'small',
    value,
    filterable: true,
    clearable: true,
    onUpdateValue(e) {
      if (click) click(e)
    }
  }
  switch (type) {
    case 'input':
      DATA_BASE.disabled = disabled
      DATA_BASE = {
        ...DATA_BASE,
        onBlur($event) {
          if (blur) blur($event)
        }
      }
      return h(NInput, DATA_BASE)
    case 'date':
      DATA_BASE.type = 'date'
      DATA_BASE.disabled = disabled
      DATA_BASE = {
        ...DATA_BASE,
        onClear($event) {
          if (clear) {
            clear($event)
          }
        }
      }
      return h(NDatePicker, DATA_BASE)
    case 'datetimerange':
      DATA_BASE.type = 'datetimerange'
      return h(NDatePicker, DATA_BASE)
    case 'textarea':
      DATA_BASE.type = 'textarea'
      DATA_BASE.autosize = true
      return h(NInput, DATA_BASE)
    case 'number':
      DATA_BASE.min = min || 0
      DATA_BASE.max = max || 999
      DATA_BASE.precision = precision
      DATA_BASE.showButton = false
      DATA_BASE.disabled = disabled
      return h(NInputNumber, DATA_BASE)
    case 'select':
      DATA_BASE.options = options
      DATA_BASE.disabled = disabled
      if (labelField && valueField) {
        DATA_BASE.labelField = labelField
        DATA_BASE.valueField = valueField
      }
      if (ellipsis) {
        DATA_BASE.renderOption = ({ node, option }) =>
          renderOptionFn({ node, option }, labelField)
      }
      return h(NSelect, DATA_BASE)
  }
}

function renderOptionFn(
  { node, option }: { node: VNode; option: SelectOption },
  labelField
) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => option[labelField || 'label']
  })
}

/**
 * 列表操作按钮
 * @template T
 * @param {name} 按钮名称
 * @param {className} 类名
 * @param {cd} 返回的事件函数
 * **/
export function useButton(
  name: string,
  cd?: function,
  className?: string,
  disabled?: boolean
) {
  return h(
    NButton,
    {
      class: className,
      strong: true,
      tertiary: true,
      disabled: disabled,
      size: 'tiny',
      onClick: (e) => {
        if (cd) cd(e)
      }
    },
    { default: () => name }
  )
}

/**
 * 列表操作图标按钮
 * @template T
 * @param {name} 按钮名称
 * @param {cd} 返回的事件函数
 * **/

export function useIconButton(name: string, cd?: function) {
  if (name === '删除') {
    return h(IconBtn, {
      icon: 'IconDeleteFill',
      name,
      buttonClass: 'fill',
      onClick: (e) => {
        if (cd) cd(e)
      }
    })
  }
}

/**
 * 用于可NPopover,可调整内置信息
 * @template T
 * @param {name} 按钮名称
 * @param {className} 类名称
 * @param {cd} 返回的事件函数
 * **/
export function usePopover(name: string, className?: string, cd?: function) {
  return h(
    NPopover,
    {
      style:
        'max-width:600px;word-wrap: break-word;word-break: break-all;white-space: normal;',
      placement: 'top'
    },
    {
      trigger: () =>
        h(
          'span',
          {
            class: className,
            style:
              'display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 100%;vertical-align: bottom;cursor:pointer;',
            onClick: (e) => {
              if (cd) cd(e)
            }
          },
          name
        ),
      default: () => name
    }
  )
}

/**
 * 用于可NPopover,可调整内置信息
 * @template T
 * @param {name} 按钮名称
 * @param {className} 类名称
 * @param {cd} 返回的事件函数
 * **/

export function useImage(name: string, className?: string, cd?: function) {
  return h(
    NPopover,
    {
      style:
        'max-width:600px;word-wrap: break-word;word-break: break-all;white-space: normal;',
      placement: 'top'
    },
    {
      trigger: () =>
        h(
          'span',
          {
            class: className,
            style:
              'display: inline-block;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;max-width: 100%;vertical-align: bottom;cursor:pointer;',
            onClick: (e) => {
              if (cd) cd(e)
            }
          },
          name
        ),
      default: () => name
    }
  )
}

/**
 * icon无按钮图标
 * @template T
 * @param {icon} icon名称
 * @param {name} 浮起名称
 * @param {attr} 内置样式、类名等属性
 * **/

export function useIcon(param) {
  const { icon, name, attr, placement = 'top' } = param
  return h(
    NPopover,
    { placement },
    {
      trigger: () =>
        h(NIcon, attr, {
          default: h(resolveComponent(icon))
        }),
      default: () => name
    }
  )
}

/**
 * 多标签
 * @template T
 * @param {name} 名称
 * @param {type} 类型
 * @param {style} 自定义样式
 * **/

export function useTag(name: string, type?: string, style?: object) {
  return h(
    NTag,
    {
      type: type,
      size: 'small',
      color: style
    },
    {
      default: () => name
    }
  )
}

/**
 * 列表单图片上传
 * @template T
 * @param {value} 值
 * @param {cd} 返回的事件函数
 * **/
interface UpdateItem {
  value?: string
  click?: function
  uploadType?: Array<string>
  name?: string
  other?: any
}

export function useShowImage(param) {
  const { click, value } = param
  return h(
    'div',
    {
      class: 'showImg2'
    },
    {
      default: () => [
        h(NImage, {
          style: 'width:30px;max-height:30px;',
          src: value,
          'show-toolbar': false
        }),
        h('i', {
          class: 'iconfont icon-close_filled text-12',
          onClick() {
            if (click) click(value)
          }
        })
      ]
    }
  )
}
export function useOpen(url) {
  return h('i', {
    class: 'iconfont icon-a-22 text-c-2 share',
    onClick() {
      window.open(url)
    }
  })
}
