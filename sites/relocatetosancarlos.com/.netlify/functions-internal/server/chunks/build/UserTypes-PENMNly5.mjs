import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import __nuxt_component_1$1 from './tetakawi-BCtB9dcW.mjs';
import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { ArrowUpRight, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$1 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$2 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$3 } from './CardTitle-C2-Lmbuw.mjs';
import { u as userData } from './user-data-25SiGUPC.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UserTypes",
  __ssrInlineRender: true,
  setup(__props) {
    const getThemeClass = (index) => {
      const themes = [
        "text-blue-600",
        "text-purple-600",
        "text-emerald-600",
        "text-orange-600",
        "text-rose-600",
        "text-indigo-600"
      ];
      return themes[index % themes.length];
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_i_tetakawi = __nuxt_component_1$1;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "grid gap-8 mx-auto md:grid-cols-2 lg:grid-cols-3" }, _attrs))} data-v-e0f2951a><!--[-->`);
      ssrRenderList(unref(userData), (item, index) => {
        _push(`<li class="h-full" data-v-e0f2951a>`);
        if (item == null ? void 0 : item.type) {
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: `/onboarding/${item.type.toLowerCase().replace(/\s+/g, "-")}`,
            class: "block h-full group"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(unref(_sfc_main$1), { class: "relative h-full transition-all duration-300 hover:-translate-y-1" }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(unref(_sfc_main$2), { class: "flex flex-col items-center justify-center h-full p-8 relative" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(_component_i_tetakawi, {
                              class: ["text-[20rem] h-auto absolute opacity-10 group-hover:opacity-20 transition-all duration-300", getThemeClass(index)]
                            }, null, _parent4, _scopeId3));
                            _push4(`<div class="p-6 rounded-lg relative z-10 flex flex-col h-full" data-v-e0f2951a${_scopeId3}><div class="flex flex-col flex-1" data-v-e0f2951a${_scopeId3}><div class="flex flex-row gap-6 w-full justify-between" data-v-e0f2951a${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(_sfc_main$3), { class: "mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(item.type)}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(item.type), 1)
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(ArrowUpRight), { class: "w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" }, null, _parent4, _scopeId3));
                            _push4(`</div><p class="text-sm leading-relaxed text-slate-600 line-clamp-3" data-v-e0f2951a${_scopeId3}>${ssrInterpolate(item.description)}</p></div><div class="pt-6 mt-auto" data-v-e0f2951a${_scopeId3}><div class="flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors text-slate-400 group-hover:text-primary" data-v-e0f2951a${_scopeId3}> Get Started `);
                            _push4(ssrRenderComponent(unref(ChevronRight), { class: "w-4 h-4 transition-transform group-hover:translate-x-1" }, null, _parent4, _scopeId3));
                            _push4(`</div></div></div>`);
                          } else {
                            return [
                              createVNode(_component_i_tetakawi, {
                                class: ["text-[20rem] h-auto absolute opacity-10 group-hover:opacity-20 transition-all duration-300", getThemeClass(index)]
                              }, null, 8, ["class"]),
                              createVNode("div", { class: "p-6 rounded-lg relative z-10 flex flex-col h-full" }, [
                                createVNode("div", { class: "flex flex-col flex-1" }, [
                                  createVNode("div", { class: "flex flex-row gap-6 w-full justify-between" }, [
                                    createVNode(unref(_sfc_main$3), { class: "mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.type), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(unref(ArrowUpRight), { class: "w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
                                  ]),
                                  createVNode("p", { class: "text-sm leading-relaxed text-slate-600 line-clamp-3" }, toDisplayString(item.description), 1)
                                ]),
                                createVNode("div", { class: "pt-6 mt-auto" }, [
                                  createVNode("div", { class: "flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors text-slate-400 group-hover:text-primary" }, [
                                    createTextVNode(" Get Started "),
                                    createVNode(unref(ChevronRight), { class: "w-4 h-4 transition-transform group-hover:translate-x-1" })
                                  ])
                                ])
                              ])
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    } else {
                      return [
                        createVNode(unref(_sfc_main$2), { class: "flex flex-col items-center justify-center h-full p-8 relative" }, {
                          default: withCtx(() => [
                            createVNode(_component_i_tetakawi, {
                              class: ["text-[20rem] h-auto absolute opacity-10 group-hover:opacity-20 transition-all duration-300", getThemeClass(index)]
                            }, null, 8, ["class"]),
                            createVNode("div", { class: "p-6 rounded-lg relative z-10 flex flex-col h-full" }, [
                              createVNode("div", { class: "flex flex-col flex-1" }, [
                                createVNode("div", { class: "flex flex-row gap-6 w-full justify-between" }, [
                                  createVNode(unref(_sfc_main$3), { class: "mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(item.type), 1)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(ArrowUpRight), { class: "w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
                                ]),
                                createVNode("p", { class: "text-sm leading-relaxed text-slate-600 line-clamp-3" }, toDisplayString(item.description), 1)
                              ]),
                              createVNode("div", { class: "pt-6 mt-auto" }, [
                                createVNode("div", { class: "flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors text-slate-400 group-hover:text-primary" }, [
                                  createTextVNode(" Get Started "),
                                  createVNode(unref(ChevronRight), { class: "w-4 h-4 transition-transform group-hover:translate-x-1" })
                                ])
                              ])
                            ])
                          ]),
                          _: 2
                        }, 1024)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                return [
                  createVNode(unref(_sfc_main$1), { class: "relative h-full transition-all duration-300 hover:-translate-y-1" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$2), { class: "flex flex-col items-center justify-center h-full p-8 relative" }, {
                        default: withCtx(() => [
                          createVNode(_component_i_tetakawi, {
                            class: ["text-[20rem] h-auto absolute opacity-10 group-hover:opacity-20 transition-all duration-300", getThemeClass(index)]
                          }, null, 8, ["class"]),
                          createVNode("div", { class: "p-6 rounded-lg relative z-10 flex flex-col h-full" }, [
                            createVNode("div", { class: "flex flex-col flex-1" }, [
                              createVNode("div", { class: "flex flex-row gap-6 w-full justify-between" }, [
                                createVNode(unref(_sfc_main$3), { class: "mb-3 text-xl font-bold tracking-tight text-slate-900 transition-colors group-hover:text-primary" }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(item.type), 1)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(ArrowUpRight), { class: "w-5 h-5 opacity-20 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" })
                              ]),
                              createVNode("p", { class: "text-sm leading-relaxed text-slate-600 line-clamp-3" }, toDisplayString(item.description), 1)
                            ]),
                            createVNode("div", { class: "pt-6 mt-auto" }, [
                              createVNode("div", { class: "flex items-center gap-2 text-xs font-bold tracking-wider uppercase transition-colors text-slate-400 group-hover:text-primary" }, [
                                createTextVNode(" Get Started "),
                                createVNode(unref(ChevronRight), { class: "w-4 h-4 transition-transform group-hover:translate-x-1" })
                              ])
                            ])
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)
                ];
              }
            }),
            _: 2
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/molecules/UserTypes.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e0f2951a"]]);

export { __nuxt_component_1 as _ };
//# sourceMappingURL=UserTypes-PENMNly5.mjs.map
