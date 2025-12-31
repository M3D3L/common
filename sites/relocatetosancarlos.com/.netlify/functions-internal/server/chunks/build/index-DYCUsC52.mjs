import { c as createSeoObject, _ as _sfc_main$2 } from './useSeo-8eJjrpUV.mjs';
import { _ as _sfc_main$3 } from './SectionTitle-BDfWxJKH.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, computed, withAsyncContext, watch, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _sfc_main$8 } from './index-imKBogpg.mjs';
import { _ as _sfc_main$9 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$7 } from './Card-BcNzGmRo.mjs';
import { MapPin, Bed, Bath, Square } from 'lucide-vue-next';
import { a as usePocketBaseCore, c as useRoute, b as useRuntimeConfig } from './server.mjs';
import { _ as _sfc_main$4 } from './PropertyCard-BwcRjl5g.mjs';
import { _ as _sfc_main$5 } from './Pagination-XsHAzqkr.mjs';
import { _ as _sfc_main$6 } from './InfoCard-ZpyzUNO7.mjs';
import { d as categories } from './layout-CjWJD1bx.mjs';
import { u as useAsyncData } from './asyncData-lKiuBvcZ.mjs';
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
import './CardContent-BeoP9VPq.mjs';
import './CardTitle-C2-Lmbuw.mjs';
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FeaturedProperty",
  __ssrInlineRender: true,
  props: {
    content: {},
    buttonText: {}
  },
  setup(__props) {
    const config = useRuntimeConfig();
    const props = __props;
    const createImgUrl = (content) => {
      if (!(content == null ? void 0 : content.cover_image)) return "";
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
      return props.content.pricingType ? `${price} ${props.content.pricingType}` : price;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      if (_ctx.content) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative w-full" }, _attrs))}>`);
        _push(ssrRenderComponent(unref(_sfc_main$7), { class: "lg:grid flex flex-col-reverse border items-stretch overflow-hidden gap-0 lg:grid-cols-2 min-h-[500px]" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16"${_scopeId}><div class="flex items-center gap-2 mb-4"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(_sfc_main$8), {
                variant: "default",
                class: "px-3 py-1 text-xs uppercase tracking-wider"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Featured Listing `);
                  } else {
                    return [
                      createTextVNode(" Featured Listing ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(_sfc_main$8), {
                variant: "outline",
                class: "px-3 py-1 text-xs uppercase tracking-wider"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(_ctx.content.pricingType === "per/night" ? "Rental" : "For Sale")}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(_ctx.content.pricingType === "per/night" ? "Rental" : "For Sale"), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              _push2(ssrRenderComponent(_component_nuxt_link, {
                to: `/real-estate${_ctx.content.slug}`,
                class: "hover:text-primary transition-all hover:underline",
                alt: `View ${_ctx.content.title} Details`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<h2 class="text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-4"${_scopeId2}>${ssrInterpolate(_ctx.content.title)}</h2>`);
                  } else {
                    return [
                      createVNode("h2", { class: "text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-4" }, toDisplayString(_ctx.content.title), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`<div class="flex items-center gap-2 mb-6 text-muted-foreground"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(MapPin), {
                size: 18,
                class: "text-primary"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-lg"${_scopeId}>${ssrInterpolate(_ctx.content.address)}</span></div><p class="text-lg leading-relaxed text-muted-foreground mb-8 line-clamp-3"${_scopeId}>${ssrInterpolate(_ctx.content.description)}</p><div class="grid grid-cols-3 gap-4 py-6 mb-8 border-y border-border/60"${_scopeId}><div class="flex flex-col items-center lg:items-start"${_scopeId}><div class="flex items-center gap-2 text-primary mb-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Bed), { size: 20 }, null, _parent2, _scopeId));
              _push2(`<span class="font-bold text-xl text-foreground"${_scopeId}>${ssrInterpolate(_ctx.content.bedrooms)}</span></div><span class="text-xs uppercase text-muted-foreground font-semibold"${_scopeId}>Bedrooms</span></div><div class="flex flex-col items-center lg:items-start border-x border-border/60 px-4"${_scopeId}><div class="flex items-center gap-2 text-primary mb-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Bath), { size: 20 }, null, _parent2, _scopeId));
              _push2(`<span class="font-bold text-xl text-foreground"${_scopeId}>${ssrInterpolate(_ctx.content.bathrooms)}</span></div><span class="text-xs uppercase text-muted-foreground font-semibold"${_scopeId}>Bathrooms</span></div><div class="flex flex-col items-center lg:items-start"${_scopeId}><div class="flex items-center gap-2 text-primary mb-1"${_scopeId}>`);
              _push2(ssrRenderComponent(unref(Square), { size: 20 }, null, _parent2, _scopeId));
              _push2(`<span class="font-bold text-xl text-foreground"${_scopeId}>${ssrInterpolate(_ctx.content.area || "--")}</span></div><span class="text-xs uppercase text-muted-foreground font-semibold"${_scopeId}>m\xB2 Area</span></div></div><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-6"${_scopeId}><div${_scopeId}><p class="text-sm text-muted-foreground font-medium mb-1"${_scopeId}>Price</p><div class="text-3xl font-bold text-primary"${_scopeId}>${ssrInterpolate(unref(formattedPrice))}</div></div>`);
              _push2(ssrRenderComponent(_component_nuxt_link, {
                to: `/real-estate${_ctx.content.slug}`,
                class: "shrink-0",
                alt: `View ${_ctx.content.title} Details`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$9), {
                      size: "lg",
                      class: "px-8 text-md font-bold md:w-auto w-full h-14 shadow-lg hover:shadow-primary/20 transition-all"
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(_ctx.buttonText || "View Full Details")}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(_ctx.buttonText || "View Full Details"), 1)
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$9), {
                        size: "lg",
                        class: "px-8 text-md font-bold md:w-auto w-full h-14 shadow-lg hover:shadow-primary/20 transition-all"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(_ctx.buttonText || "View Full Details"), 1)
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div></div>`);
              _push2(ssrRenderComponent(_component_nuxt_link, {
                to: `/real-estate${_ctx.content.slug}`,
                alt: `View ${_ctx.content.title} Details`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="relative min-h-[350px] lg:min-h-full overflow-hidden"${_scopeId2}><img${ssrRenderAttr("src", createImgUrl(_ctx.content))}${ssrRenderAttr("alt", _ctx.content.title)} class="absolute inset-0 object-cover w-full h-full transition-transform hover:scale-105"${_scopeId2}></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "relative min-h-[350px] lg:min-h-full overflow-hidden" }, [
                        createVNode("img", {
                          src: createImgUrl(_ctx.content),
                          alt: _ctx.content.title,
                          class: "absolute inset-0 object-cover w-full h-full transition-transform hover:scale-105"
                        }, null, 8, ["src", "alt"])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode("div", { class: "flex flex-col justify-center px-6 py-10 lg:px-12 lg:py-16" }, [
                  createVNode("div", { class: "flex items-center gap-2 mb-4" }, [
                    createVNode(unref(_sfc_main$8), {
                      variant: "default",
                      class: "px-3 py-1 text-xs uppercase tracking-wider"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Featured Listing ")
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$8), {
                      variant: "outline",
                      class: "px-3 py-1 text-xs uppercase tracking-wider"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(_ctx.content.pricingType === "per/night" ? "Rental" : "For Sale"), 1)
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_component_nuxt_link, {
                    to: `/real-estate${_ctx.content.slug}`,
                    class: "hover:text-primary transition-all hover:underline",
                    alt: `View ${_ctx.content.title} Details`
                  }, {
                    default: withCtx(() => [
                      createVNode("h2", { class: "text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl mb-4" }, toDisplayString(_ctx.content.title), 1)
                    ]),
                    _: 1
                  }, 8, ["to", "alt"]),
                  createVNode("div", { class: "flex items-center gap-2 mb-6 text-muted-foreground" }, [
                    createVNode(unref(MapPin), {
                      size: 18,
                      class: "text-primary"
                    }),
                    createVNode("span", { class: "text-lg" }, toDisplayString(_ctx.content.address), 1)
                  ]),
                  createVNode("p", { class: "text-lg leading-relaxed text-muted-foreground mb-8 line-clamp-3" }, toDisplayString(_ctx.content.description), 1),
                  createVNode("div", { class: "grid grid-cols-3 gap-4 py-6 mb-8 border-y border-border/60" }, [
                    createVNode("div", { class: "flex flex-col items-center lg:items-start" }, [
                      createVNode("div", { class: "flex items-center gap-2 text-primary mb-1" }, [
                        createVNode(unref(Bed), { size: 20 }),
                        createVNode("span", { class: "font-bold text-xl text-foreground" }, toDisplayString(_ctx.content.bedrooms), 1)
                      ]),
                      createVNode("span", { class: "text-xs uppercase text-muted-foreground font-semibold" }, "Bedrooms")
                    ]),
                    createVNode("div", { class: "flex flex-col items-center lg:items-start border-x border-border/60 px-4" }, [
                      createVNode("div", { class: "flex items-center gap-2 text-primary mb-1" }, [
                        createVNode(unref(Bath), { size: 20 }),
                        createVNode("span", { class: "font-bold text-xl text-foreground" }, toDisplayString(_ctx.content.bathrooms), 1)
                      ]),
                      createVNode("span", { class: "text-xs uppercase text-muted-foreground font-semibold" }, "Bathrooms")
                    ]),
                    createVNode("div", { class: "flex flex-col items-center lg:items-start" }, [
                      createVNode("div", { class: "flex items-center gap-2 text-primary mb-1" }, [
                        createVNode(unref(Square), { size: 20 }),
                        createVNode("span", { class: "font-bold text-xl text-foreground" }, toDisplayString(_ctx.content.area || "--"), 1)
                      ]),
                      createVNode("span", { class: "text-xs uppercase text-muted-foreground font-semibold" }, "m\xB2 Area")
                    ])
                  ]),
                  createVNode("div", { class: "flex flex-col sm:flex-row sm:items-center justify-between gap-6" }, [
                    createVNode("div", null, [
                      createVNode("p", { class: "text-sm text-muted-foreground font-medium mb-1" }, "Price"),
                      createVNode("div", { class: "text-3xl font-bold text-primary" }, toDisplayString(unref(formattedPrice)), 1)
                    ]),
                    createVNode(_component_nuxt_link, {
                      to: `/real-estate${_ctx.content.slug}`,
                      class: "shrink-0",
                      alt: `View ${_ctx.content.title} Details`
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$9), {
                          size: "lg",
                          class: "px-8 text-md font-bold md:w-auto w-full h-14 shadow-lg hover:shadow-primary/20 transition-all"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(_ctx.buttonText || "View Full Details"), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }, 8, ["to", "alt"])
                  ])
                ]),
                createVNode(_component_nuxt_link, {
                  to: `/real-estate${_ctx.content.slug}`,
                  alt: `View ${_ctx.content.title} Details`
                }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "relative min-h-[350px] lg:min-h-full overflow-hidden" }, [
                      createVNode("img", {
                        src: createImgUrl(_ctx.content),
                        alt: _ctx.content.title,
                        class: "absolute inset-0 object-cover w-full h-full transition-transform hover:scale-105"
                      }, null, 8, ["src", "alt"])
                    ])
                  ]),
                  _: 1
                }, 8, ["to", "alt"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/molecules/FeaturedProperty.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const perPage = 10;
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { fetchCollection } = usePocketBaseCore();
    const config = useRuntimeConfig();
    const route = useRoute();
    const page = computed(() => Number(route.query.page) || 1);
    const type = computed(() => {
      var _a;
      return (_a = route.params) == null ? void 0 : _a.type;
    });
    const typeMap = {
      properties: { index: 0, query: "property" },
      rentals: { index: 1, query: "rental" },
      lots: { index: 2, query: "lot" }
    };
    const currentCategory = computed(() => {
      if (typeMap[type.value]) {
        return categories[typeMap[type.value].index];
      }
      return null;
    });
    const {
      data: propertyData,
      pending,
      refresh
    } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `properties-split-${type.value}-${page.value}`,
      async () => {
        if (!typeMap[type.value]) return null;
        const { query } = typeMap[type.value];
        const featuredRes = await fetchCollection(
          "properties",
          1,
          1,
          `type="${query}" && featured=true`,
          "-created"
        );
        const standardRes = await fetchCollection(
          "properties",
          page.value,
          perPage,
          `type="${query}" && featured=false`,
          "-created"
        );
        return {
          featured: featuredRes.items[0] || null,
          standard: standardRes
        };
      }
    )), __temp = await __temp, __restore(), __temp);
    watch(
      propertyData,
      (newData) => {
        if (currentCategory.value && newData) {
          currentCategory.value.properties = newData.standard;
          currentCategory.value.featuredProperty = newData.featured;
        }
      },
      { immediate: true }
    );
    watch([type.value, page], () => {
      refresh();
    });
    const computedSeoData = computed(
      () => {
        var _a, _b, _c, _d;
        return createSeoObject({
          title: ((_a = currentCategory.value) == null ? void 0 : _a.title) || "",
          summary: ((_b = currentCategory.value) == null ? void 0 : _b.subTitle) || "",
          keywords: ((_c = currentCategory.value) == null ? void 0 : _c.keywords) || [],
          jsonLd: {
            "@type": "WebSite",
            url: config.public.siteUrl,
            name: (_d = currentCategory.value) == null ? void 0 : _d.title
          }
        });
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const _component_SeoMeta = _sfc_main$2;
      const _component_TextSectionTitle = _sfc_main$3;
      const _component_MoleculesFeaturedProperty = _sfc_main$1;
      const _component_CardsPropertyCard = _sfc_main$4;
      const _component_Pagination = _sfc_main$5;
      const _component_CardsInfoCard = _sfc_main$6;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
      _push(`<ul class="container pb-32 space-y-32">`);
      if (!unref(pending) && !((_a = unref(currentCategory)) == null ? void 0 : _a.featuredProperty) && ((_d = (_c = (_b = unref(currentCategory)) == null ? void 0 : _b.properties) == null ? void 0 : _c.items) == null ? void 0 : _d.length) === 0) {
        _push(`<li><p class="w-full h-[80vh] grid content-center text-center text-muted-foreground italic"> No results available right now. Please check back soon. </p></li>`);
      } else {
        _push(`<li>`);
        _push(ssrRenderComponent(_component_TextSectionTitle, {
          class: "pt-12 pb-6",
          title: (_e = unref(currentCategory)) == null ? void 0 : _e.title,
          description: (_f = unref(currentCategory)) == null ? void 0 : _f.sectionSubTitle,
          h1: true
        }, null, _parent));
        if ((_g = unref(currentCategory)) == null ? void 0 : _g.featuredProperty) {
          _push(ssrRenderComponent(_component_MoleculesFeaturedProperty, {
            content: unref(currentCategory).featuredProperty,
            class: "mb-6"
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col gap-6 lg:flex-row"><div class="grid content-center w-full gap-6 md:grid-cols-2 lg:w-2/3"><!--[-->`);
        ssrRenderList((_i = (_h = unref(currentCategory)) == null ? void 0 : _h.properties) == null ? void 0 : _i.items, (item, itemIndex) => {
          _push(ssrRenderComponent(_component_CardsPropertyCard, {
            key: item.id || `property-${itemIndex}`,
            content: item
          }, null, _parent));
        });
        _push(`<!--]-->`);
        if (((_k = (_j = unref(currentCategory)) == null ? void 0 : _j.properties) == null ? void 0 : _k.totalPages) > 1) {
          _push(`<div class="flex justify-center w-full mt-8 md:col-span-2">`);
          _push(ssrRenderComponent(_component_Pagination, {
            showPagination: true,
            "total-pages": (_m = (_l = unref(currentCategory)) == null ? void 0 : _l.properties) == null ? void 0 : _m.totalPages
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="w-full lg:w-1/3">`);
        if (unref(currentCategory)) {
          _push(ssrRenderComponent(_component_CardsInfoCard, {
            title: unref(currentCategory).sectionTitle,
            footerText: unref(currentCategory).footerText,
            subTitle: unref(currentCategory).subTitle,
            sectionTitle: unref(currentCategory).sectionTitle,
            benefits: unref(currentCategory).benefits,
            categories: unref(currentCategory).categories,
            dataArray: (_o = (_n = unref(currentCategory)) == null ? void 0 : _n.properties) == null ? void 0 : _o.items,
            class: "z-10 sticky-position top-28",
            mode: unref(currentCategory).mode
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></li>`);
      }
      _push(`</ul></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/real-estate/[type]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DYCUsC52.mjs.map
