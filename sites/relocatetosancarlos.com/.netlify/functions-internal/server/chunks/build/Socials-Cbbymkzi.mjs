import { mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './index-CnW7QFU2.mjs';

const _sfc_main = {
  __name: "Socials",
  __ssrInlineRender: true,
  props: {
    socialLinks: {
      type: Array,
      default: () => []
    },
    columnOnMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.socialLinks) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: [{ "flex-col lg:flex-row": __props.columnOnMobile }, "flex gap-2 mt-3"]
        }, _attrs))}><!--[-->`);
        ssrRenderList(__props.socialLinks, (social) => {
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            key: social.href,
            variant: "default",
            size: "icon",
            as: "a",
            href: social.href,
            target: "_blank",
            class: "hover:scale-105 trasform"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                if (social == null ? void 0 : social.icon) {
                  ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(social == null ? void 0 : social.icon), { class: "w-5 h-5" }, null), _parent2, _scopeId);
                } else {
                  _push2(`<!---->`);
                }
              } else {
                return [
                  (social == null ? void 0 : social.icon) ? (openBlock(), createBlock(resolveDynamicComponent(social == null ? void 0 : social.icon), {
                    key: 0,
                    class: "w-5 h-5"
                  })) : createCommentVNode("", true)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/containers/Socials.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Socials-Cbbymkzi.mjs.map
