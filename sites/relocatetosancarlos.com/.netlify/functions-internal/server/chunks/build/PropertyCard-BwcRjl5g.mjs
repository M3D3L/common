import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, computed, unref, mergeProps, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, createTextVNode, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderAttrs, ssrRenderSlot } from 'vue/server-renderer';
import { _ as _sfc_main$2, c as cn } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$3 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$5 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$4 } from './index-imKBogpg.mjs';
import { MapPin, Bed, Bath, Square } from 'lucide-vue-next';
import { b as useRuntimeConfig } from './server.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CardHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("flex flex-col gap-y-1.5 p-6", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/card/CardHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PropertyCard",
  __ssrInlineRender: true,
  props: {
    content: {},
    maxAmenities: { default: 3 },
    buttonText: {},
    baseUrl: {}
  },
  setup(__props) {
    const config = useRuntimeConfig();
    const props = __props;
    const createImgUrl = (content) => {
      if (!(content == null ? void 0 : content.cover_image) || !(content == null ? void 0 : content.collectionId) || !(content == null ? void 0 : content.id))
        return "";
      return `${config.public.pocketbaseUrl}api/files/${content.collectionId}/${content.id}/${content.cover_image}`;
    };
    const formattedPrice = computed(() => {
      if (!props.content) return "";
      const formatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      });
      const price = formatter.format(props.content.price);
      if (props.content.pricingType) {
        return `${price} ${props.content.pricingType}`;
      }
      return price;
    });
    const displayAmenities = computed(() => {
      var _a;
      if (!((_a = props.content) == null ? void 0 : _a.amenities)) return [];
      return props.content.amenities.slice(0, props.maxAmenities).map((a) => a.name);
    });
    const remainingAmenities = computed(() => {
      var _a;
      if (!((_a = props.content) == null ? void 0 : _a.amenities)) return 0;
      return Math.max(0, props.content.amenities.length - props.maxAmenities);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      if (_ctx.content) {
        _push(ssrRenderComponent(unref(_sfc_main$2), mergeProps({ class: "h-full overflow-hidden transition-shadow duration-300 group hover:shadow-md" }, _attrs), {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1), { class: "p-0" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a, _b;
                  if (_push3) {
                    if ((_a = _ctx.content) == null ? void 0 : _a.slug) {
                      _push3(ssrRenderComponent(_component_nuxt_link, {
                        to: `/real-estate${_ctx.content.slug}`,
                        class: "block w-full"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="relative w-full aspect-[4/3] overflow-hidden bg-muted"${_scopeId3}><img${ssrRenderAttr("src", createImgUrl(_ctx.content))}${ssrRenderAttr("alt", _ctx.content.title)} class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"${_scopeId3}></div>`);
                          } else {
                            return [
                              createVNode("div", { class: "relative w-full aspect-[4/3] overflow-hidden bg-muted" }, [
                                createVNode("img", {
                                  src: createImgUrl(_ctx.content),
                                  alt: _ctx.content.title,
                                  class: "object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                }, null, 8, ["src", "alt"])
                              ])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      ((_b = _ctx.content) == null ? void 0 : _b.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                        key: 0,
                        to: `/real-estate${_ctx.content.slug}`,
                        class: "block w-full"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative w-full aspect-[4/3] overflow-hidden bg-muted" }, [
                            createVNode("img", {
                              src: createImgUrl(_ctx.content),
                              alt: _ctx.content.title,
                              class: "object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            }, null, 8, ["src", "alt"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"])) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "p-6" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a, _b, _c, _d;
                  if (_push3) {
                    _push3(`<div class="flex flex-col h-full"${_scopeId2}><div class="mb-2"${_scopeId2}><span class="text-xl font-bold text-foreground"${_scopeId2}>${ssrInterpolate(unref(formattedPrice))}</span></div><div class="space-y-1"${_scopeId2}>`);
                    if ((_a = _ctx.content) == null ? void 0 : _a.slug) {
                      _push3(ssrRenderComponent(_component_nuxt_link, {
                        useChat: "",
                        to: `/real-estate${_ctx.content.slug}`,
                        class: "transition-colors text-primary hover:underline"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<h3 class="text-lg font-bold leading-snug line-clamp-1"${_scopeId3}>${ssrInterpolate(_ctx.content.title)}</h3>`);
                          } else {
                            return [
                              createVNode("h3", { class: "text-lg font-bold leading-snug line-clamp-1" }, toDisplayString(_ctx.content.title), 1)
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    if (_ctx.content.address) {
                      _push3(`<div class="flex items-center gap-1 text-sm text-muted-foreground"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(MapPin), {
                        size: 14,
                        class: "shrink-0"
                      }, null, _parent3, _scopeId2));
                      _push3(`<span class="truncate"${_scopeId2}>${ssrInterpolate(_ctx.content.address)}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><div class="flex items-center gap-4 py-4 mt-4 border-t border-muted/50 text-muted-foreground"${_scopeId2}>`);
                    if (_ctx.content.bedrooms) {
                      _push3(`<div class="flex items-center gap-1.5"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Bed), { size: 16 }, null, _parent3, _scopeId2));
                      _push3(`<span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(_ctx.content.bedrooms)}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (_ctx.content.bathrooms) {
                      _push3(`<div class="flex items-center gap-1.5"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Bath), { size: 16 }, null, _parent3, _scopeId2));
                      _push3(`<span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(_ctx.content.bathrooms)}</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (_ctx.content.area) {
                      _push3(`<div class="flex items-center gap-1.5"${_scopeId2}>`);
                      _push3(ssrRenderComponent(unref(Square), { size: 16 }, null, _parent3, _scopeId2));
                      _push3(`<span class="text-sm font-medium text-foreground"${_scopeId2}>${ssrInterpolate(_ctx.content.area)} m\xB2</span></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div>`);
                    if (_ctx.content.description) {
                      _push3(`<p class="text-sm leading-relaxed line-clamp-2 text-muted-foreground"${_scopeId2}>${ssrInterpolate(_ctx.content.description)}</p>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    if (unref(displayAmenities).length > 0) {
                      _push3(`<div class="mt-4 mb-6"${_scopeId2}><div class="flex flex-wrap gap-1.5"${_scopeId2}><!--[-->`);
                      ssrRenderList(unref(displayAmenities), (amenity, index) => {
                        _push3(ssrRenderComponent(unref(_sfc_main$4), {
                          key: index,
                          variant: "secondary",
                          class: "text-[10px] font-medium px-2 py-0"
                        }, {
                          default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                            if (_push4) {
                              _push4(`${ssrInterpolate(amenity)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(amenity), 1)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent3, _scopeId2));
                      });
                      _push3(`<!--]-->`);
                      if (unref(remainingAmenities) > 0) {
                        _push3(`<span class="text-[10px] text-muted-foreground self-center"${_scopeId2}> +${ssrInterpolate(unref(remainingAmenities))} more </span>`);
                      } else {
                        _push3(`<!---->`);
                      }
                      _push3(`</div></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`<div class="mt-auto"${_scopeId2}>`);
                    if ((_b = _ctx.content) == null ? void 0 : _b.slug) {
                      _push3(ssrRenderComponent(_component_nuxt_link, {
                        to: `/real-estate${_ctx.content.slug}`,
                        class: "w-full"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(ssrRenderComponent(unref(_sfc_main$5), { class: "w-full font-semibold" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`${ssrInterpolate(_ctx.buttonText || "View Listing")}`);
                                } else {
                                  return [
                                    createTextVNode(toDisplayString(_ctx.buttonText || "View Listing"), 1)
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            return [
                              createVNode(unref(_sfc_main$5), { class: "w-full font-semibold" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(_ctx.buttonText || "View Listing"), 1)
                                ]),
                                _: 1
                              })
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "flex flex-col h-full" }, [
                        createVNode("div", { class: "mb-2" }, [
                          createVNode("span", { class: "text-xl font-bold text-foreground" }, toDisplayString(unref(formattedPrice)), 1)
                        ]),
                        createVNode("div", { class: "space-y-1" }, [
                          ((_c = _ctx.content) == null ? void 0 : _c.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                            key: 0,
                            useChat: "",
                            to: `/real-estate${_ctx.content.slug}`,
                            class: "transition-colors text-primary hover:underline"
                          }, {
                            default: withCtx(() => [
                              createVNode("h3", { class: "text-lg font-bold leading-snug line-clamp-1" }, toDisplayString(_ctx.content.title), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true),
                          _ctx.content.address ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-1 text-sm text-muted-foreground"
                          }, [
                            createVNode(unref(MapPin), {
                              size: 14,
                              class: "shrink-0"
                            }),
                            createVNode("span", { class: "truncate" }, toDisplayString(_ctx.content.address), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center gap-4 py-4 mt-4 border-t border-muted/50 text-muted-foreground" }, [
                          _ctx.content.bedrooms ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Bed), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.bedrooms), 1)
                          ])) : createCommentVNode("", true),
                          _ctx.content.bathrooms ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Bath), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.bathrooms), 1)
                          ])) : createCommentVNode("", true),
                          _ctx.content.area ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Square), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.area) + " m\xB2", 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        _ctx.content.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm leading-relaxed line-clamp-2 text-muted-foreground"
                        }, toDisplayString(_ctx.content.description), 1)) : createCommentVNode("", true),
                        unref(displayAmenities).length > 0 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mt-4 mb-6"
                        }, [
                          createVNode("div", { class: "flex flex-wrap gap-1.5" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(displayAmenities), (amenity, index) => {
                              return openBlock(), createBlock(unref(_sfc_main$4), {
                                key: index,
                                variant: "secondary",
                                class: "text-[10px] font-medium px-2 py-0"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(amenity), 1)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128)),
                            unref(remainingAmenities) > 0 ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-[10px] text-muted-foreground self-center"
                            }, " +" + toDisplayString(unref(remainingAmenities)) + " more ", 1)) : createCommentVNode("", true)
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "mt-auto" }, [
                          ((_d = _ctx.content) == null ? void 0 : _d.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                            key: 0,
                            to: `/real-estate${_ctx.content.slug}`,
                            class: "w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$5), { class: "w-full font-semibold" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(_ctx.buttonText || "View Listing"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1), { class: "p-0" }, {
                  default: withCtx(() => {
                    var _a;
                    return [
                      ((_a = _ctx.content) == null ? void 0 : _a.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                        key: 0,
                        to: `/real-estate${_ctx.content.slug}`,
                        class: "block w-full"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "relative w-full aspect-[4/3] overflow-hidden bg-muted" }, [
                            createVNode("img", {
                              src: createImgUrl(_ctx.content),
                              alt: _ctx.content.title,
                              class: "object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            }, null, 8, ["src", "alt"])
                          ])
                        ]),
                        _: 1
                      }, 8, ["to"])) : createCommentVNode("", true)
                    ];
                  }),
                  _: 1
                }),
                createVNode(unref(_sfc_main$3), { class: "p-6" }, {
                  default: withCtx(() => {
                    var _a, _b;
                    return [
                      createVNode("div", { class: "flex flex-col h-full" }, [
                        createVNode("div", { class: "mb-2" }, [
                          createVNode("span", { class: "text-xl font-bold text-foreground" }, toDisplayString(unref(formattedPrice)), 1)
                        ]),
                        createVNode("div", { class: "space-y-1" }, [
                          ((_a = _ctx.content) == null ? void 0 : _a.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                            key: 0,
                            useChat: "",
                            to: `/real-estate${_ctx.content.slug}`,
                            class: "transition-colors text-primary hover:underline"
                          }, {
                            default: withCtx(() => [
                              createVNode("h3", { class: "text-lg font-bold leading-snug line-clamp-1" }, toDisplayString(_ctx.content.title), 1)
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true),
                          _ctx.content.address ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-1 text-sm text-muted-foreground"
                          }, [
                            createVNode(unref(MapPin), {
                              size: 14,
                              class: "shrink-0"
                            }),
                            createVNode("span", { class: "truncate" }, toDisplayString(_ctx.content.address), 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex items-center gap-4 py-4 mt-4 border-t border-muted/50 text-muted-foreground" }, [
                          _ctx.content.bedrooms ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Bed), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.bedrooms), 1)
                          ])) : createCommentVNode("", true),
                          _ctx.content.bathrooms ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Bath), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.bathrooms), 1)
                          ])) : createCommentVNode("", true),
                          _ctx.content.area ? (openBlock(), createBlock("div", {
                            key: 2,
                            class: "flex items-center gap-1.5"
                          }, [
                            createVNode(unref(Square), { size: 16 }),
                            createVNode("span", { class: "text-sm font-medium text-foreground" }, toDisplayString(_ctx.content.area) + " m\xB2", 1)
                          ])) : createCommentVNode("", true)
                        ]),
                        _ctx.content.description ? (openBlock(), createBlock("p", {
                          key: 0,
                          class: "text-sm leading-relaxed line-clamp-2 text-muted-foreground"
                        }, toDisplayString(_ctx.content.description), 1)) : createCommentVNode("", true),
                        unref(displayAmenities).length > 0 ? (openBlock(), createBlock("div", {
                          key: 1,
                          class: "mt-4 mb-6"
                        }, [
                          createVNode("div", { class: "flex flex-wrap gap-1.5" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(displayAmenities), (amenity, index) => {
                              return openBlock(), createBlock(unref(_sfc_main$4), {
                                key: index,
                                variant: "secondary",
                                class: "text-[10px] font-medium px-2 py-0"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(amenity), 1)
                                ]),
                                _: 2
                              }, 1024);
                            }), 128)),
                            unref(remainingAmenities) > 0 ? (openBlock(), createBlock("span", {
                              key: 0,
                              class: "text-[10px] text-muted-foreground self-center"
                            }, " +" + toDisplayString(unref(remainingAmenities)) + " more ", 1)) : createCommentVNode("", true)
                          ])
                        ])) : createCommentVNode("", true),
                        createVNode("div", { class: "mt-auto" }, [
                          ((_b = _ctx.content) == null ? void 0 : _b.slug) ? (openBlock(), createBlock(_component_nuxt_link, {
                            key: 0,
                            to: `/real-estate${_ctx.content.slug}`,
                            class: "w-full"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$5), { class: "w-full font-semibold" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(_ctx.buttonText || "View Listing"), 1)
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["to"])) : createCommentVNode("", true)
                        ])
                      ])
                    ];
                  }),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/cards/PropertyCard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$1 as a };
//# sourceMappingURL=PropertyCard-BwcRjl5g.mjs.map
