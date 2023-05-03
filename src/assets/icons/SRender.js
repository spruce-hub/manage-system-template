import { defineComponent, h, resolveComponent } from 'vue'

const SRender = defineComponent({
  name: 'SRender',
  props: {
    name: { type: String, required: true },
    iconProps: { type: Object, required: false }
  },
  setup(props) {
    return { props }
  },
  render() {
    return h(resolveComponent(this.props.name), this.iconProps)
  }
})

export default SRender
