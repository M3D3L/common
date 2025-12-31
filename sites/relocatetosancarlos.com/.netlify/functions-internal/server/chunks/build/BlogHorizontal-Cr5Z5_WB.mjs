import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, computed, unref, mergeProps, withCtx, createBlock, createCommentVNode, createVNode, openBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$2 } from './CardContent-BeoP9VPq.mjs';
import { b as useRuntimeConfig } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlogHorizontal",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    created: {},
    slug: {},
    collectionId: {},
    id: {},
    coverImage: {},
    index: {},
    baseUrl: {}
  },
  setup(__props) {
    const props = __props;
    const config = useRuntimeConfig();
    const formattedDate = computed(
      () => new Date(props.created).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    );
    const link = computed(() => `${props.baseUrl || ""}/blog${props.slug}`);
    const imageUrl = computed(
      () => `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.coverImage}`
    );
    const safeDescription = computed(() => {
      var _a;
      return ((_a = props == null ? void 0 : props.description) == null ? void 0 : _a.trim()) || "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(unref(_sfc_main$1), mergeProps({ class: "w-full overflow-hidden transition-all duration-300 border shadow-md group hover:shadow-xl hover:-translate-y-1 border-border/40 bg-card/50 backdrop-blur-sm" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$2), { class: "p-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_NuxtLink, {
                    to: unref(link),
                    class: "flex flex-col w-full h-full md:flex-row"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a;
                      if (_push4) {
                        if (_ctx.coverImage) {
                          _push4(`<div class="relative overflow-hidden md:w-2/5 aspect-[16/9] md:aspect-auto"${_scopeId3}>`);
                          if (unref(imageUrl)) {
                            _push4(`<img${ssrRenderAttr("src", unref(imageUrl))}${ssrRenderAttr("alt", _ctx.title)} width="600" height="338" loading="lazy" class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" decoding="async"${_scopeId3}>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<div class="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100"${_scopeId3}></div></div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8"${_scopeId3}><div${_scopeId3}><div class="flex items-center gap-3 mb-3"${_scopeId3}><span class="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"${_scopeId3}><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"${_scopeId3}></path></svg> ${ssrInterpolate(unref(formattedDate))}</span></div><h3 class="mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary"${_scopeId3}>${ssrInterpolate(_ctx.title)}</h3><p class="text-sm leading-relaxed text-muted-foreground line-clamp-3"${_scopeId3}>${(_a = unref(safeDescription)) != null ? _a : ""}</p></div><div class="flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3"${_scopeId3}><span${_scopeId3}>Read More</span><svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId3}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"${_scopeId3}></path></svg></div></div>`);
                      } else {
                        return [
                          _ctx.coverImage ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "relative overflow-hidden md:w-2/5 aspect-[16/9] md:aspect-auto"
                          }, [
                            unref(imageUrl) ? (openBlock(), createBlock("img", {
                              key: 0,
                              src: unref(imageUrl),
                              alt: _ctx.title,
                              width: "600",
                              height: "338",
                              loading: "lazy",
                              class: "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110",
                              decoding: "async"
                            }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                            createVNode("div", { class: "absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100" })
                          ])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8" }, [
                            createVNode("div", null, [
                              createVNode("div", { class: "flex items-center gap-3 mb-3" }, [
                                createVNode("span", { class: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground" }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-3.5 h-3.5",
                                    fill: "none",
                                    stroke: "currentColor",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("path", {
                                      "stroke-linecap": "round",
                                      "stroke-linejoin": "round",
                                      "stroke-width": "2",
                                      d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    })
                                  ])),
                                  createTextVNode(" " + toDisplayString(unref(formattedDate)), 1)
                                ])
                              ]),
                              createVNode("h3", { class: "mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary" }, toDisplayString(_ctx.title), 1),
                              createVNode("p", {
                                class: "text-sm leading-relaxed text-muted-foreground line-clamp-3",
                                innerHTML: unref(safeDescription)
                              }, null, 8, ["innerHTML"])
                            ]),
                            createVNode("div", { class: "flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3" }, [
                              createVNode("span", null, "Read More"),
                              (openBlock(), createBlock("svg", {
                                class: "w-4 h-4 transition-transform duration-300 group-hover:translate-x-1",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M13 7l5 5m0 0l-5 5m5-5H6"
                                })
                              ]))
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_NuxtLink, {
                      to: unref(link),
                      class: "flex flex-col w-full h-full md:flex-row"
                    }, {
                      default: withCtx(() => [
                        _ctx.coverImage ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "relative overflow-hidden md:w-2/5 aspect-[16/9] md:aspect-auto"
                        }, [
                          unref(imageUrl) ? (openBlock(), createBlock("img", {
                            key: 0,
                            src: unref(imageUrl),
                            alt: _ctx.title,
                            width: "600",
                            height: "338",
                            loading: "lazy",
                            class: "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110",
                            decoding: "async"
                          }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                          createVNode("div", { class: "absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100" })
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8" }, [
                          createVNode("div", null, [
                            createVNode("div", { class: "flex items-center gap-3 mb-3" }, [
                              createVNode("span", { class: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground" }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-3.5 h-3.5",
                                  fill: "none",
                                  stroke: "currentColor",
                                  viewBox: "0 0 24 24"
                                }, [
                                  createVNode("path", {
                                    "stroke-linecap": "round",
                                    "stroke-linejoin": "round",
                                    "stroke-width": "2",
                                    d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  })
                                ])),
                                createTextVNode(" " + toDisplayString(unref(formattedDate)), 1)
                              ])
                            ]),
                            createVNode("h3", { class: "mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary" }, toDisplayString(_ctx.title), 1),
                            createVNode("p", {
                              class: "text-sm leading-relaxed text-muted-foreground line-clamp-3",
                              innerHTML: unref(safeDescription)
                            }, null, 8, ["innerHTML"])
                          ]),
                          createVNode("div", { class: "flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3" }, [
                            createVNode("span", null, "Read More"),
                            (openBlock(), createBlock("svg", {
                              class: "w-4 h-4 transition-transform duration-300 group-hover:translate-x-1",
                              fill: "none",
                              stroke: "currentColor",
                              viewBox: "0 0 24 24"
                            }, [
                              createVNode("path", {
                                "stroke-linecap": "round",
                                "stroke-linejoin": "round",
                                "stroke-width": "2",
                                d: "M13 7l5 5m0 0l-5 5m5-5H6"
                              })
                            ]))
                          ])
                        ])
                      ]),
                      _: 1
                    }, 8, ["to"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$2), { class: "p-0" }, {
                default: withCtx(() => [
                  createVNode(_component_NuxtLink, {
                    to: unref(link),
                    class: "flex flex-col w-full h-full md:flex-row"
                  }, {
                    default: withCtx(() => [
                      _ctx.coverImage ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "relative overflow-hidden md:w-2/5 aspect-[16/9] md:aspect-auto"
                      }, [
                        unref(imageUrl) ? (openBlock(), createBlock("img", {
                          key: 0,
                          src: unref(imageUrl),
                          alt: _ctx.title,
                          width: "600",
                          height: "338",
                          loading: "lazy",
                          class: "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110",
                          decoding: "async"
                        }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                        createVNode("div", { class: "absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:opacity-100" })
                      ])) : createCommentVNode("", true),
                      createVNode("div", { class: "flex flex-col justify-between w-full p-6 md:w-3/5 md:p-8" }, [
                        createVNode("div", null, [
                          createVNode("div", { class: "flex items-center gap-3 mb-3" }, [
                            createVNode("span", { class: "flex items-center gap-1.5 text-xs font-medium text-muted-foreground" }, [
                              (openBlock(), createBlock("svg", {
                                class: "w-3.5 h-3.5",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24"
                              }, [
                                createVNode("path", {
                                  "stroke-linecap": "round",
                                  "stroke-linejoin": "round",
                                  "stroke-width": "2",
                                  d: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                })
                              ])),
                              createTextVNode(" " + toDisplayString(unref(formattedDate)), 1)
                            ])
                          ]),
                          createVNode("h3", { class: "mb-3 text-xl font-bold leading-tight transition-colors line-clamp-2 group-hover:text-primary" }, toDisplayString(_ctx.title), 1),
                          createVNode("p", {
                            class: "text-sm leading-relaxed text-muted-foreground line-clamp-3",
                            innerHTML: unref(safeDescription)
                          }, null, 8, ["innerHTML"])
                        ]),
                        createVNode("div", { class: "flex items-center gap-2 mt-4 text-sm font-semibold transition-all text-primary group-hover:gap-3" }, [
                          createVNode("span", null, "Read More"),
                          (openBlock(), createBlock("svg", {
                            class: "w-4 h-4 transition-transform duration-300 group-hover:translate-x-1",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24"
                          }, [
                            createVNode("path", {
                              "stroke-linecap": "round",
                              "stroke-linejoin": "round",
                              "stroke-width": "2",
                              d: "M13 7l5 5m0 0l-5 5m5-5H6"
                            })
                          ]))
                        ])
                      ])
                    ]),
                    _: 1
                  }, 8, ["to"])
                ]),
                _: 1
              })
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/cards/BlogHorizontal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=BlogHorizontal-Cr5Z5_WB.mjs.map
