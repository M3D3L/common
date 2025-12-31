import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, ref, watch, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, withDirectives, isRef, vModelCheckbox, toDisplayString, createBlock, createCommentVNode, openBlock, Fragment, renderList, renderSlot, withModifiers, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrLooseContain, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderAttr, ssrRenderSlot } from 'vue/server-renderer';
import { RefreshCw, Plus, Save, Edit, Trash2, X, RotateCcw } from 'lucide-vue-next';
import { _ as _sfc_main$q } from './index-imKBogpg.mjs';
import { _ as _sfc_main$k, b as buttonVariants } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$m, c as cn } from './Card-BcNzGmRo.mjs';
import { a as usePocketBaseCore, b as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$p, a as _sfc_main$1$4 } from './Label-NdntEGti.mjs';
import { _ as _sfc_main$r } from './Textarea-jDz9Vded.mjs';
import { useForwardPropsEmits, AlertDialogRoot, AlertDialogPortal, AlertDialogOverlay, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, Separator } from 'reka-ui';
import { _ as _sfc_main$6$1, a as _sfc_main$1$5, b as _sfc_main$s, c as _sfc_main$5$1, d as _sfc_main$4$1 } from './SelectValue-DCL2EBub.mjs';
import imageCompression from 'browser-image-compression';
import { r as reactiveOmit } from './index-C2tg38pJ.mjs';
import { u as useAuth } from './useAuth-yR7jtp4v.mjs';
import { _ as _sfc_main$2$1, a as _sfc_main$1$1, b as _sfc_main$l } from './TabsTrigger-CSTcvnFX.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$n } from './DialogContent--DfaB7PA.mjs';
import { _ as _sfc_main$1$3, a as _sfc_main$o, b as _sfc_main$2$2 } from './DialogTitle-etzFEgfj.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'ipx';
import 'class-variance-authority';
import 'radix-vue';
import 'clsx';
import 'tailwind-merge';
import 'pinia';
import 'vue-router';
import 'pocketbase';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './index-K7kOdbQk.mjs';
import '@radix-icons/vue';

const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full overflow-auto" }, _attrs))}><table class="${ssrRenderClass(unref(cn)("w-full caption-bottom text-sm", props.class))}">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</table></div>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/Table.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "TableBody",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tbody${ssrRenderAttrs(mergeProps({
        class: unref(cn)("[&_tr:last-child]:border-0", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tbody>`);
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/TableBody.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "TableCell",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<td${ssrRenderAttrs(mergeProps({
        class: unref(cn)(
          "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</td>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/TableCell.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "TableRow",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<tr${ssrRenderAttrs(mergeProps({
        class: unref(cn)("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</tr>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/TableRow.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "TableHead",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<th${ssrRenderAttrs(mergeProps({
        class: unref(cn)("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-0.5", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</th>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/TableHead.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "TableHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<thead${ssrRenderAttrs(mergeProps({
        class: unref(cn)("[&_tr]:border-b", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</thead>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/table/TableHeader.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "PropertyTable",
  __ssrInlineRender: true,
  props: {
    properties: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    hideEdit: { type: Boolean, default: false },
    imgMode: { type: String, default: "small" }
  },
  emits: ["edit", "delete"],
  setup(__props) {
    const { getFileUrl } = usePocketBaseCore();
    const getImageUrl = (property) => {
      return property.cover_image ? getFileUrl(property, property.cover_image) : "";
    };
    const getBadgeVariant = (type) => {
      if (type === "rental") return "secondary";
      if (type === "lot") return "outline";
      return "default";
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      _push(ssrRenderComponent(unref(_sfc_main$j), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$e), { class: "bg-muted/50" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$g), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$f), { class: "w-[100px]" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Preview`);
                            } else {
                              return [
                                createTextVNode("Preview")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Details`);
                            } else {
                              return [
                                createTextVNode("Details")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Type`);
                            } else {
                              return [
                                createTextVNode("Type")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Price`);
                            } else {
                              return [
                                createTextVNode("Price")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$f), { class: "lg:w-auto min-w-24" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Specs`);
                            } else {
                              return [
                                createTextVNode("Specs")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        if (!__props.hideEdit) {
                          _push4(ssrRenderComponent(unref(_sfc_main$f), { class: "text-right" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Actions`);
                              } else {
                                return [
                                  createTextVNode("Actions")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          createVNode(unref(_sfc_main$f), { class: "w-[100px]" }, {
                            default: withCtx(() => [
                              createTextVNode("Preview")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode("Details")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode("Type")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode("Price")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$f), { class: "lg:w-auto min-w-24" }, {
                            default: withCtx(() => [
                              createTextVNode("Specs")
                            ]),
                            _: 1
                          }),
                          !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$f), {
                            key: 0,
                            class: "text-right"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Actions")
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$g), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$f), { class: "w-[100px]" }, {
                          default: withCtx(() => [
                            createTextVNode("Preview")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode("Details")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode("Type")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode("Price")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$f), { class: "lg:w-auto min-w-24" }, {
                          default: withCtx(() => [
                            createTextVNode("Specs")
                          ]),
                          _: 1
                        }),
                        !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$f), {
                          key: 0,
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Actions")
                          ]),
                          _: 1
                        })) : createCommentVNode("", true)
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$i), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  if (__props.loading) {
                    _push3(ssrRenderComponent(unref(_sfc_main$g), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$h), {
                            colspan: "6",
                            class: "h-32 text-center"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="flex items-center justify-center gap-2 text-muted-foreground"${_scopeId4}><span class="animate-spin text-primary"${_scopeId4}>|</span> Loading properties... </div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "flex items-center justify-center gap-2 text-muted-foreground" }, [
                                    createVNode("span", { class: "animate-spin text-primary" }, "|"),
                                    createTextVNode(" Loading properties... ")
                                  ])
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$h), {
                              colspan: "6",
                              class: "h-32 text-center"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex items-center justify-center gap-2 text-muted-foreground" }, [
                                  createVNode("span", { class: "animate-spin text-primary" }, "|"),
                                  createTextVNode(" Loading properties... ")
                                ])
                              ]),
                              _: 1
                            })
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else if (!__props.properties.length) {
                    _push3(ssrRenderComponent(unref(_sfc_main$g), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$h), {
                            colspan: "6",
                            class: "h-32 text-center text-muted-foreground"
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(` No properties found in this category. `);
                              } else {
                                return [
                                  createTextVNode(" No properties found in this category. ")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$h), {
                              colspan: "6",
                              class: "h-32 text-center text-muted-foreground"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(" No properties found in this category. ")
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
                  _push3(`<!--[-->`);
                  ssrRenderList(__props.properties, (property) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$g), {
                      key: property.id,
                      class: "group transition-colors hover:bg-muted/30"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="${ssrRenderClass([__props.imgMode === "large" ? "w-32 h-32 my-4" : "w-16 h-16", "rounded-md bg-muted border overflow-hidden"])}"${_scopeId4}>`);
                                if (property.cover_image) {
                                  _push5(ssrRenderComponent(_component_nuxt_link, {
                                    to: `/real-estate${property.slug}`,
                                    class: "w-full h-full block"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`<img${ssrRenderAttr("src", getImageUrl(property))}${ssrRenderAttr("alt", property.title)} class="w-full h-full object-cover transition-transform group-hover:scale-105"${_scopeId5}>`);
                                      } else {
                                        return [
                                          createVNode("img", {
                                            src: getImageUrl(property),
                                            alt: property.title,
                                            class: "w-full h-full object-cover transition-transform group-hover:scale-105"
                                          }, null, 8, ["src", "alt"])
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  _push5(`<div class="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"${_scopeId4}> No Image </div>`);
                                }
                                _push5(`</div>`);
                              } else {
                                return [
                                  createVNode("div", {
                                    class: [__props.imgMode === "large" ? "w-32 h-32 my-4" : "w-16 h-16", "rounded-md bg-muted border overflow-hidden"]
                                  }, [
                                    property.cover_image ? (openBlock(), createBlock(_component_nuxt_link, {
                                      key: 0,
                                      to: `/real-estate${property.slug}`,
                                      class: "w-full h-full block"
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("img", {
                                          src: getImageUrl(property),
                                          alt: property.title,
                                          class: "w-full h-full object-cover transition-transform group-hover:scale-105"
                                        }, null, 8, ["src", "alt"])
                                      ]),
                                      _: 2
                                    }, 1032, ["to"])) : (openBlock(), createBlock("div", {
                                      key: 1,
                                      class: "w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"
                                    }, " No Image "))
                                  ], 2)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(_component_nuxt_link, {
                                  to: `/real-estate${property.slug}`,
                                  class: "font-medium hover:underline hover:text-primary transition-colors"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(property.title)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(property.title), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                                _push5(`<div class="text-xs text-muted-foreground truncate max-w-[250px]"${_scopeId4}>${ssrInterpolate(property.description)}</div>`);
                              } else {
                                return [
                                  createVNode(_component_nuxt_link, {
                                    to: `/real-estate${property.slug}`,
                                    class: "font-medium hover:underline hover:text-primary transition-colors"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(property.title), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["to"]),
                                  createVNode("div", { class: "text-xs text-muted-foreground truncate max-w-[250px]" }, toDisplayString(property.description), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$q), {
                                  variant: getBadgeVariant(property.type),
                                  class: "capitalize"
                                }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`${ssrInterpolate(property.type)}`);
                                    } else {
                                      return [
                                        createTextVNode(toDisplayString(property.type), 1)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$q), {
                                    variant: getBadgeVariant(property.type),
                                    class: "capitalize"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(property.type), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["variant"])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$h), { class: "font-medium" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(property.price ? `$${property.price.toLocaleString()}` : "\u2014")} ${ssrInterpolate(property.pricingType ? property.pricingType : "")}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(property.price ? `$${property.price.toLocaleString()}` : "\u2014") + " " + toDisplayString(property.pricingType ? property.pricingType : ""), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<div class="flex flex-col text-xs text-muted-foreground"${_scopeId4}><span${_scopeId4}>Beds: ${ssrInterpolate(property.bedrooms || 0)} / Baths: ${ssrInterpolate(property.bathrooms || 0)}</span><span${_scopeId4}>${ssrInterpolate(property.area ? `${property.area} m\xB2` : "")}</span></div>`);
                              } else {
                                return [
                                  createVNode("div", { class: "flex flex-col text-xs text-muted-foreground" }, [
                                    createVNode("span", null, "Beds: " + toDisplayString(property.bedrooms || 0) + " / Baths: " + toDisplayString(property.bathrooms || 0), 1),
                                    createVNode("span", null, toDisplayString(property.area ? `${property.area} m\xB2` : ""), 1)
                                  ])
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                          if (!__props.hideEdit) {
                            _push4(ssrRenderComponent(unref(_sfc_main$h), { class: "text-right" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<div class="flex justify-end gap-1"${_scopeId4}>`);
                                  _push5(ssrRenderComponent(unref(_sfc_main$k), {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ($event) => _ctx.$emit("edit", property),
                                    title: "Edit"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Edit), { class: "w-4 h-4 text-blue-500" }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(Edit), { class: "w-4 h-4 text-blue-500" })
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(ssrRenderComponent(unref(_sfc_main$k), {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ($event) => _ctx.$emit("delete", property),
                                    title: "Delete"
                                  }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4 text-destructive" }, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(unref(Trash2), { class: "w-4 h-4 text-destructive" })
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                  _push5(`</div>`);
                                } else {
                                  return [
                                    createVNode("div", { class: "flex justify-end gap-1" }, [
                                      createVNode(unref(_sfc_main$k), {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: ($event) => _ctx.$emit("edit", property),
                                        title: "Edit"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Edit), { class: "w-4 h-4 text-blue-500" })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"]),
                                      createVNode(unref(_sfc_main$k), {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: ($event) => _ctx.$emit("delete", property),
                                        title: "Delete"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Trash2), { class: "w-4 h-4 text-destructive" })
                                        ]),
                                        _: 1
                                      }, 8, ["onClick"])
                                    ])
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                        } else {
                          return [
                            createVNode(unref(_sfc_main$h), null, {
                              default: withCtx(() => [
                                createVNode("div", {
                                  class: [__props.imgMode === "large" ? "w-32 h-32 my-4" : "w-16 h-16", "rounded-md bg-muted border overflow-hidden"]
                                }, [
                                  property.cover_image ? (openBlock(), createBlock(_component_nuxt_link, {
                                    key: 0,
                                    to: `/real-estate${property.slug}`,
                                    class: "w-full h-full block"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("img", {
                                        src: getImageUrl(property),
                                        alt: property.title,
                                        class: "w-full h-full object-cover transition-transform group-hover:scale-105"
                                      }, null, 8, ["src", "alt"])
                                    ]),
                                    _: 2
                                  }, 1032, ["to"])) : (openBlock(), createBlock("div", {
                                    key: 1,
                                    class: "w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"
                                  }, " No Image "))
                                ], 2)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$h), null, {
                              default: withCtx(() => [
                                createVNode(_component_nuxt_link, {
                                  to: `/real-estate${property.slug}`,
                                  class: "font-medium hover:underline hover:text-primary transition-colors"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(property.title), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["to"]),
                                createVNode("div", { class: "text-xs text-muted-foreground truncate max-w-[250px]" }, toDisplayString(property.description), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$h), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$q), {
                                  variant: getBadgeVariant(property.type),
                                  class: "capitalize"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(property.type), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["variant"])
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$h), { class: "font-medium" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(property.price ? `$${property.price.toLocaleString()}` : "\u2014") + " " + toDisplayString(property.pricingType ? property.pricingType : ""), 1)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(_sfc_main$h), null, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex flex-col text-xs text-muted-foreground" }, [
                                  createVNode("span", null, "Beds: " + toDisplayString(property.bedrooms || 0) + " / Baths: " + toDisplayString(property.bathrooms || 0), 1),
                                  createVNode("span", null, toDisplayString(property.area ? `${property.area} m\xB2` : ""), 1)
                                ])
                              ]),
                              _: 2
                            }, 1024),
                            !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$h), {
                              key: 0,
                              class: "text-right"
                            }, {
                              default: withCtx(() => [
                                createVNode("div", { class: "flex justify-end gap-1" }, [
                                  createVNode(unref(_sfc_main$k), {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ($event) => _ctx.$emit("edit", property),
                                    title: "Edit"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Edit), { class: "w-4 h-4 text-blue-500" })
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"]),
                                  createVNode(unref(_sfc_main$k), {
                                    variant: "ghost",
                                    size: "icon",
                                    onClick: ($event) => _ctx.$emit("delete", property),
                                    title: "Delete"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Trash2), { class: "w-4 h-4 text-destructive" })
                                    ]),
                                    _: 1
                                  }, 8, ["onClick"])
                                ])
                              ]),
                              _: 2
                            }, 1024)) : createCommentVNode("", true)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    __props.loading ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$h), {
                          colspan: "6",
                          class: "h-32 text-center"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center justify-center gap-2 text-muted-foreground" }, [
                              createVNode("span", { class: "animate-spin text-primary" }, "|"),
                              createTextVNode(" Loading properties... ")
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : !__props.properties.length ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 1 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$h), {
                          colspan: "6",
                          class: "h-32 text-center text-muted-foreground"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" No properties found in this category. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true),
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.properties, (property) => {
                      return openBlock(), createBlock(unref(_sfc_main$g), {
                        key: property.id,
                        class: "group transition-colors hover:bg-muted/30"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createVNode("div", {
                                class: [__props.imgMode === "large" ? "w-32 h-32 my-4" : "w-16 h-16", "rounded-md bg-muted border overflow-hidden"]
                              }, [
                                property.cover_image ? (openBlock(), createBlock(_component_nuxt_link, {
                                  key: 0,
                                  to: `/real-estate${property.slug}`,
                                  class: "w-full h-full block"
                                }, {
                                  default: withCtx(() => [
                                    createVNode("img", {
                                      src: getImageUrl(property),
                                      alt: property.title,
                                      class: "w-full h-full object-cover transition-transform group-hover:scale-105"
                                    }, null, 8, ["src", "alt"])
                                  ]),
                                  _: 2
                                }, 1032, ["to"])) : (openBlock(), createBlock("div", {
                                  key: 1,
                                  class: "w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"
                                }, " No Image "))
                              ], 2)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createVNode(_component_nuxt_link, {
                                to: `/real-estate${property.slug}`,
                                class: "font-medium hover:underline hover:text-primary transition-colors"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(property.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"]),
                              createVNode("div", { class: "text-xs text-muted-foreground truncate max-w-[250px]" }, toDisplayString(property.description), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$q), {
                                variant: getBadgeVariant(property.type),
                                class: "capitalize"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(property.type), 1)
                                ]),
                                _: 2
                              }, 1032, ["variant"])
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$h), { class: "font-medium" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(property.price ? `$${property.price.toLocaleString()}` : "\u2014") + " " + toDisplayString(property.pricingType ? property.pricingType : ""), 1)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex flex-col text-xs text-muted-foreground" }, [
                                createVNode("span", null, "Beds: " + toDisplayString(property.bedrooms || 0) + " / Baths: " + toDisplayString(property.bathrooms || 0), 1),
                                createVNode("span", null, toDisplayString(property.area ? `${property.area} m\xB2` : ""), 1)
                              ])
                            ]),
                            _: 2
                          }, 1024),
                          !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$h), {
                            key: 0,
                            class: "text-right"
                          }, {
                            default: withCtx(() => [
                              createVNode("div", { class: "flex justify-end gap-1" }, [
                                createVNode(unref(_sfc_main$k), {
                                  variant: "ghost",
                                  size: "icon",
                                  onClick: ($event) => _ctx.$emit("edit", property),
                                  title: "Edit"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Edit), { class: "w-4 h-4 text-blue-500" })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"]),
                                createVNode(unref(_sfc_main$k), {
                                  variant: "ghost",
                                  size: "icon",
                                  onClick: ($event) => _ctx.$emit("delete", property),
                                  title: "Delete"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Trash2), { class: "w-4 h-4 text-destructive" })
                                  ]),
                                  _: 1
                                }, 8, ["onClick"])
                              ])
                            ]),
                            _: 2
                          }, 1024)) : createCommentVNode("", true)
                        ]),
                        _: 2
                      }, 1024);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$e), { class: "bg-muted/50" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$g), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$f), { class: "w-[100px]" }, {
                        default: withCtx(() => [
                          createTextVNode("Preview")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), null, {
                        default: withCtx(() => [
                          createTextVNode("Details")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), null, {
                        default: withCtx(() => [
                          createTextVNode("Type")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), null, {
                        default: withCtx(() => [
                          createTextVNode("Price")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$f), { class: "lg:w-auto min-w-24" }, {
                        default: withCtx(() => [
                          createTextVNode("Specs")
                        ]),
                        _: 1
                      }),
                      !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$f), {
                        key: 0,
                        class: "text-right"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Actions")
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$i), null, {
                default: withCtx(() => [
                  __props.loading ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), {
                        colspan: "6",
                        class: "h-32 text-center"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center justify-center gap-2 text-muted-foreground" }, [
                            createVNode("span", { class: "animate-spin text-primary" }, "|"),
                            createTextVNode(" Loading properties... ")
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : !__props.properties.length ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), {
                        colspan: "6",
                        class: "h-32 text-center text-muted-foreground"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" No properties found in this category. ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  (openBlock(true), createBlock(Fragment, null, renderList(__props.properties, (property) => {
                    return openBlock(), createBlock(unref(_sfc_main$g), {
                      key: property.id,
                      class: "group transition-colors hover:bg-muted/30"
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createVNode("div", {
                              class: [__props.imgMode === "large" ? "w-32 h-32 my-4" : "w-16 h-16", "rounded-md bg-muted border overflow-hidden"]
                            }, [
                              property.cover_image ? (openBlock(), createBlock(_component_nuxt_link, {
                                key: 0,
                                to: `/real-estate${property.slug}`,
                                class: "w-full h-full block"
                              }, {
                                default: withCtx(() => [
                                  createVNode("img", {
                                    src: getImageUrl(property),
                                    alt: property.title,
                                    class: "w-full h-full object-cover transition-transform group-hover:scale-105"
                                  }, null, 8, ["src", "alt"])
                                ]),
                                _: 2
                              }, 1032, ["to"])) : (openBlock(), createBlock("div", {
                                key: 1,
                                class: "w-full h-full flex items-center justify-center text-[10px] text-muted-foreground"
                              }, " No Image "))
                            ], 2)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createVNode(_component_nuxt_link, {
                              to: `/real-estate${property.slug}`,
                              class: "font-medium hover:underline hover:text-primary transition-colors"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(property.title), 1)
                              ]),
                              _: 2
                            }, 1032, ["to"]),
                            createVNode("div", { class: "text-xs text-muted-foreground truncate max-w-[250px]" }, toDisplayString(property.description), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$q), {
                              variant: getBadgeVariant(property.type),
                              class: "capitalize"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(property.type), 1)
                              ]),
                              _: 2
                            }, 1032, ["variant"])
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$h), { class: "font-medium" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(property.price ? `$${property.price.toLocaleString()}` : "\u2014") + " " + toDisplayString(property.pricingType ? property.pricingType : ""), 1)
                          ]),
                          _: 2
                        }, 1024),
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-col text-xs text-muted-foreground" }, [
                              createVNode("span", null, "Beds: " + toDisplayString(property.bedrooms || 0) + " / Baths: " + toDisplayString(property.bathrooms || 0), 1),
                              createVNode("span", null, toDisplayString(property.area ? `${property.area} m\xB2` : ""), 1)
                            ])
                          ]),
                          _: 2
                        }, 1024),
                        !__props.hideEdit ? (openBlock(), createBlock(unref(_sfc_main$h), {
                          key: 0,
                          class: "text-right"
                        }, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex justify-end gap-1" }, [
                              createVNode(unref(_sfc_main$k), {
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => _ctx.$emit("edit", property),
                                title: "Edit"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Edit), { class: "w-4 h-4 text-blue-500" })
                                ]),
                                _: 1
                              }, 8, ["onClick"]),
                              createVNode(unref(_sfc_main$k), {
                                variant: "ghost",
                                size: "icon",
                                onClick: ($event) => _ctx.$emit("delete", property),
                                title: "Delete"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(Trash2), { class: "w-4 h-4 text-destructive" })
                                ]),
                                _: 1
                              }, 8, ["onClick"])
                            ])
                          ]),
                          _: 2
                        }, 1024)) : createCommentVNode("", true)
                      ]),
                      _: 2
                    }, 1024);
                  }), 128))
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/atoms/PropertyTable.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Separator",
  __ssrInlineRender: true,
  props: {
    orientation: {},
    decorative: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {},
    label: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Separator), mergeProps(delegatedProps.value, {
        class: unref(cn)(
          "shrink-0 bg-border relative",
          props.orientation === "vertical" ? "w-px h-full" : "h-px w-full",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (props.label) {
              _push2(`<span class="${ssrRenderClass(
                unref(cn)(
                  "text-xs text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center",
                  props.orientation === "vertical" ? "w-[1px] px-1 py-2" : "h-[1px] py-1 px-2"
                )
              )}"${_scopeId}>${ssrInterpolate(props.label)}</span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              props.label ? (openBlock(), createBlock("span", {
                key: 0,
                class: unref(cn)(
                  "text-xs text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center",
                  props.orientation === "vertical" ? "w-[1px] px-1 py-2" : "h-[1px] py-1 px-2"
                )
              }, toDisplayString(props.label), 3)) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/separator/Separator.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "AlertDialog",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogRoot), mergeProps(unref(forwarded), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialog.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogAction",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogAction), mergeProps(unref(delegatedProps), {
        class: unref(cn)(unref(buttonVariants)(), props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogAction.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogCancel",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogCancel), mergeProps(unref(delegatedProps), {
        class: unref(cn)(unref(buttonVariants)({ variant: "outline" }), "mt-2 sm:mt-0", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogCancel.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    disableOutsidePointerEvents: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside", "focusOutside", "interactOutside", "openAutoFocus", "closeAutoFocus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = reactiveOmit(props, "class");
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(AlertDialogOverlay), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(AlertDialogContent), mergeProps(unref(forwarded), {
              class: unref(cn)(
                "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(AlertDialogOverlay), { class: "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }),
              createVNode(unref(AlertDialogContent), mergeProps(unref(forwarded), {
                class: unref(cn)(
                  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogContent.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogDescription",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogDescription), mergeProps(unref(delegatedProps), {
        class: unref(cn)("text-sm text-muted-foreground", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogDescription.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogFooter",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)(
          "flex flex-col-reverse sm:flex-row sm:justify-end sm:gap-x-2",
          props.class
        )
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogFooter.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogHeader",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("flex flex-col gap-y-2 text-center sm:text-left", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogHeader.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AlertDialogTitle",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = reactiveOmit(props, "class");
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AlertDialogTitle), mergeProps(unref(delegatedProps), {
        class: unref(cn)("text-lg font-semibold", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/alert-dialog/AlertDialogTitle.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ImageUploader",
  __ssrInlineRender: true,
  props: {
    image: {},
    collectionId: {},
    id: {},
    name: {},
    label: {},
    loading: { type: Boolean },
    format: { default: "webp" },
    width: {},
    height: {},
    quality: { default: 80 }
  },
  emits: ["upload", "remove"],
  setup(__props, { emit: __emit }) {
    const config = useRuntimeConfig();
    const props = __props;
    const emit = __emit;
    const fileInput = ref(null);
    const showDeleteDialog = ref(false);
    const localPreviewUrl = ref(null);
    const processing = ref(false);
    const isDragging = ref(false);
    const hasProcessedInitialImage = ref(false);
    const isUnsavedFile = computed(
      () => props.image instanceof File || props.image instanceof Blob
    );
    const resolvedImagePropUrl = computed(() => {
      if (!props.image) return null;
      if (typeof props.image === "string") {
        if (!props.id || !props.collectionId) return null;
        return `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.id}/${props.image}`;
      }
      if (isUnsavedFile.value) {
        return URL.createObjectURL(props.image);
      }
      return null;
    });
    const displaySource = computed(() => {
      return localPreviewUrl.value || resolvedImagePropUrl.value;
    });
    const openFileDialog = () => {
      var _a;
      (_a = fileInput.value) == null ? void 0 : _a.click();
    };
    const compressImage = async (file) => {
      processing.value = true;
      const targetType = `image/${props.format === "jpeg" ? "jpeg" : props.format}`;
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: props.width || props.height || 1920,
        useWebWorker: true,
        initialQuality: props.quality / 100,
        fileType: targetType
      };
      try {
        const compressedBlob = await imageCompression(file, options);
        const cleanName = props.name ? props.name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-") : file.name.split(".")[0];
        const fileName = `${cleanName}.${props.format}`;
        return new File([compressedBlob], fileName, { type: targetType });
      } catch (error) {
        console.error("Image compression failed:", error);
        return file;
      } finally {
        processing.value = false;
      }
    };
    const processFile = async (file) => {
      if (!file.type.startsWith("image/")) {
        console.error("Only image files are allowed");
        return;
      }
      if (localPreviewUrl.value) URL.revokeObjectURL(localPreviewUrl.value);
      localPreviewUrl.value = URL.createObjectURL(file);
      const processedFile = await compressImage(file);
      emit("upload", processedFile);
    };
    const handleFileChange = async (event) => {
      const target = event.target;
      if (target.files && target.files.length > 0) {
        await processFile(target.files[0]);
      }
      target.value = "";
    };
    const onDragOver = (event) => {
      isDragging.value = true;
    };
    const onDragLeave = (event) => {
      isDragging.value = false;
    };
    const onDrop = async (event) => {
      var _a;
      isDragging.value = false;
      const files = (_a = event.dataTransfer) == null ? void 0 : _a.files;
      if (files && files.length > 0) {
        await processFile(files[0]);
      }
    };
    const resetLocalPreview = () => {
      if (localPreviewUrl.value) {
        URL.revokeObjectURL(localPreviewUrl.value);
        localPreviewUrl.value = null;
      }
    };
    const onConfirmDelete = () => {
      resetLocalPreview();
      emit("remove");
      showDeleteDialog.value = false;
    };
    watch(
      () => props.image,
      (newVal, oldVal) => {
        if (typeof newVal === "string" && typeof oldVal !== "string") {
          resetLocalPreview();
          hasProcessedInitialImage.value = false;
        }
        if ((newVal instanceof File || newVal instanceof Blob) && !hasProcessedInitialImage.value) {
          hasProcessedInitialImage.value = true;
          processFile(newVal);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><div class="flex items-center justify-between">`);
      if (_ctx.label) {
        _push(ssrRenderComponent(unref(_sfc_main$p), { class: "text-base font-semibold block" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(localPreviewUrl) || unref(isUnsavedFile)) {
        _push(ssrRenderComponent(unref(_sfc_main$k), {
          variant: "ghost",
          size: "sm",
          class: "h-8 text-xs gap-1",
          onClick: resetLocalPreview
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(RotateCcw), { class: "h-3 w-3" }, null, _parent2, _scopeId));
              _push2(` Discard Changes `);
            } else {
              return [
                createVNode(unref(RotateCcw), { class: "h-3 w-3" }),
                createTextVNode(" Discard Changes ")
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$m), { class: "overflow-hidden border-dashed border-muted/60 relative" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([{ "ring-2 ring-primary ring-offset-2": unref(isDragging) }, "relative h-64 w-full cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors flex items-center justify-center group"])}"${_scopeId}><input type="file" accept="image/*" class="hidden"${_scopeId}>`);
            if (unref(displaySource)) {
              _push2(`<!--[--><img${ssrRenderAttr("src", unref(displaySource))} alt="Upload preview" class="absolute inset-0 h-full w-full object-cover"${_scopeId}>`);
              if (unref(localPreviewUrl) || unref(isUnsavedFile)) {
                _push2(`<div class="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase z-20 shadow-sm"${_scopeId}> Unsaved </div>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<div class="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$k), {
                size: "icon",
                variant: "secondary",
                type: "button",
                onClick: openFileDialog
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Edit), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Edit), { class: "h-4 w-4" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$k), {
                size: "icon",
                variant: "destructive",
                type: "button",
                onClick: ($event) => showDeleteDialog.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Trash2), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(Trash2), { class: "h-4 w-4" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div><!--]-->`);
            } else {
              _push2(`<div class="flex flex-col items-center text-muted-foreground"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Plus), { class: "mb-2 h-8 w-8" }, null, _parent2, _scopeId));
              _push2(`<span class="text-sm"${_scopeId}>${ssrInterpolate(unref(isDragging) ? "Drop image here" : "Upload Image")}</span><span class="text-xs mt-1 opacity-70"${_scopeId}>Click or drag to upload</span></div>`);
            }
            if (_ctx.loading || unref(processing)) {
              _push2(`<div class="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"${_scopeId}><div class="flex flex-col items-center gap-2 text-white"${_scopeId}><div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"${_scopeId}></div><span class="text-xs font-medium"${_scopeId}>${ssrInterpolate(unref(processing) ? "Optimizing..." : "Uploading...")}</span></div></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", {
                class: ["relative h-64 w-full cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors flex items-center justify-center group", { "ring-2 ring-primary ring-offset-2": unref(isDragging) }],
                onClick: openFileDialog,
                onDragover: withModifiers(onDragOver, ["prevent"]),
                onDragleave: withModifiers(onDragLeave, ["prevent"]),
                onDrop: withModifiers(onDrop, ["prevent"])
              }, [
                createVNode("input", {
                  type: "file",
                  accept: "image/*",
                  ref_key: "fileInput",
                  ref: fileInput,
                  class: "hidden",
                  onChange: handleFileChange
                }, null, 544),
                unref(displaySource) ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                  createVNode("img", {
                    src: unref(displaySource),
                    alt: "Upload preview",
                    class: "absolute inset-0 h-full w-full object-cover"
                  }, null, 8, ["src"]),
                  unref(localPreviewUrl) || unref(isUnsavedFile) ? (openBlock(), createBlock("div", {
                    key: 0,
                    class: "absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase z-20 shadow-sm"
                  }, " Unsaved ")) : createCommentVNode("", true),
                  createVNode("div", { class: "absolute inset-0 bg-black/50 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity" }, [
                    createVNode(unref(_sfc_main$k), {
                      size: "icon",
                      variant: "secondary",
                      type: "button",
                      onClick: withModifiers(openFileDialog, ["stop"])
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Edit), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$k), {
                      size: "icon",
                      variant: "destructive",
                      type: "button",
                      onClick: withModifiers(($event) => showDeleteDialog.value = true, ["stop"])
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Trash2), { class: "h-4 w-4" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ])
                ], 64)) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "flex flex-col items-center text-muted-foreground"
                }, [
                  createVNode(unref(Plus), { class: "mb-2 h-8 w-8" }),
                  createVNode("span", { class: "text-sm" }, toDisplayString(unref(isDragging) ? "Drop image here" : "Upload Image"), 1),
                  createVNode("span", { class: "text-xs mt-1 opacity-70" }, "Click or drag to upload")
                ])),
                _ctx.loading || unref(processing) ? (openBlock(), createBlock("div", {
                  key: 2,
                  class: "absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10"
                }, [
                  createVNode("div", { class: "flex flex-col items-center gap-2 text-white" }, [
                    createVNode("div", { class: "animate-spin rounded-full h-8 w-8 border-b-2 border-white" }),
                    createVNode("span", { class: "text-xs font-medium" }, toDisplayString(unref(processing) ? "Optimizing..." : "Uploading..."), 1)
                  ])
                ])) : createCommentVNode("", true)
              ], 34)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        open: unref(showDeleteDialog),
        "onUpdate:open": ($event) => showDeleteDialog.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$8), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Remove Image?`);
                            } else {
                              return [
                                createTextVNode("Remove Image?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` This will remove the current image. You will need to upload a new one to replace it. `);
                            } else {
                              return [
                                createTextVNode(" This will remove the current image. You will need to upload a new one to replace it. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), null, {
                            default: withCtx(() => [
                              createTextVNode("Remove Image?")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => [
                              createTextVNode(" This will remove the current image. You will need to upload a new one to replace it. ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$9), {
                          onClick: ($event) => showDeleteDialog.value = false
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          onClick: onConfirmDelete,
                          class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Remove `);
                            } else {
                              return [
                                createTextVNode(" Remove ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$9), {
                            onClick: ($event) => showDeleteDialog.value = false
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }, 8, ["onClick"]),
                          createVNode(unref(_sfc_main$a), {
                            onClick: onConfirmDelete,
                            class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(" Remove ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), null, {
                          default: withCtx(() => [
                            createTextVNode("Remove Image?")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => [
                            createTextVNode(" This will remove the current image. You will need to upload a new one to replace it. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$6), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          onClick: ($event) => showDeleteDialog.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }, 8, ["onClick"]),
                        createVNode(unref(_sfc_main$a), {
                          onClick: onConfirmDelete,
                          class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Remove ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$8), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$4), null, {
                        default: withCtx(() => [
                          createTextVNode("Remove Image?")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createTextVNode(" This will remove the current image. You will need to upload a new one to replace it. ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$6), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), {
                        onClick: ($event) => showDeleteDialog.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$a), {
                        onClick: onConfirmDelete,
                        class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Remove ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/molecules/ImageUploader.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ImageGalleryUploader",
  __ssrInlineRender: true,
  props: {
    images: { default: () => [] },
    collectionId: {},
    recordId: {},
    label: {},
    name: {},
    format: { default: "webp" },
    width: {},
    height: {},
    quality: { default: 80 }
  },
  emits: ["update:images"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isGalleryDragging = ref(false);
    const cleanName = (name) => {
      return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    };
    const addNewImage = (file) => {
      const updatedImages = [...props.images, file];
      emit("update:images", updatedImages);
    };
    const updateExistingImage = (index, file) => {
      const updatedImages = [...props.images];
      updatedImages[index] = file;
      emit("update:images", updatedImages);
    };
    const removeImage = (index) => {
      const updatedImages = [...props.images];
      updatedImages.splice(index, 1);
      emit("update:images", updatedImages);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-4" }, _attrs))}><div class="flex items-center justify-between">`);
      if (_ctx.label) {
        _push(ssrRenderComponent(unref(_sfc_main$p), { class: "text-lg font-bold" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(_ctx.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(_ctx.label), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="${ssrRenderClass([{
        "ring-2 ring-primary ring-offset-4 rounded-lg": unref(isGalleryDragging)
      }, "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative"])}">`);
      if (unref(isGalleryDragging)) {
        _push(`<div class="absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg flex items-center justify-center z-50 pointer-events-none"><div class="bg-background border-2 border-primary rounded-lg p-6 shadow-lg"><div class="flex flex-col items-center text-primary">`);
        _push(ssrRenderComponent(unref(Plus), { class: "h-12 w-12 mb-2" }, null, _parent));
        _push(`<span class="text-lg font-semibold">Drop images here</span><span class="text-sm opacity-70">Add multiple images at once</span></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(_ctx.images, (img, index) => {
        _push(`<div class="relative">`);
        _push(ssrRenderComponent(_sfc_main$3, {
          image: img,
          id: _ctx.recordId,
          "collection-id": _ctx.collectionId,
          format: _ctx.format,
          quality: _ctx.quality,
          width: _ctx.width,
          height: _ctx.height,
          name: `${cleanName(_ctx.name)}-gallery-${index + 1}`,
          onRemove: ($event) => removeImage(index),
          onUpload: (file) => updateExistingImage(index, file)
        }, null, _parent));
        _push(`</div>`);
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(_sfc_main$3, {
        key: _ctx.images.length,
        "collection-id": _ctx.collectionId,
        id: _ctx.recordId,
        format: _ctx.format,
        quality: _ctx.quality,
        width: _ctx.width,
        height: _ctx.height,
        name: `${cleanName(_ctx.name)}-gallery-${_ctx.images.length + 1}`,
        onUpload: addNewImage
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/organisms/ImageGalleryUploader.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const amenitiesList = [
  "Swimming Pool",
  "High-Speed Wi-Fi",
  "Private Parking",
  "Central Air Conditioning",
  "Fully Equipped Fitness Center",
  "Landscaped Garden",
  "Private Balcony or Terrace",
  "Indoor Fireplace",
  "24/7 Security",
  "Smart TV",
  "Fully Equipped Kitchen",
  "In-Unit Washer & Dryer",
  "Pet-Friendly",
  "Outdoor Seating Area",
  "Backup Power Generator",
  "Reverse Osmosis Water System",
  "Rooftop Sunset Deck",
  "Large Water Cistern (Pila)",
  "Palapa-Shaded Patio",
  "Views of Cerro Tetakawi",
  "Outdoor Shower",
  "Hurricane Shutters",
  "Built-in BBQ Grill",
  "Boat or Trailer Parking",
  "Heated Pool or Jacuzzi",
  "Starlink Satellite Internet",
  "Keyless Smart Locks",
  "Beach Gear & Kayaks",
  "Outdoor Misting System",
  "Solar Power Panels",
  "Fish Cleaning Station",
  "Dedicated Workspace",
  "Mini-Split A/C Units",
  "EV Charging Station",
  "Water Softener System"
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PropertyForm",
  __ssrInlineRender: true,
  props: {
    modelValue: {
      type: Object,
      required: true,
      default: () => ({ amenities: [] })
    },
    authorDisplay: { type: String, default: "" }
  },
  emits: ["update:modelValue", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const addAmenity = (payload) => {
      const amenityName = (payload == null ? void 0 : payload.name) || "";
      props.modelValue.amenities.push({ name: amenityName });
    };
    const removeAmenity = (index) => {
      props.modelValue.amenities.splice(index, 1);
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex-1 overflow-y-auto p-6 space-y-8" }, _attrs))}><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div class="col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "title" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Property Title *`);
          } else {
            return [
              createTextVNode("Property Title *")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "title",
        modelValue: __props.modelValue.title,
        "onUpdate:modelValue": ($event) => __props.modelValue.title = $event,
        placeholder: "e.g. Modern Beachfront Villa",
        required: ""
      }, null, _parent));
      _push(`</div><div class="col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "description" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Short Description *`);
          } else {
            return [
              createTextVNode("Short Description *")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$r), {
        id: "description",
        modelValue: __props.modelValue.description,
        "onUpdate:modelValue": ($event) => __props.modelValue.description = $event,
        placeholder: "A brief summary...",
        required: ""
      }, null, _parent));
      _push(`</div><div class="md:col-span-1 col-span-2 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Listing Type *`);
          } else {
            return [
              createTextVNode("Listing Type *")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$6$1), {
        modelValue: __props.modelValue.type,
        "onUpdate:modelValue": ($event) => __props.modelValue.type = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$5), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$s), { placeholder: "Select type" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$s), { placeholder: "Select type" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "property" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Sale (Properties)`);
                      } else {
                        return [
                          createTextVNode("Sale (Properties)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "rental" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Rental (Rentals)`);
                      } else {
                        return [
                          createTextVNode("Rental (Rentals)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "lot" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Land Lot (Lots)`);
                      } else {
                        return [
                          createTextVNode("Land Lot (Lots)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$4$1), { value: "property" }, {
                      default: withCtx(() => [
                        createTextVNode("Sale (Properties)")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4$1), { value: "rental" }, {
                      default: withCtx(() => [
                        createTextVNode("Rental (Rentals)")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4$1), { value: "lot" }, {
                      default: withCtx(() => [
                        createTextVNode("Land Lot (Lots)")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$5), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$s), { placeholder: "Select type" })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$5$1), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$4$1), { value: "property" }, {
                    default: withCtx(() => [
                      createTextVNode("Sale (Properties)")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4$1), { value: "rental" }, {
                    default: withCtx(() => [
                      createTextVNode("Rental (Rentals)")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4$1), { value: "lot" }, {
                    default: withCtx(() => [
                      createTextVNode("Land Lot (Lots)")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-2 md:col-span-1 col-span-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "price" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Price (USD)`);
          } else {
            return [
              createTextVNode("Price (USD)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "price",
        type: "number",
        step: "0.01",
        modelValue: __props.modelValue.price,
        "onUpdate:modelValue": ($event) => __props.modelValue.price = $event,
        modelModifiers: { number: true }
      }, null, _parent));
      _push(`</div><div class="space-y-2 col-span-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Price Type`);
          } else {
            return [
              createTextVNode("Price Type")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$6$1), {
        modelValue: __props.modelValue.pricingType,
        "onUpdate:modelValue": ($event) => __props.modelValue.pricingType = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$5), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$s), { placeholder: "Select price type" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$s), { placeholder: "Select price type" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "per/night" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Per Night`);
                      } else {
                        return [
                          createTextVNode("Per Night")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "per/month" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Per Month`);
                      } else {
                        return [
                          createTextVNode("Per Month")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "usd" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`usd`);
                      } else {
                        return [
                          createTextVNode("usd")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4$1), { value: "mxn" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`mxn`);
                      } else {
                        return [
                          createTextVNode("mxn")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$4$1), { value: "per/night" }, {
                      default: withCtx(() => [
                        createTextVNode("Per Night")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4$1), { value: "per/month" }, {
                      default: withCtx(() => [
                        createTextVNode("Per Month")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4$1), { value: "usd" }, {
                      default: withCtx(() => [
                        createTextVNode("usd")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4$1), { value: "mxn" }, {
                      default: withCtx(() => [
                        createTextVNode("mxn")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$5), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$s), { placeholder: "Select price type" })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$5$1), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$4$1), { value: "per/night" }, {
                    default: withCtx(() => [
                      createTextVNode("Per Night")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4$1), { value: "per/month" }, {
                    default: withCtx(() => [
                      createTextVNode("Per Month")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4$1), { value: "usd" }, {
                    default: withCtx(() => [
                      createTextVNode("usd")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$4$1), { value: "mxn" }, {
                    default: withCtx(() => [
                      createTextVNode("mxn")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="col-span-2 flex md:flex-row flex-col gap-4"><div class="space-y-2 w-full">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "beds" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Bedrooms`);
          } else {
            return [
              createTextVNode("Bedrooms")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "beds",
        type: "number",
        modelValue: __props.modelValue.bedrooms,
        "onUpdate:modelValue": ($event) => __props.modelValue.bedrooms = $event,
        modelModifiers: { number: true }
      }, null, _parent));
      _push(`</div><div class="space-y-2 w-full">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "baths" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Bathrooms`);
          } else {
            return [
              createTextVNode("Bathrooms")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "baths",
        type: "number",
        step: "0.5",
        modelValue: __props.modelValue.bathrooms,
        "onUpdate:modelValue": ($event) => __props.modelValue.bathrooms = $event,
        modelModifiers: { number: true }
      }, null, _parent));
      _push(`</div></div><div class="grid grid-cols-2 gap-4"><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "area" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Area (m\xB2)`);
          } else {
            return [
              createTextVNode("Area (m\xB2)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "area",
        type: "number",
        modelValue: __props.modelValue.area,
        "onUpdate:modelValue": ($event) => __props.modelValue.area = $event,
        modelModifiers: { number: true }
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "lot" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Lot Size (m\xB2)`);
          } else {
            return [
              createTextVNode("Lot Size (m\xB2)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "lot",
        type: "number",
        modelValue: __props.modelValue.lotSize,
        "onUpdate:modelValue": ($event) => __props.modelValue.lotSize = $event,
        modelModifiers: { number: true }
      }, null, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$c), null, null, _parent));
      _push(`<div class="grid grid-cols-1 md:grid-cols-3 gap-6"><div class="md:col-span-3 space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "address" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Full Address`);
          } else {
            return [
              createTextVNode("Full Address")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "address",
        modelValue: __props.modelValue.address,
        "onUpdate:modelValue": ($event) => __props.modelValue.address = $event,
        placeholder: "123 Street..."
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "lat" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Latitude`);
          } else {
            return [
              createTextVNode("Latitude")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "lat",
        modelValue: __props.modelValue.lat,
        "onUpdate:modelValue": ($event) => __props.modelValue.lat = $event,
        placeholder: "0.0000"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "long" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Longitude`);
          } else {
            return [
              createTextVNode("Longitude")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$4), {
        id: "long",
        modelValue: __props.modelValue.long,
        "onUpdate:modelValue": ($event) => __props.modelValue.long = $event,
        placeholder: "0.0000"
      }, null, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$c), null, null, _parent));
      _push(`<div class="space-y-4">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { class: "text-base" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Amenities &amp; Features`);
          } else {
            return [
              createTextVNode("Amenities & Features")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex flex-wrap gap-2 w-full"><!--[-->`);
      ssrRenderList(unref(amenitiesList), (amenity) => {
        _push(ssrRenderComponent(unref(_sfc_main$k), {
          key: amenity,
          type: "button",
          variant: "secondary",
          size: "sm",
          onClick: ($event) => addAmenity({ name: amenity })
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Plus), { class: "w-3 h-3 mr-2" }, null, _parent2, _scopeId));
              _push2(` ${ssrInterpolate(amenity)}`);
            } else {
              return [
                createVNode(unref(Plus), { class: "w-3 h-3 mr-2" }),
                createTextVNode(" " + toDisplayString(amenity), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-3"><!--[-->`);
      ssrRenderList(__props.modelValue.amenities, (amenity, index) => {
        _push(`<div class="flex gap-2">`);
        _push(ssrRenderComponent(unref(_sfc_main$1$4), {
          modelValue: amenity.name,
          "onUpdate:modelValue": ($event) => amenity.name = $event,
          placeholder: "Amenity name..."
        }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$k), {
          type: "button",
          variant: "outline",
          size: "icon",
          onClick: ($event) => removeAmenity(index),
          class: "shrink-0"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(X), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$k), {
        type: "button",
        variant: "secondary",
        size: "sm",
        onClick: ($event) => addAmenity()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "w-3 h-3 mr-2" }, null, _parent2, _scopeId));
            _push2(` Add Amenity `);
          } else {
            return [
              createVNode(unref(Plus), { class: "w-3 h-3 mr-2" }),
              createTextVNode(" Add Amenity ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(unref(_sfc_main$p), { for: "content" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Detailed Content (HTML)`);
          } else {
            return [
              createTextVNode("Detailed Content (HTML)")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$r), {
        id: "content",
        modelValue: __props.modelValue.content,
        "onUpdate:modelValue": ($event) => __props.modelValue.content = $event,
        rows: "6",
        class: "font-mono text-xs"
      }, null, _parent));
      _push(`</div><div class="space-y-2">`);
      _push(ssrRenderComponent(_sfc_main$3, {
        label: "Cover Image",
        name: `${((_a = __props.modelValue) == null ? void 0 : _a.title) || "cover_image"}-cover`,
        id: __props.modelValue.id,
        "collection-id": __props.modelValue.collectionId,
        image: __props.modelValue.cover_image,
        onUpload: (f) => __props.modelValue.cover_image = f,
        onRemove: ($event) => __props.modelValue.cover_image = "",
        format: "webp",
        width: 800,
        height: 600,
        quality: 80
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        key: ((_b = __props.modelValue.gallery) == null ? void 0 : _b.length) || 0,
        label: "Gallery Images",
        name: ((_c = __props.modelValue) == null ? void 0 : _c.title) || "gallery",
        "record-id": __props.modelValue.id,
        "collection-id": __props.modelValue.collectionId,
        images: __props.modelValue.gallery || [],
        "onUpdate:images": (imgs) => __props.modelValue.gallery = imgs,
        format: "webp",
        width: 1200,
        height: 800,
        quality: 80
      }, null, _parent));
      _push(`</div></form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/atoms/PropertyForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const useChatGPT = () => {
  const loading = ref(false);
  const error = ref(null);
  const run = async (command, data) => {
    var _a;
    loading.value = true;
    error.value = null;
    try {
      const processedData = typeof data === "object" ? JSON.stringify(data) : data;
      const res = await $fetch(
        "https://chatgpt-proxy.guillermoantoniomedel.workers.dev",
        {
          method: "POST",
          body: { command, data: processedData }
        }
      );
      return res.result;
    } catch (err) {
      error.value = ((_a = err == null ? void 0 : err.data) == null ? void 0 : _a.error) || "Request failed";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  return { run, loading, error };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const {
      fetchCollection,
      createItem,
      updateItem,
      deleteItem,
      invalidateCollectionCache
    } = usePocketBaseCore();
    const { user } = useAuth();
    const { run: runChatGPT } = useChatGPT();
    const properties = ref({ items: [] });
    const loading = ref(true);
    const activeFilter = ref("all");
    const showModal = ref(false);
    const showDeleteModal = ref(false);
    const isEditing = ref(false);
    const saving = ref(false);
    const deleting = ref(false);
    const propertyToDelete = ref(null);
    const disableAi = ref(localStorage.getItem("property_ai_disabled") !== "false");
    watch(disableAi, (newVal) => {
      localStorage.setItem("property_ai_disabled", newVal.toString());
    });
    const getInitialFormData = () => {
      var _a;
      return {
        id: null,
        title: "",
        slug: "",
        sub_title: "",
        description: "",
        content: "",
        keywords: "",
        // Added Keywords field
        type: "property",
        price: 0,
        pricingType: "usd",
        bedrooms: 0,
        bathrooms: 0,
        area: 0,
        lotSize: 0,
        address: "",
        lat: "",
        long: "",
        amenities: [],
        cover_image: "",
        gallery: [],
        collectionId: "",
        author: ((_a = user.value) == null ? void 0 : _a.id) || null
      };
    };
    const formData = ref(getInitialFormData());
    const filteredProperties = computed(() => {
      if (activeFilter.value === "all") return properties.value.items || [];
      return properties.value.items.filter(
        (p) => p.type === activeFilter.value
      );
    });
    const getAuthorDisplay = () => {
      var _a;
      if (!formData.value.author) return ((_a = user.value) == null ? void 0 : _a.username) || "Current User";
      if (typeof formData.value.author === "object") {
        return formData.value.author.username || formData.value.author.email || "Unknown Author";
      }
      return `Author ID: ${formData.value.author}`;
    };
    const needsAIEnrichment = (data) => {
      var _a, _b, _c, _d;
      return !((_a = data.description) == null ? void 0 : _a.trim()) || !((_b = data.content) == null ? void 0 : _b.trim()) || !((_c = data.sub_title) == null ? void 0 : _c.trim()) || !((_d = data.keywords) == null ? void 0 : _d.trim());
    };
    const loadProperties = async (ignoreCache = false) => {
      loading.value = true;
      try {
        properties.value = await fetchCollection(
          "properties",
          1,
          100,
          "",
          "-created",
          "author",
          null,
          ignoreCache
        );
      } finally {
        loading.value = false;
      }
    };
    const openAddModal = () => {
      isEditing.value = false;
      formData.value = getInitialFormData();
      showModal.value = true;
    };
    const openEditModal = (property) => {
      isEditing.value = true;
      formData.value = {
        ...property,
        amenities: Array.isArray(property.amenities) ? [...property.amenities] : [],
        keywords: property.keywords || ""
      };
      showModal.value = true;
    };
    const saveProperty = async () => {
      var _a, _b, _c, _d, _e, _f, _g;
      if (!formData.value.title) return;
      saving.value = true;
      try {
        if (needsAIEnrichment(formData.value) && !disableAi.value) {
          try {
            const aiContext = {
              title: formData.value.title,
              type: formData.value.type,
              price: formData.value.price,
              bedrooms: formData.value.bedrooms,
              bathrooms: formData.value.bathrooms,
              area: formData.value.area,
              address: formData.value.address,
              amenities: formData.value.amenities.filter((a) => {
                var _a2;
                return (_a2 = a == null ? void 0 : a.name) == null ? void 0 : _a2.trim();
              }).map((a) => a.name.trim())
            };
            const instruction = `Act as a senior Real Estate SEO Copywriter. Using the provided property data, generate a high-conversion, SEO-optimized JSON object. 
        
Strategy:
1. sub_title: High-intent keywords. Max 120 chars.
2. description: Meta Description style summary. Max 300 chars.
3. content: Semantic HTML (h2, p, strong). Focus on San Carlos Lifestyle.
4. keywords: Generate a comma-separated string of 8-12 relevant SEO keywords. ONLY USE KEYWORDS BASED OFF THE data available (type, location, amenities, features).

Return ONLY a JSON object. Omit all other text. 

Format: { "sub_title": "...", "description": "...", "content": "...", "keywords": "..." }`;
            console.log("AI enrichment started...");
            const aiPromise = runChatGPT(instruction, aiContext);
            const timeoutPromise = new Promise(
              (_, reject) => setTimeout(() => reject(new Error("AI timeout")), 2e4)
            );
            const aiResult = await Promise.race([aiPromise, timeoutPromise]);
            if (aiResult) {
              const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
              if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                if (!((_a = formData.value.sub_title) == null ? void 0 : _a.trim()) && parsed.sub_title) {
                  formData.value.sub_title = parsed.sub_title.slice(0, 120);
                }
                if (!((_b = formData.value.description) == null ? void 0 : _b.trim()) && parsed.description) {
                  formData.value.description = parsed.description.slice(0, 300);
                }
                if (!((_c = formData.value.content) == null ? void 0 : _c.trim()) && parsed.content) {
                  formData.value.content = parsed.content;
                }
                if (!((_d = formData.value.keywords) == null ? void 0 : _d.trim()) && parsed.keywords) {
                  formData.value.keywords = parsed.keywords;
                  console.log("Keywords enriched:", parsed.keywords);
                }
              }
            }
          } catch (err) {
            console.warn("AI enrichment skipped or failed:", err.message);
          }
        }
        const folderMap = {
          property: "properties",
          rental: "rentals",
          lot: "lots"
        };
        const folder = folderMap[formData.value.type] || "properties";
        const titleSlug = formData.value.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const slug = `/${folder}/${titleSlug}`;
        const payload = {
          ...formData.value,
          slug: !isEditing.value || !((_e = formData.value.slug) == null ? void 0 : _e.startsWith(`/${folder}/`)) ? slug : formData.value.slug,
          author: typeof formData.value.author === "object" ? (_f = formData.value.author) == null ? void 0 : _f.id : formData.value.author || ((_g = user.value) == null ? void 0 : _g.id),
          amenities: formData.value.amenities.filter((a) => {
            var _a2;
            return (_a2 = a == null ? void 0 : a.name) == null ? void 0 : _a2.trim();
          }).map((a) => ({ name: a.name.trim() }))
        };
        if (isEditing.value) {
          await updateItem("properties", formData.value.id, payload);
        } else {
          await createItem("properties", payload);
        }
        ["properties", "rentals", "lots"].forEach(invalidateCollectionCache);
        await loadProperties(true);
        showModal.value = false;
      } catch (err) {
        alert(err.message || "Save failed");
      } finally {
        saving.value = false;
      }
    };
    const confirmDelete = (property) => {
      propertyToDelete.value = property;
      showDeleteModal.value = true;
    };
    const deleteProperty = async () => {
      if (!propertyToDelete.value) return;
      deleting.value = true;
      try {
        await deleteItem("properties", propertyToDelete.value.id);
        await loadProperties(true);
        showDeleteModal.value = false;
      } finally {
        deleting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AtomsPropertyTable = _sfc_main$d;
      const _component_AtomsPropertyForm = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container py-8 min-h-screen bg-background text-foreground" }, _attrs))}><div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"><div><h1 class="text-3xl font-bold tracking-tight">Property Management</h1><p class="text-muted-foreground"> Manage, edit, and track your real estate listings. </p></div><div class="flex gap-2 flex-wrap">`);
      _push(ssrRenderComponent(unref(_sfc_main$k), {
        onClick: ($event) => loadProperties(true),
        variant: "outline",
        class: "gap-2 shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(RefreshCw), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Reset Listings `);
          } else {
            return [
              createVNode(unref(RefreshCw), { class: "w-4 h-4" }),
              createTextVNode(" Reset Listings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$k), {
        onClick: openAddModal,
        class: "gap-2 shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Plus), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Add Property `);
          } else {
            return [
              createVNode(unref(Plus), { class: "w-4 h-4" }),
              createTextVNode(" Add Property ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$k), {
        variant: "outline",
        class: "gap-2 shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray(unref(disableAi)) ? ssrLooseContain(unref(disableAi), null) : unref(disableAi)) ? " checked" : ""} id="disable-ai-checkbox" class="mr-2"${_scopeId}><label for="disable-ai-checkbox" class="select-none"${_scopeId}> Disable AI </label>`);
          } else {
            return [
              withDirectives(createVNode("input", {
                type: "checkbox",
                "onUpdate:modelValue": ($event) => isRef(disableAi) ? disableAi.value = $event : null,
                id: "disable-ai-checkbox",
                class: "mr-2"
              }, null, 8, ["onUpdate:modelValue"]), [
                [vModelCheckbox, unref(disableAi)]
              ]),
              createVNode("label", {
                for: "disable-ai-checkbox",
                class: "select-none"
              }, " Disable AI ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
      _push(ssrRenderComponent(unref(_sfc_main$2$1), {
        modelValue: unref(activeFilter),
        "onUpdate:modelValue": ($event) => isRef(activeFilter) ? activeFilter.value = $event : null,
        class: "mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1$1), { class: "grid w-full max-w-md grid-cols-4" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$l), { value: "all" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`All`);
                      } else {
                        return [
                          createTextVNode("All")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$l), { value: "property" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Property`);
                      } else {
                        return [
                          createTextVNode("Property")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$l), { value: "rental" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Rental`);
                      } else {
                        return [
                          createTextVNode("Rental")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$l), { value: "lot" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Lot`);
                      } else {
                        return [
                          createTextVNode("Lot")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$l), { value: "all" }, {
                      default: withCtx(() => [
                        createTextVNode("All")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$l), { value: "property" }, {
                      default: withCtx(() => [
                        createTextVNode("Property")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$l), { value: "rental" }, {
                      default: withCtx(() => [
                        createTextVNode("Rental")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$l), { value: "lot" }, {
                      default: withCtx(() => [
                        createTextVNode("Lot")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1$1), { class: "grid w-full max-w-md grid-cols-4" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$l), { value: "all" }, {
                    default: withCtx(() => [
                      createTextVNode("All")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$l), { value: "property" }, {
                    default: withCtx(() => [
                      createTextVNode("Property")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$l), { value: "rental" }, {
                    default: withCtx(() => [
                      createTextVNode("Rental")
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$l), { value: "lot" }, {
                    default: withCtx(() => [
                      createTextVNode("Lot")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$m), { class: "overflow-hidden border-muted/60" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AtomsPropertyTable, {
              properties: unref(filteredProperties),
              loading: unref(loading),
              onEdit: openEditModal,
              onDelete: confirmDelete
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AtomsPropertyTable, {
                properties: unref(filteredProperties),
                loading: unref(loading),
                onEdit: openEditModal,
                onDelete: confirmDelete
              }, null, 8, ["properties", "loading"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$2), {
        open: unref(showModal),
        "onUpdate:open": ($event) => showModal.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$n), { class: "sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$1$3), { class: "p-6 pb-0" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$o), { class: "text-2xl font-bold" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(isEditing) ? "Edit Listing" : "Create Listing")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(isEditing) ? "Edit Listing" : "Create Listing"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$2$2), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(` Update the property details and specifications below. `);
                            } else {
                              return [
                                createTextVNode(" Update the property details and specifications below. ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$o), { class: "text-2xl font-bold" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(isEditing) ? "Edit Listing" : "Create Listing"), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$2$2), null, {
                            default: withCtx(() => [
                              createTextVNode(" Update the property details and specifications below. ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="px-6 py-4 space-y-4 overflow-y-auto"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_AtomsPropertyForm, {
                    modelValue: unref(formData),
                    "onUpdate:modelValue": ($event) => isRef(formData) ? formData.value = $event : null,
                    "author-display": getAuthorDisplay()
                  }, null, _parent3, _scopeId2));
                  _push3(`<div class="space-y-2 pb-6"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$p), {
                    for: "keywords",
                    class: "text-sm font-medium"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Keywords (SEO)`);
                      } else {
                        return [
                          createTextVNode("Keywords (SEO)")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$1$4), {
                    id: "keywords",
                    modelValue: unref(formData).keywords,
                    "onUpdate:modelValue": ($event) => unref(formData).keywords = $event,
                    placeholder: "ocean view, luxury, beachfront..."
                  }, null, _parent3, _scopeId2));
                  _push3(`<p class="text-[10px] text-muted-foreground italic"${_scopeId2}> AI will generate these if left empty. </p></div></div><div class="p-6 border-t bg-muted/20 flex justify-end gap-3"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$k), {
                    variant: "outline",
                    onClick: ($event) => showModal.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Cancel`);
                      } else {
                        return [
                          createTextVNode("Cancel")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$k), {
                    disabled: unref(saving),
                    onClick: saveProperty
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (!unref(saving)) {
                          _push4(ssrRenderComponent(unref(Save), { class: "w-4 h-4 mr-2" }, null, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(` ${ssrInterpolate(unref(saving) ? "Processing..." : "Save Property")}`);
                      } else {
                        return [
                          !unref(saving) ? (openBlock(), createBlock(unref(Save), {
                            key: 0,
                            class: "w-4 h-4 mr-2"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(unref(saving) ? "Processing..." : "Save Property"), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$1$3), { class: "p-6 pb-0" }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$o), { class: "text-2xl font-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(isEditing) ? "Edit Listing" : "Create Listing"), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$2$2), null, {
                          default: withCtx(() => [
                            createTextVNode(" Update the property details and specifications below. ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "px-6 py-4 space-y-4 overflow-y-auto" }, [
                      createVNode(_component_AtomsPropertyForm, {
                        modelValue: unref(formData),
                        "onUpdate:modelValue": ($event) => isRef(formData) ? formData.value = $event : null,
                        "author-display": getAuthorDisplay()
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "author-display"]),
                      createVNode("div", { class: "space-y-2 pb-6" }, [
                        createVNode(unref(_sfc_main$p), {
                          for: "keywords",
                          class: "text-sm font-medium"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("Keywords (SEO)")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$1$4), {
                          id: "keywords",
                          modelValue: unref(formData).keywords,
                          "onUpdate:modelValue": ($event) => unref(formData).keywords = $event,
                          placeholder: "ocean view, luxury, beachfront..."
                        }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                        createVNode("p", { class: "text-[10px] text-muted-foreground italic" }, " AI will generate these if left empty. ")
                      ])
                    ]),
                    createVNode("div", { class: "p-6 border-t bg-muted/20 flex justify-end gap-3" }, [
                      createVNode(unref(_sfc_main$k), {
                        variant: "outline",
                        onClick: ($event) => showModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(unref(_sfc_main$k), {
                        disabled: unref(saving),
                        onClick: saveProperty
                      }, {
                        default: withCtx(() => [
                          !unref(saving) ? (openBlock(), createBlock(unref(Save), {
                            key: 0,
                            class: "w-4 h-4 mr-2"
                          })) : createCommentVNode("", true),
                          createTextVNode(" " + toDisplayString(unref(saving) ? "Processing..." : "Save Property"), 1)
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$n), { class: "sm:max-w-[800px] h-[90vh] flex flex-col p-0 overflow-hidden" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$1$3), { class: "p-6 pb-0" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$o), { class: "text-2xl font-bold" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(isEditing) ? "Edit Listing" : "Create Listing"), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2$2), null, {
                        default: withCtx(() => [
                          createTextVNode(" Update the property details and specifications below. ")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "px-6 py-4 space-y-4 overflow-y-auto" }, [
                    createVNode(_component_AtomsPropertyForm, {
                      modelValue: unref(formData),
                      "onUpdate:modelValue": ($event) => isRef(formData) ? formData.value = $event : null,
                      "author-display": getAuthorDisplay()
                    }, null, 8, ["modelValue", "onUpdate:modelValue", "author-display"]),
                    createVNode("div", { class: "space-y-2 pb-6" }, [
                      createVNode(unref(_sfc_main$p), {
                        for: "keywords",
                        class: "text-sm font-medium"
                      }, {
                        default: withCtx(() => [
                          createTextVNode("Keywords (SEO)")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$1$4), {
                        id: "keywords",
                        modelValue: unref(formData).keywords,
                        "onUpdate:modelValue": ($event) => unref(formData).keywords = $event,
                        placeholder: "ocean view, luxury, beachfront..."
                      }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                      createVNode("p", { class: "text-[10px] text-muted-foreground italic" }, " AI will generate these if left empty. ")
                    ])
                  ]),
                  createVNode("div", { class: "p-6 border-t bg-muted/20 flex justify-end gap-3" }, [
                    createVNode(unref(_sfc_main$k), {
                      variant: "outline",
                      onClick: ($event) => showModal.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode("Cancel")
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(unref(_sfc_main$k), {
                      disabled: unref(saving),
                      onClick: saveProperty
                    }, {
                      default: withCtx(() => [
                        !unref(saving) ? (openBlock(), createBlock(unref(Save), {
                          key: 0,
                          class: "w-4 h-4 mr-2"
                        })) : createCommentVNode("", true),
                        createTextVNode(" " + toDisplayString(unref(saving) ? "Processing..." : "Save Property"), 1)
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        open: unref(showDeleteModal),
        "onUpdate:open": ($event) => showDeleteModal.value = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$8), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$4), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Delete Property Listing?`);
                            } else {
                              return [
                                createTextVNode("Delete Property Listing?")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$7), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b;
                            if (_push5) {
                              _push5(` Are you sure you want to delete <span class="font-bold text-foreground"${_scopeId4}> &quot;${ssrInterpolate((_a = unref(propertyToDelete)) == null ? void 0 : _a.title)}&quot; </span>? `);
                            } else {
                              return [
                                createTextVNode(" Are you sure you want to delete "),
                                createVNode("span", { class: "font-bold text-foreground" }, ' "' + toDisplayString((_b = unref(propertyToDelete)) == null ? void 0 : _b.title) + '" ', 1),
                                createTextVNode("? ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$4), null, {
                            default: withCtx(() => [
                              createTextVNode("Delete Property Listing?")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$7), null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                createTextVNode(" Are you sure you want to delete "),
                                createVNode("span", { class: "font-bold text-foreground" }, ' "' + toDisplayString((_a = unref(propertyToDelete)) == null ? void 0 : _a.title) + '" ', 1),
                                createTextVNode("? ")
                              ];
                            }),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$6), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$9), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$a), {
                          onClick: deleteProperty,
                          class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(deleting) ? "Deleting..." : "Delete Listing")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(deleting) ? "Deleting..." : "Delete Listing"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$9), null, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$a), {
                            onClick: deleteProperty,
                            class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(deleting) ? "Deleting..." : "Delete Listing"), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$4), null, {
                          default: withCtx(() => [
                            createTextVNode("Delete Property Listing?")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), null, {
                          default: withCtx(() => {
                            var _a;
                            return [
                              createTextVNode(" Are you sure you want to delete "),
                              createVNode("span", { class: "font-bold text-foreground" }, ' "' + toDisplayString((_a = unref(propertyToDelete)) == null ? void 0 : _a.title) + '" ', 1),
                              createTextVNode("? ")
                            ];
                          }),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$6), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), null, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$a), {
                          onClick: deleteProperty,
                          class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(deleting) ? "Deleting..." : "Delete Listing"), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$8), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$4), null, {
                        default: withCtx(() => [
                          createTextVNode("Delete Property Listing?")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => {
                          var _a;
                          return [
                            createTextVNode(" Are you sure you want to delete "),
                            createVNode("span", { class: "font-bold text-foreground" }, ' "' + toDisplayString((_a = unref(propertyToDelete)) == null ? void 0 : _a.title) + '" ', 1),
                            createTextVNode("? ")
                          ];
                        }),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(_sfc_main$6), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$9), null, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$a), {
                        onClick: deleteProperty,
                        class: "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(deleting) ? "Deleting..." : "Delete Listing"), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/real-estate/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Czt8w87g.mjs.map
