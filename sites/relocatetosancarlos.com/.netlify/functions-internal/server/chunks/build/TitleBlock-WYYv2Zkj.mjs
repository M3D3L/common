import { defineComponent, mergeProps, createVNode, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderVNode, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TitleBlock",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Feature Highlights"
    },
    description: {
      type: String,
      default: "Discover what makes our solution stand out"
    },
    type: {
      type: String,
      default: "h2"
    },
    textPosition: {
      type: String,
      default: "text-center md:text-left"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [__props.textPosition, "flex flex-col w-full gap-4"]
      }, _attrs))}>`);
      ssrRenderVNode(_push, createVNode(resolveDynamicComponent(__props.type), { class: "text-4xl lg:text-6xl text-primary md:text-5xl" }, null), _parent);
      _push(`<p class="${ssrRenderClass([__props.textPosition, "w-full max-w-2xl text-lg text-muted-foreground"])}">${ssrInterpolate(__props.description)}</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/TitleBlock.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=TitleBlock-WYYv2Zkj.mjs.map
