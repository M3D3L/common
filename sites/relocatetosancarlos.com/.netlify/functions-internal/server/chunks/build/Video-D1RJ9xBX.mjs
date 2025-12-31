import { _ as __nuxt_component_2 } from './server.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { m as motion } from './index-D_6hfEP1.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Video",
  __ssrInlineRender: true,
  props: {
    video: String,
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    h1: { type: Boolean, default: false },
    hideDescription: { type: Boolean, default: false },
    imgSrc: { type: String, default: "" },
    padding: { type: String, default: "md:py-16 lg:py-24" }
  },
  setup(__props) {
    const props = __props;
    const heroRef = ref(null);
    const isVideoComponentActive = ref(false);
    const videoOpacity = ref(1);
    watch(
      () => props.video,
      async (newVideo, oldVideo) => {
        if (newVideo !== oldVideo) {
          videoOpacity.value = 0;
          await new Promise((resolve) => setTimeout(resolve, 500));
          videoOpacity.value = 1;
        }
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_2;
      _push(`<section${ssrRenderAttrs(mergeProps({
        class: ["relative flex items-center justify-center w-full overflow-hidden text-foreground", [{ "bg-cover bg-center": !unref(isVideoComponentActive) }, __props.padding]],
        ref_key: "heroRef",
        ref: heroRef,
        "aria-label": "section for video background of a " + __props.title + " and hero content",
        "aria-labelledby": __props.title,
        "aria-describedby": __props.description,
        role: "region",
        tabindex: "0",
        style: {
          backgroundImage: unref(isVideoComponentActive) ? "none" : "url(" + __props.video + ")",
          backgroundSize: "cover",
          backgroundPosition: "center"
        },
        "aria-live": unref(isVideoComponentActive) ? "polite" : "off"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_client_only, null, {}, _parent));
      _push(ssrRenderComponent(unref(motion).div, {
        class: "container z-10 w-full mx-auto rounded-2xl",
        initial: "hidden",
        whileInView: "visible",
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "video-container-content", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "video-container-content")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/containers/Video.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Video-D1RJ9xBX.mjs.map
