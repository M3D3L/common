import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs } from 'vue/server-renderer';

const _sfc_main = {
  __name: "Html",
  __ssrInlineRender: true,
  props: {
    content: {
      type: String
    },
    useProse: {
      type: Boolean
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["content-renderer", {
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto dark:prose-invert": __props.useProse
        }]
      }, _attrs))}>${(_a = __props.content) != null ? _a : ""}</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/containers/Html.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Html-BJT4P5oF.mjs.map
