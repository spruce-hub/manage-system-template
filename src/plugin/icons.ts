const IconsMap = import.meta.glob('../assets/icons/*')

const reg = /\/(\w*)[.$]/
export const icons = Object.entries(IconsMap).map(([path, asyncFile]) => {
  return {
    name: path.match(reg)![1],
    component: defineAsyncComponent(asyncFile)
  }
})

export default {
  install(app, options) {
    icons.forEach((item) => {
      app.component(item.name, item.component)
    })
  }
}
