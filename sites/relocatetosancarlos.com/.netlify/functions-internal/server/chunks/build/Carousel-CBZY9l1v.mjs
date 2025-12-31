import { _ as __nuxt_component_2 } from './server.mjs';
import { defineComponent, ref, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Carousel",
  __ssrInlineRender: true,
  props: {
    slides: {
      type: Array,
      default: () => []
    },
    breakpoints: {
      type: Object,
      default: () => ({
        320: {
          slidesPerView: 1
        },
        640: {
          slidesPerView: 1.5
        },
        768: {
          slidesPerView: 2.5
        },
        1024: {
          slidesPerView: 3
        }
      })
    }
  },
  emits: ["selected-event"],
  setup(__props, { emit: __emit }) {
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_2;
      _push(ssrRenderComponent(_component_client_only, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/containers/Carousel.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Carousel-CBZY9l1v.mjs.map
