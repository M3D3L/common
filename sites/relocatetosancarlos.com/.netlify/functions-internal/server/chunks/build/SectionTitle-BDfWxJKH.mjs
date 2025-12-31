import { defineComponent, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SectionTitle",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    },
    imgSrc: {
      type: String,
      default: ""
    },
    h1: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "z-20 flex flex-col w-full" }, _attrs))}><div class="flex items-center w-full gap-8 mb-4">`);
      if (__props.h1) {
        _push(`<h1 class="text-4xl transition-default font-black leading-tight tracking-tighter text-primary md:text-6xl">${ssrInterpolate(__props.title)}</h1>`);
      } else {
        _push(`<!--[-->`);
        if (__props.title) {
          _push(`<h2 class="max-w-4xl transition-default text-4xl font-bold leading-tight tracking-tighter text-primary md:text-5xl lg:text-4xl">${ssrInterpolate(__props.title)}</h2>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--]-->`);
      }
      if (__props.imgSrc) {
        _push(`<img${ssrRenderAttr("src", __props.imgSrc)} lazy${ssrRenderAttr("alt", `${__props.title} image`)} class="w-[84px] border-white -border-4 md:w-28">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.description) {
        _push(`<p class="max-w-3xl text-lg text-foreground/70">${(_a = __props.description) != null ? _a : ""}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/text/SectionTitle.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=SectionTitle-BDfWxJKH.mjs.map
