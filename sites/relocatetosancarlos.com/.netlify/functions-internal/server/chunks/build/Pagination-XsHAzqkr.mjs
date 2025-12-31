import { computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './index-CnW7QFU2.mjs';
import { c as useRoute, d as useRouter } from './server.mjs';

const _sfc_main = {
  __name: "Pagination",
  __ssrInlineRender: true,
  props: {
    totalPages: { type: Number, required: true },
    maxVisiblePages: { type: Number, default: 5 },
    showPagination: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const router = useRouter();
    const currentPage = computed(() => Number(route.query.page) || 1);
    const visiblePages = computed(() => {
      const pages = [];
      let start = 1;
      let end = props.totalPages;
      if (props.totalPages > props.maxVisiblePages) {
        const half = Math.floor(props.maxVisiblePages / 2);
        if (currentPage.value <= half + 1) {
          end = props.maxVisiblePages;
        } else if (currentPage.value >= props.totalPages - half) {
          start = props.totalPages - props.maxVisiblePages + 1;
        } else {
          start = currentPage.value - half;
          end = currentPage.value + half;
        }
      }
      for (let i = start; i <= end; i++) pages.push(i);
      return pages;
    });
    const showFirstPage = computed(
      () => props.totalPages > props.maxVisiblePages && !visiblePages.value.includes(1)
    );
    const showLastPage = computed(
      () => props.totalPages > props.maxVisiblePages && !visiblePages.value.includes(props.totalPages)
    );
    const showLeftEllipsis = computed(() => showFirstPage.value);
    const showRightEllipsis = computed(() => showLastPage.value);
    const pageButtonClass = (page) => [
      "font-medium transition-all duration-200",
      currentPage.value === page ? "bg-primary text-primary-foreground border-primary shadow-md cursor-default pointer-events-none" : "hover:bg-accent hover:border-accent-foreground/20 hover:shadow-sm hover:scale-105"
    ];
    const goToPage = (page) => {
      if (page < 1 || page > props.totalPages || page === currentPage.value) return;
      router.push({
        query: {
          ...route.query,
          page
        }
      });
    };
    return (_ctx, _push, _parent, _attrs) => {
      if (__props.showPagination && __props.totalPages > 1) {
        _push(`<nav${ssrRenderAttrs(mergeProps({
          class: "flex items-center justify-center my-6",
          "aria-label": "Pagination"
        }, _attrs))}><ul class="flex items-center gap-2"><li>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          disabled: unref(currentPage) === 1,
          onClick: ($event) => goToPage(unref(currentPage) - 1),
          class: "transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
          "aria-label": "Previous page"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronLeft), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li>`);
        if (unref(showFirstPage)) {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            disabled: unref(currentPage) === 1,
            "aria-current": unref(currentPage) === 1 ? "page" : void 0,
            class: pageButtonClass(1),
            onClick: ($event) => goToPage(1)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` 1 `);
              } else {
                return [
                  createTextVNode(" 1 ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showLeftEllipsis)) {
          _push(`<li class="px-2 text-muted-foreground">\u2026</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<!--[-->`);
        ssrRenderList(unref(visiblePages), (page) => {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            disabled: unref(currentPage) === page,
            "aria-current": unref(currentPage) === page ? "page" : void 0,
            class: pageButtonClass(page),
            onClick: ($event) => goToPage(page)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(page)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(page), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</li>`);
        });
        _push(`<!--]-->`);
        if (unref(showRightEllipsis)) {
          _push(`<li class="px-2 text-muted-foreground">\u2026</li>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showLastPage)) {
          _push(`<li>`);
          _push(ssrRenderComponent(unref(_sfc_main$1), {
            variant: "outline",
            size: "sm",
            disabled: unref(currentPage) === __props.totalPages,
            "aria-current": unref(currentPage) === __props.totalPages ? "page" : void 0,
            class: pageButtonClass(__props.totalPages),
            onClick: ($event) => goToPage(__props.totalPages)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(__props.totalPages)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(__props.totalPages), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</li>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<li>`);
        _push(ssrRenderComponent(unref(_sfc_main$1), {
          variant: "outline",
          size: "sm",
          disabled: unref(currentPage) === __props.totalPages,
          onClick: ($event) => goToPage(unref(currentPage) + 1),
          class: "transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100",
          "aria-label": "Next page"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(ChevronRight), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li></ul></nav>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/Pagination.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=Pagination-XsHAzqkr.mjs.map
