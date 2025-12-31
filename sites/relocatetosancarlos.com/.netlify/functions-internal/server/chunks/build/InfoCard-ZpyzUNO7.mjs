import { defineComponent, unref, mergeProps, withCtx, createVNode, toDisplayString, createTextVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$2, c as cn } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$4 } from './CardContent-BeoP9VPq.mjs';
import { a as _sfc_main$1$1 } from './PropertyCard-BwcRjl5g.mjs';
import { _ as _sfc_main$3 } from './CardTitle-C2-Lmbuw.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CardDescription",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<p${ssrRenderAttrs(mergeProps({
        class: unref(cn)("text-sm text-muted-foreground", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</p>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/card/CardDescription.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "InfoCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    subTitle: {},
    footerText: {},
    benefits: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$2), mergeProps({ class: "w-full p-6 space-y-4" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$1), { class: "p-0 space-y-2" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), { class: "text-2xl font-bold tracking-tight text-primary-800" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<span class="text-primary"${_scopeId3}>${ssrInterpolate(_ctx.title)}</span>`);
                      } else {
                        return [
                          createVNode("span", { class: "text-primary" }, toDisplayString(_ctx.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$1), { class: "text-base text-muted-foreground" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(_ctx.subTitle)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(_ctx.subTitle), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), { class: "text-2xl font-bold tracking-tight text-primary-800" }, {
                      default: withCtx(() => [
                        createVNode("span", { class: "text-primary" }, toDisplayString(_ctx.title), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$1), { class: "text-base text-muted-foreground" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.subTitle), 1)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$4), { class: "p-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<ul class="space-y-4"${_scopeId2}><!--[-->`);
                  ssrRenderList(_ctx.benefits, (item, index) => {
                    _push3(`<li class="flex items-start gap-4"${_scopeId2}><div${_scopeId2}><span class="flex items-center justify-center w-8 h-8 font-semibold rounded-full text-background bg-foreground"${_scopeId2}>${ssrInterpolate(index + 1)}</span></div><div${_scopeId2}><p class="font-semibold text-primary-900"${_scopeId2}>${ssrInterpolate(item.title)}</p><p class="text-sm text-muted-foreground"${_scopeId2}>${ssrInterpolate(item.description)}</p></div></li>`);
                  });
                  _push3(`<!--]--></ul>`);
                } else {
                  return [
                    createVNode("ul", { class: "space-y-4" }, [
                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.benefits, (item, index) => {
                        return openBlock(), createBlock("li", {
                          key: index,
                          class: "flex items-start gap-4"
                        }, [
                          createVNode("div", null, [
                            createVNode("span", { class: "flex items-center justify-center w-8 h-8 font-semibold rounded-full text-background bg-foreground" }, toDisplayString(index + 1), 1)
                          ]),
                          createVNode("div", null, [
                            createVNode("p", { class: "font-semibold text-primary-900" }, toDisplayString(item.title), 1),
                            createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.description), 1)
                          ])
                        ]);
                      }), 128))
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<p class="text-xs text-muted-foreground"${_scopeId}>${ssrInterpolate(_ctx.footerText)}</p>`);
          } else {
            return [
              createVNode(unref(_sfc_main$1$1), { class: "p-0 space-y-2" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "text-2xl font-bold tracking-tight text-primary-800" }, {
                    default: withCtx(() => [
                      createVNode("span", { class: "text-primary" }, toDisplayString(_ctx.title), 1)
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$1), { class: "text-base text-muted-foreground" }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.subTitle), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$4), { class: "p-0" }, {
                default: withCtx(() => [
                  createVNode("ul", { class: "space-y-4" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.benefits, (item, index) => {
                      return openBlock(), createBlock("li", {
                        key: index,
                        class: "flex items-start gap-4"
                      }, [
                        createVNode("div", null, [
                          createVNode("span", { class: "flex items-center justify-center w-8 h-8 font-semibold rounded-full text-background bg-foreground" }, toDisplayString(index + 1), 1)
                        ]),
                        createVNode("div", null, [
                          createVNode("p", { class: "font-semibold text-primary-900" }, toDisplayString(item.title), 1),
                          createVNode("p", { class: "text-sm text-muted-foreground" }, toDisplayString(item.description), 1)
                        ])
                      ]);
                    }), 128))
                  ])
                ]),
                _: 1
              }),
              createVNode("p", { class: "text-xs text-muted-foreground" }, toDisplayString(_ctx.footerText), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/cards/InfoCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=InfoCard-ZpyzUNO7.mjs.map
