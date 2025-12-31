import { _ as __nuxt_component_2 } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, resolveDynamicComponent, createBlock, openBlock, toDisplayString, renderSlot, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrRenderList, ssrRenderVNode, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { Printer, X, Facebook, Linkedin, MessageCircle, Mail, Check, Link } from 'lucide-vue-next';
import { _ as _sfc_main$5 } from './index-CnW7QFU2.mjs';
import { useForwardPropsEmits, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from 'reka-ui';
import { c as cn } from './Card-BcNzGmRo.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Tooltip",
  __ssrInlineRender: true,
  props: {
    defaultOpen: { type: Boolean },
    open: { type: Boolean },
    delayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  emits: ["update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipRoot), mergeProps(unref(forwarded), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/tooltip/Tooltip.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "TooltipContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    ariaLabel: {},
    asChild: { type: Boolean },
    as: {},
    side: {},
    sideOffset: { default: 4 },
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    positionStrategy: {},
    updatePositionStrategy: {},
    class: {}
  },
  emits: ["escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(TooltipContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
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
              createVNode(unref(TooltipContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2", props.class)
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/tooltip/TooltipContent.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TooltipProvider",
  __ssrInlineRender: true,
  props: {
    delayDuration: {},
    skipDelayDuration: {},
    disableHoverableContent: { type: Boolean },
    disableClosingTrigger: { type: Boolean },
    disabled: { type: Boolean },
    ignoreNonKeyboardFocus: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_client_only = __nuxt_component_2;
      _push(ssrRenderComponent(_component_client_only, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/tooltip/TooltipProvider.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "TooltipTrigger",
  __ssrInlineRender: true,
  props: {
    reference: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(TooltipTrigger), mergeProps(props, _attrs), {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/tooltip/TooltipTrigger.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShareTools",
  __ssrInlineRender: true,
  props: {
    title: { type: String, required: true },
    description: { type: String, default: "" }
  },
  setup(__props) {
    const props = __props;
    const copied = ref(false);
    const currentPath = ref("");
    const sharePlatforms = [
      { id: "twitter", name: "X", icon: X },
      { id: "facebook", name: "Facebook", icon: Facebook },
      { id: "linkedin", name: "LinkedIn", icon: Linkedin },
      { id: "whatsapp", name: "WhatsApp", icon: MessageCircle }
    ];
    const printPage = () => {
    };
    const share = (platform) => {
      const url = encodeURIComponent(currentPath.value);
      const title = encodeURIComponent(props.title);
      const text = encodeURIComponent(`Check out this: ${props.title}`);
      let shareUrl = "";
      switch (platform) {
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
          break;
        case "facebook":
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case "linkedin":
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case "whatsapp":
          shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
          break;
        case "email":
          shareUrl = `mailto:?subject=${title}&body=${text}%0A%0A${url}`;
          break;
        default:
          return;
      }
      if (platform === "email") {
        (void 0).location.href = shareUrl;
      } else {
        (void 0).open(shareUrl, "_blank", "noopener,noreferrer");
      }
    };
    const copyLink = async () => {
      try {
        await (void 0).clipboard.writeText(currentPath.value);
        copied.value = true;
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-2 print:hidden" }, _attrs))} data-v-129fcde8>`);
      _push(ssrRenderComponent(unref(_sfc_main$4), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Print article",
                    onClick: printPage
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Printer), { class: "w-5 h-5" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Printer), { class: "w-5 h-5" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "icon",
                      class: "hover:bg-accent/50",
                      "aria-label": "Print article",
                      onClick: printPage
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Printer), { class: "w-5 h-5" })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p data-v-129fcde8${_scopeId2}>Print</p>`);
                } else {
                  return [
                    createVNode("p", null, "Print")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Print article",
                    onClick: printPage
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Printer), { class: "w-5 h-5" })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), null, {
                default: withCtx(() => [
                  createVNode("p", null, "Print")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<!--[-->`);
      ssrRenderList(sharePlatforms, (platform) => {
        _push(ssrRenderComponent(unref(_sfc_main$4), {
          key: platform.id
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "icon",
                      class: "hover:bg-accent/50",
                      "aria-label": `Share on ${platform.name}`,
                      onClick: ($event) => share(platform.id)
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(platform.icon), { class: "w-5 h-5" }, null), _parent4, _scopeId3);
                        } else {
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(platform.icon), { class: "w-5 h-5" }))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$5), {
                        variant: "ghost",
                        size: "icon",
                        class: "hover:bg-accent/50",
                        "aria-label": `Share on ${platform.name}`,
                        onClick: ($event) => share(platform.id)
                      }, {
                        default: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(platform.icon), { class: "w-5 h-5" }))
                        ]),
                        _: 2
                      }, 1032, ["aria-label", "onClick"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<p data-v-129fcde8${_scopeId2}>Share on ${ssrInterpolate(platform.name)}</p>`);
                  } else {
                    return [
                      createVNode("p", null, "Share on " + toDisplayString(platform.name), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "icon",
                      class: "hover:bg-accent/50",
                      "aria-label": `Share on ${platform.name}`,
                      onClick: ($event) => share(platform.id)
                    }, {
                      default: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(platform.icon), { class: "w-5 h-5" }))
                      ]),
                      _: 2
                    }, 1032, ["aria-label", "onClick"])
                  ]),
                  _: 2
                }, 1024),
                createVNode(unref(_sfc_main$3), null, {
                  default: withCtx(() => [
                    createVNode("p", null, "Share on " + toDisplayString(platform.name), 1)
                  ]),
                  _: 2
                }, 1024)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]-->`);
      _push(ssrRenderComponent(unref(_sfc_main$4), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Share via Email",
                    onClick: ($event) => share("email")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Mail), { class: "w-5 h-5" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Mail), { class: "w-5 h-5" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "icon",
                      class: "hover:bg-accent/50",
                      "aria-label": "Share via Email",
                      onClick: ($event) => share("email")
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Mail), { class: "w-5 h-5" })
                      ]),
                      _: 1
                    }, 8, ["onClick"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p data-v-129fcde8${_scopeId2}>Share via Email</p>`);
                } else {
                  return [
                    createVNode("p", null, "Share via Email")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Share via Email",
                    onClick: ($event) => share("email")
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Mail), { class: "w-5 h-5" })
                    ]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), null, {
                default: withCtx(() => [
                  createVNode("p", null, "Share via Email")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$4), null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Copy link",
                    onClick: copyLink
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(copied)) {
                          _push4(ssrRenderComponent(unref(Check), { class: "w-5 h-5 text-green-600" }, null, _parent4, _scopeId3));
                        } else {
                          _push4(ssrRenderComponent(unref(Link), { class: "w-5 h-5" }, null, _parent4, _scopeId3));
                        }
                      } else {
                        return [
                          unref(copied) ? (openBlock(), createBlock(unref(Check), {
                            key: 0,
                            class: "w-5 h-5 text-green-600"
                          })) : (openBlock(), createBlock(unref(Link), {
                            key: 1,
                            class: "w-5 h-5"
                          }))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$5), {
                      variant: "ghost",
                      size: "icon",
                      class: "hover:bg-accent/50",
                      "aria-label": "Copy link",
                      onClick: copyLink
                    }, {
                      default: withCtx(() => [
                        unref(copied) ? (openBlock(), createBlock(unref(Check), {
                          key: 0,
                          class: "w-5 h-5 text-green-600"
                        })) : (openBlock(), createBlock(unref(Link), {
                          key: 1,
                          class: "w-5 h-5"
                        }))
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$3), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p data-v-129fcde8${_scopeId2}>${ssrInterpolate(unref(copied) ? "Link copied!" : "Copy link")}</p>`);
                } else {
                  return [
                    createVNode("p", null, toDisplayString(unref(copied) ? "Link copied!" : "Copy link"), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$5), {
                    variant: "ghost",
                    size: "icon",
                    class: "hover:bg-accent/50",
                    "aria-label": "Copy link",
                    onClick: copyLink
                  }, {
                    default: withCtx(() => [
                      unref(copied) ? (openBlock(), createBlock(unref(Check), {
                        key: 0,
                        class: "w-5 h-5 text-green-600"
                      })) : (openBlock(), createBlock(unref(Link), {
                        key: 1,
                        class: "w-5 h-5"
                      }))
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$3), null, {
                default: withCtx(() => [
                  createVNode("p", null, toDisplayString(unref(copied) ? "Link copied!" : "Copy link"), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/ShareTools.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShareTools = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-129fcde8"]]);

export { ShareTools as S, _sfc_main$2 as _ };
//# sourceMappingURL=ShareTools-BLUPBveq.mjs.map
