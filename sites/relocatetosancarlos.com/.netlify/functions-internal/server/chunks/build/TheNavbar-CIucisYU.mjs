import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, ref, watch, mergeProps, withCtx, createVNode, toDisplayString, unref, createTextVNode, createBlock, createCommentVNode, openBlock, Fragment, renderList, computed, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { c as useRoute, _ as __nuxt_component_2 } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { u as useAuth } from './useAuth-yR7jtp4v.mjs';
import { _ as _sfc_main$4 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$2 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$3 } from './CardContent-BeoP9VPq.mjs';
import { X, Menu } from 'lucide-vue-next';
import { a as useDark } from './index-K7kOdbQk.mjs';

const _sfc_main$1 = {
  __name: "StyledLink",
  __ssrInlineRender: true,
  props: {
    to: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    ariaLabel: {
      type: String,
      default: ""
    },
    hasIcon: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const route = useRoute();
    const isActive = computed(() => {
      return route.path === props.to || route.path.startsWith(props.to + "/");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_NuxtLink, mergeProps({
        to: __props.to,
        "aria-label": __props.ariaLabel || __props.title,
        "aria-current": isActive.value ? "page" : void 0,
        class: "text-xs transition-all text-muted-foreground hover:text-primary hover:translate-x-1 w-fit group relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm",
        "active-class": "font-semibold text-primary",
        role: "link"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span${ssrRenderAttr("aria-hidden", __props.hasIcon ? "true" : "false")} data-v-73069121${_scopeId}>${ssrInterpolate(__props.title)}</span><span class="absolute bottom-0 left-0 w-0 h-px transition-all duration-300 bg-primary group-hover:w-full" aria-hidden="true" data-v-73069121${_scopeId}></span>`);
            if (isActive.value) {
              _push2(`<span class="sr-only" data-v-73069121${_scopeId}> (current page) </span>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("span", {
                "aria-hidden": __props.hasIcon ? "true" : "false"
              }, toDisplayString(__props.title), 9, ["aria-hidden"]),
              createVNode("span", {
                class: "absolute bottom-0 left-0 w-0 h-px transition-all duration-300 bg-primary group-hover:w-full",
                "aria-hidden": "true"
              }),
              isActive.value ? (openBlock(), createBlock("span", {
                key: 0,
                class: "sr-only"
              }, " (current page) ")) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/atoms/StyledLink.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-73069121"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TheNavbar",
  __ssrInlineRender: true,
  props: {
    links: {
      type: Array,
      default: () => []
    },
    siteName: {
      type: String,
      default: ""
    },
    logo: {
      type: String,
      default: ""
    },
    showAuthButtons: {
      type: Boolean,
      default: true
    }
  },
  setup(__props) {
    const auth = useAuth();
    const route = useRoute();
    const isMobileMenuOpen = ref(false);
    ref(false);
    useDark();
    const getLoginHref = () => route.path === "/" ? "/login" : `/login?source=${route.path}`;
    const getRegisterHref = () => route.path === "/" ? "/register" : `/register?source=${route.path}`;
    watch(route, () => {
      isMobileMenuOpen.value = false;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_AtomsStyledLink = __nuxt_component_1;
      const _component_ClientOnly = __nuxt_component_2;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" }, _attrs))}><div class="container relative flex items-center justify-between h-16 mx-auto">`);
      if (__props.logo) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "flex items-center gap-2 transition-opacity hover:opacity-80"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<img${ssrRenderAttr("src", __props.logo)} alt="Logo" class="h-10 md:h-12"${_scopeId}>`);
            } else {
              return [
                createVNode("img", {
                  src: __props.logo,
                  alt: "Logo",
                  class: "h-10 md:h-12"
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "flex items-center transition-colors hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="flex flex-col logo-text"${_scopeId}><span class="text-lg font-bold md:text-xl"${_scopeId}>${ssrInterpolate(__props.siteName)}</span></span>`);
            } else {
              return [
                createVNode("span", { class: "flex flex-col logo-text" }, [
                  createVNode("span", { class: "text-lg font-bold md:text-xl" }, toDisplayString(__props.siteName), 1)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="flex items-center gap-2 md:gap-4"><nav class="items-center pl-4 gap-4 hidden justify-between w-full md:flex"><!--[-->`);
      ssrRenderList(__props.links, (link, linkIndex) => {
        _push(ssrRenderComponent(_component_AtomsStyledLink, {
          key: linkIndex,
          to: link.href,
          title: link.label
        }, null, _parent));
      });
      _push(`<!--]-->`);
      ssrRenderSlot(_ctx.$slots, "extra-links", {}, null, _push, _parent);
      _push(ssrRenderComponent(_component_ClientOnly, null, {
        fallback: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-20 h-8 animate-pulse bg-muted rounded-md"${_scopeId}></div>`);
          } else {
            return [
              createVNode("div", { class: "w-20 h-8 animate-pulse bg-muted rounded-md" })
            ];
          }
        })
      }, _parent));
      _push(`</nav>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`<button class="p-2.5 transition-all rounded-lg hover:bg-accent/50 md:hidden hover:scale-110 active:scale-95" aria-label="Toggle menu">`);
      if (unref(isMobileMenuOpen)) {
        _push(ssrRenderComponent(unref(X), { class: "w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-90" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Menu), { class: "w-5 h-5 transition-transform duration-200 rotate-0 hover:scale-110" }, null, _parent));
      }
      _push(`</button></div></div>`);
      if (unref(isMobileMenuOpen)) {
        _push(ssrRenderComponent(unref(_sfc_main$2), { class: "absolute w-full md:hidden !rounded-t-none" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$3), { class: "container flex flex-col gap-1 px-4 py-4" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<!--[-->`);
                    ssrRenderList(__props.links, (link) => {
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        key: link.href,
                        to: link.href,
                        class: "px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:translate-x-1 active:scale-95",
                        "active-class": "font-semibold text-primary bg-accent/30",
                        onClick: ($event) => isMobileMenuOpen.value = false
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`${ssrInterpolate(link.label)}`);
                          } else {
                            return [
                              createTextVNode(toDisplayString(link.label), 1)
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                    });
                    _push3(`<!--]-->`);
                    if (__props.showAuthButtons) {
                      _push3(`<div class="h-px my-2 bg-border/40"${_scopeId2}></div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(ssrRenderComponent(_component_ClientOnly, null, {}, _parent3, _scopeId2));
                  } else {
                    return [
                      (openBlock(true), createBlock(Fragment, null, renderList(__props.links, (link) => {
                        return openBlock(), createBlock(_component_NuxtLink, {
                          key: link.href,
                          to: link.href,
                          class: "px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:translate-x-1 active:scale-95",
                          "active-class": "font-semibold text-primary bg-accent/30",
                          onClick: ($event) => isMobileMenuOpen.value = false
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(link.label), 1)
                          ]),
                          _: 2
                        }, 1032, ["to", "onClick"]);
                      }), 128)),
                      __props.showAuthButtons ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: "h-px my-2 bg-border/40"
                      })) : createCommentVNode("", true),
                      createVNode(_component_ClientOnly, null, {
                        default: withCtx(() => [
                          __props.showAuthButtons ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            !unref(auth).isAuthenticated.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createVNode(_component_NuxtLink, {
                                to: getLoginHref(),
                                class: "px-4 py-3 text-sm font-medium",
                                onClick: ($event) => isMobileMenuOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Login")
                                ]),
                                _: 1
                              }, 8, ["to", "onClick"]),
                              createVNode(_component_NuxtLink, {
                                to: getRegisterHref(),
                                class: "px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground text-center rounded-lg",
                                onClick: ($event) => isMobileMenuOpen.value = false
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Register")
                                ]),
                                _: 1
                              }, 8, ["to", "onClick"])
                            ], 64)) : (openBlock(), createBlock(unref(_sfc_main$4), {
                              key: 1,
                              class: "w-full",
                              onClick: () => {
                                unref(auth).logout();
                                isMobileMenuOpen.value = false;
                              },
                              variant: "default",
                              size: "sm"
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Logout")
                              ]),
                              _: 1
                            }, 8, ["onClick"]))
                          ], 64)) : createCommentVNode("", true)
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
                createVNode(unref(_sfc_main$3), { class: "container flex flex-col gap-1 px-4 py-4" }, {
                  default: withCtx(() => [
                    (openBlock(true), createBlock(Fragment, null, renderList(__props.links, (link) => {
                      return openBlock(), createBlock(_component_NuxtLink, {
                        key: link.href,
                        to: link.href,
                        class: "px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:translate-x-1 active:scale-95",
                        "active-class": "font-semibold text-primary bg-accent/30",
                        onClick: ($event) => isMobileMenuOpen.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(link.label), 1)
                        ]),
                        _: 2
                      }, 1032, ["to", "onClick"]);
                    }), 128)),
                    __props.showAuthButtons ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "h-px my-2 bg-border/40"
                    })) : createCommentVNode("", true),
                    createVNode(_component_ClientOnly, null, {
                      default: withCtx(() => [
                        __props.showAuthButtons ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          !unref(auth).isAuthenticated.value ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createVNode(_component_NuxtLink, {
                              to: getLoginHref(),
                              class: "px-4 py-3 text-sm font-medium",
                              onClick: ($event) => isMobileMenuOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Login")
                              ]),
                              _: 1
                            }, 8, ["to", "onClick"]),
                            createVNode(_component_NuxtLink, {
                              to: getRegisterHref(),
                              class: "px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground text-center rounded-lg",
                              onClick: ($event) => isMobileMenuOpen.value = false
                            }, {
                              default: withCtx(() => [
                                createTextVNode("Register")
                              ]),
                              _: 1
                            }, 8, ["to", "onClick"])
                          ], 64)) : (openBlock(), createBlock(unref(_sfc_main$4), {
                            key: 1,
                            class: "w-full",
                            onClick: () => {
                              unref(auth).logout();
                              isMobileMenuOpen.value = false;
                            },
                            variant: "default",
                            size: "sm"
                          }, {
                            default: withCtx(() => [
                              createTextVNode("Logout")
                            ]),
                            _: 1
                          }, 8, ["onClick"]))
                        ], 64)) : createCommentVNode("", true)
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
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/TheNavbar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, __nuxt_component_1 as a };
//# sourceMappingURL=TheNavbar-CIucisYU.mjs.map
