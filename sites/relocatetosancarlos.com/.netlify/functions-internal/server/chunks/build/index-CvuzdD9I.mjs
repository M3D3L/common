import { c as createSeoObject, _ as _sfc_main$2 } from './useSeo-8eJjrpUV.mjs';
import { _ as _sfc_main$4 } from './Socials-Cbbymkzi.mjs';
import { defineComponent, computed, withAsyncContext, mergeProps, unref, withCtx, createVNode, createBlock, createCommentVNode, openBlock, toDisplayString, Fragment, renderList, createTextVNode, ref, watch, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderStyle } from 'vue/server-renderer';
import { c as useRoute, a as usePocketBaseCore, b as useRuntimeConfig } from './server.mjs';
import { u as useAsyncData } from './asyncData-lKiuBvcZ.mjs';
import { Linkedin, Github, MapPin, Bed, Bath, Square, Check, Mail, Phone, X, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { _ as _sfc_main$5 } from './Carousel-CBZY9l1v.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$6 } from './DialogContent--DfaB7PA.mjs';
import { _ as _sfc_main$7 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$3 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$2$1, S as ShareTools } from './ShareTools-BLUPBveq.mjs';
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
import 'pinia';
import 'vue-router';
import 'pocketbase';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'perfect-debounce';
import 'reka-ui';
import './index-C2tg38pJ.mjs';
import 'radix-vue';
import 'class-variance-authority';
import 'clsx';
import 'tailwind-merge';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ModalCarousel",
  __ssrInlineRender: true,
  props: {
    slides: {},
    collectionId: {},
    propertyId: {},
    breakpoints: {}
  },
  setup(__props) {
    const config = useRuntimeConfig();
    const props = __props;
    const isModalOpen = ref(false);
    const selectedImage = ref(null);
    const normalizedSlides = computed(() => {
      if (!props.slides.length) return [];
      const isObjectFormat = typeof props.slides[0] === "object";
      if (isObjectFormat) {
        return props.slides;
      }
      return props.slides.map((filename) => ({
        url: `${config.public.pocketbaseUrl}api/files/${props.collectionId}/${props.propertyId}/${filename}`,
        alt: filename
      }));
    });
    const currentIndex = computed(
      () => normalizedSlides.value.findIndex((s) => {
        var _a;
        return s.url === ((_a = selectedImage.value) == null ? void 0 : _a.url);
      })
    );
    const openModalWithImage = (index) => {
      selectedImage.value = normalizedSlides.value[index];
      isModalOpen.value = true;
    };
    const closeModal = () => {
      isModalOpen.value = false;
    };
    const moveSlider = (direction) => {
      let newIndex = direction === "back" ? currentIndex.value - 1 : currentIndex.value + 1;
      if (newIndex < 0) newIndex = normalizedSlides.value.length - 1;
      if (newIndex >= normalizedSlides.value.length) newIndex = 0;
      selectedImage.value = normalizedSlides.value[newIndex];
    };
    watch(
      () => props.slides,
      (newSlides) => {
        if (newSlides.length && !selectedImage.value) {
          selectedImage.value = normalizedSlides.value[0];
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContainersCarousel = _sfc_main$5;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_ContainersCarousel, {
        breakpoints: _ctx.breakpoints,
        slides: unref(normalizedSlides).map((slide) => slide.url),
        onSelectedEvent: openModalWithImage
      }, null, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$1$1), {
        open: unref(isModalOpen),
        "onUpdate:open": closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$6), { class: "max-w-[100vw] w-full h-[100vh] p-0 border-none bg-black/25 text-white flex flex-col gap-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a, _b, _c, _d, _e, _f;
                if (_push3) {
                  _push3(`<div class="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-50"${_scopeId2}><div${_scopeId2}><h2 class="text-lg font-semibold tracking-tight"${_scopeId2}>${ssrInterpolate(((_a = unref(selectedImage)) == null ? void 0 : _a.alt) || "Property Image")}</h2><p class="text-xs text-gray-400"${_scopeId2}> Image ${ssrInterpolate(unref(currentIndex) + 1)} of ${ssrInterpolate(unref(normalizedSlides).length)}</p></div>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$7), {
                    variant: "ghost",
                    size: "icon",
                    onClick: closeModal,
                    class: "rounded-full hover:bg-white/20 text-white"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(X), { class: "w-6 h-6" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="relative flex-grow flex items-center justify-center p-4 md:p-12 overflow-hidden"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$7), {
                    onClick: ($event) => moveSlider("back"),
                    variant: "ghost",
                    size: "icon",
                    class: "absolute left-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(ChevronLeft), { class: "w-8 h-8" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(ChevronLeft), { class: "w-8 h-8" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<img${ssrRenderAttr("src", (_b = unref(selectedImage)) == null ? void 0 : _b.url)}${ssrRenderAttr("alt", (_c = unref(selectedImage)) == null ? void 0 : _c.alt)} class="max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$7), {
                    onClick: ($event) => moveSlider("forward"),
                    variant: "ghost",
                    size: "icon",
                    class: "absolute right-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(ChevronRight), { class: "w-8 h-8" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(ChevronRight), { class: "w-8 h-8" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="w-full bg-background/10 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between"${_scopeId2}><div class="flex flex-col"${_scopeId2}><span class="text-2xl font-bold text-white leading-none"${_scopeId2}> Viewing Property Gallery </span></div><div class="flex items-center gap-4"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$7), {
                    variant: "outline",
                    class: "hidden border-white/20 hover:bg-white/10 hover:text-white md:flex"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Request Info `);
                      } else {
                        return [
                          createTextVNode(" Request Info ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$7), { class: "bg-primary text-primary-foreground font-bold" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Inquire Now `);
                      } else {
                        return [
                          createTextVNode(" Inquire Now ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-50" }, [
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-lg font-semibold tracking-tight" }, toDisplayString(((_d = unref(selectedImage)) == null ? void 0 : _d.alt) || "Property Image"), 1),
                        createVNode("p", { class: "text-xs text-gray-400" }, " Image " + toDisplayString(unref(currentIndex) + 1) + " of " + toDisplayString(unref(normalizedSlides).length), 1)
                      ]),
                      createVNode(unref(_sfc_main$7), {
                        variant: "ghost",
                        size: "icon",
                        onClick: closeModal,
                        class: "rounded-full hover:bg-white/20 text-white"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "w-6 h-6" })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "relative flex-grow flex items-center justify-center p-4 md:p-12 overflow-hidden" }, [
                      createVNode(unref(_sfc_main$7), {
                        onClick: ($event) => moveSlider("back"),
                        variant: "ghost",
                        size: "icon",
                        class: "absolute left-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ChevronLeft), { class: "w-8 h-8" })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode("img", {
                        src: (_e = unref(selectedImage)) == null ? void 0 : _e.url,
                        alt: (_f = unref(selectedImage)) == null ? void 0 : _f.alt,
                        class: "max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                      }, null, 8, ["src", "alt"]),
                      createVNode(unref(_sfc_main$7), {
                        onClick: ($event) => moveSlider("forward"),
                        variant: "ghost",
                        size: "icon",
                        class: "absolute right-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ChevronRight), { class: "w-8 h-8" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "w-full bg-background/10 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between" }, [
                      createVNode("div", { class: "flex flex-col" }, [
                        createVNode("span", { class: "text-2xl font-bold text-white leading-none" }, " Viewing Property Gallery ")
                      ]),
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode(unref(_sfc_main$7), {
                          variant: "outline",
                          class: "hidden border-white/20 hover:bg-white/10 hover:text-white md:flex"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Request Info ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), { class: "bg-primary text-primary-foreground font-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(" Inquire Now ")
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$6), { class: "max-w-[100vw] w-full h-[100vh] p-0 border-none bg-black/25 text-white flex flex-col gap-0" }, {
                default: withCtx(() => {
                  var _a, _b, _c;
                  return [
                    createVNode("div", { class: "flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 right-0 z-50" }, [
                      createVNode("div", null, [
                        createVNode("h2", { class: "text-lg font-semibold tracking-tight" }, toDisplayString(((_a = unref(selectedImage)) == null ? void 0 : _a.alt) || "Property Image"), 1),
                        createVNode("p", { class: "text-xs text-gray-400" }, " Image " + toDisplayString(unref(currentIndex) + 1) + " of " + toDisplayString(unref(normalizedSlides).length), 1)
                      ]),
                      createVNode(unref(_sfc_main$7), {
                        variant: "ghost",
                        size: "icon",
                        onClick: closeModal,
                        class: "rounded-full hover:bg-white/20 text-white"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(X), { class: "w-6 h-6" })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "relative flex-grow flex items-center justify-center p-4 md:p-12 overflow-hidden" }, [
                      createVNode(unref(_sfc_main$7), {
                        onClick: ($event) => moveSlider("back"),
                        variant: "ghost",
                        size: "icon",
                        class: "absolute left-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ChevronLeft), { class: "w-8 h-8" })
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode("img", {
                        src: (_b = unref(selectedImage)) == null ? void 0 : _b.url,
                        alt: (_c = unref(selectedImage)) == null ? void 0 : _c.alt,
                        class: "max-w-full max-h-full object-contain shadow-2xl animate-in zoom-in-95 duration-300"
                      }, null, 8, ["src", "alt"]),
                      createVNode(unref(_sfc_main$7), {
                        onClick: ($event) => moveSlider("forward"),
                        variant: "ghost",
                        size: "icon",
                        class: "absolute right-4 z-50 h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(ChevronRight), { class: "w-8 h-8" })
                        ]),
                        _: 1
                      }, 8, ["onClick"])
                    ]),
                    createVNode("div", { class: "w-full bg-background/10 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex items-center justify-between" }, [
                      createVNode("div", { class: "flex flex-col" }, [
                        createVNode("span", { class: "text-2xl font-bold text-white leading-none" }, " Viewing Property Gallery ")
                      ]),
                      createVNode("div", { class: "flex items-center gap-4" }, [
                        createVNode(unref(_sfc_main$7), {
                          variant: "outline",
                          class: "hidden border-white/20 hover:bg-white/10 hover:text-white md:flex"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(" Request Info ")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$7), { class: "bg-primary text-primary-foreground font-bold" }, {
                          default: withCtx(() => [
                            createTextVNode(" Inquire Now ")
                          ]),
                          _: 1
                        })
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/modal/ModalCarousel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const route = useRoute();
    const { fetchCollection } = usePocketBaseCore();
    const formattedRoute = computed(() => {
      let type = route.params.type;
      const propertySlug = route.params.property;
      const fullSlug = `/${type}/${propertySlug}`;
      if (type === "rentals") type = "rental";
      else if (type === "properties") type = "property";
      else if (type === "lots") type = "lot";
      return { type, propertySlug, fullSlug };
    });
    const { data: pageData } = ([__temp, __restore] = withAsyncContext(async () => useAsyncData(
      `property-${route.params.property}`,
      async () => {
        var _a;
        const { fullSlug, type } = formattedRoute.value;
        const propertyRes = await fetchCollection(
          "properties",
          1,
          1,
          `slug="${fullSlug}"`,
          "-created",
          "author"
        );
        return {
          property: ((_a = propertyRes == null ? void 0 : propertyRes.items) == null ? void 0 : _a[0]) || null
        };
      }
    )), __temp = await __temp, __restore(), __temp);
    const property = computed(() => {
      var _a;
      return ((_a = pageData.value) == null ? void 0 : _a.property) || {};
    });
    const imgSrc = computed(() => {
      var _a;
      if (!((_a = property.value) == null ? void 0 : _a.id)) return "";
      return `${config.public.pocketbaseUrl}api/files/${property.value.collectionId}/${property.value.id}/${property.value.cover_image}`;
    });
    const authorImageUrl = computed(() => {
      var _a, _b;
      const author = (_b = (_a = property.value) == null ? void 0 : _a.expand) == null ? void 0 : _b.author;
      if (!(author == null ? void 0 : author.id)) return "";
      return `${config.public.pocketbaseUrl}api/files/${author.collectionId}/${author.id}/${author.avatar}`;
    });
    const mapSrc = computed(() => {
      var _a, _b;
      const lat = (_a = property.value) == null ? void 0 : _a.lat;
      const long = (_b = property.value) == null ? void 0 : _b.long;
      if (!lat || !long) return "";
      return `https://maps.google.com/maps?q=${lat},${long}&z=14&output=embed`;
    });
    const computedSeoData = computed(() => {
      var _a, _b, _c;
      if (!((_a = property.value) == null ? void 0 : _a.id)) return null;
      return createSeoObject({
        title: property.value.title || "Property Details",
        summary: property.value.description || "View details for this property.",
        imageUri: imgSrc.value,
        pubDate: property.value.created,
        byline: ((_c = (_b = property.value.expand) == null ? void 0 : _b.author) == null ? void 0 : _c.name) || "",
        keywords: `${property.value.keywords}`
      });
    });
    const computedSocialLinks = computed(() => {
      var _a, _b, _c, _d;
      const socials = ((_d = (_c = (_b = (_a = property.value) == null ? void 0 : _a.expand) == null ? void 0 : _b.author) == null ? void 0 : _c.socials) == null ? void 0 : _d.socials) || [];
      return socials.map((social) => ({
        icon: social.label.toLowerCase().includes("linkedin") ? Linkedin : Github,
        href: social.href,
        label: social.label
      }));
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
      const _component_SeoMeta = _sfc_main$2;
      const _component_ContainersSocials = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container relative w-full p-6 font-body bg-background text-foreground md:py-10" }, _attrs))}>`);
      if ((_a = unref(property)) == null ? void 0 : _a.id) {
        _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex flex-col gap-6 mb-8 md:flex-row md:items-start md:justify-between"><div class="space-y-2"><div class="flex flex-wrap items-center gap-2 mb-3">`);
      if ((_b = unref(property)) == null ? void 0 : _b.type) {
        _push(`<span class="py-1 text-xs font-semibold uppercase rounded-full bg-primary/10 text-primary px-3">${ssrInterpolate(unref(property).type)}</span>`);
      } else {
        _push(`<!---->`);
      }
      if ((_c = unref(property)) == null ? void 0 : _c.address) {
        _push(`<span class="text-sm text-muted-foreground items-center flex">`);
        _push(ssrRenderComponent(unref(MapPin), {
          size: 14,
          class: "mr-1"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).address)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><h1 class="text-3xl text-primary font-extrabold tracking-tight md:text-5xl">${ssrInterpolate(((_d = unref(property)) == null ? void 0 : _d.title) || "Property Details")}</h1><div class="flex items-center gap-4 text-sm font-medium md:text-base">`);
      if ((_e = unref(property)) == null ? void 0 : _e.bedrooms) {
        _push(`<span class="flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(Bed), {
          size: 18,
          class: "text-muted-foreground"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).bedrooms)} Bed </span>`);
      } else {
        _push(`<!---->`);
      }
      if ((_f = unref(property)) == null ? void 0 : _f.bathrooms) {
        _push(`<span class="flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(Bath), {
          size: 18,
          class: "text-muted-foreground"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).bathrooms)} Bath </span>`);
      } else {
        _push(`<!---->`);
      }
      if ((_g = unref(property)) == null ? void 0 : _g.area) {
        _push(`<span class="flex items-center gap-1.5">`);
        _push(ssrRenderComponent(unref(Square), {
          size: 18,
          class: "text-muted-foreground"
        }, null, _parent));
        _push(` ${ssrInterpolate(unref(property).area)} sq ft </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-muted-foreground leading-relaxed max-w-2xl">${ssrInterpolate((_h = unref(property)) == null ? void 0 : _h.description)}</p></div><div class="flex flex-row items-center gap-2 my-auto">`);
      if ((_i = unref(property)) == null ? void 0 : _i.price) {
        _push(`<div class="text-3xl font-bold md:text-4xl text-primary"> $${ssrInterpolate(unref(property).price.toLocaleString())}</div>`);
      } else {
        _push(`<!---->`);
      }
      if ((_j = unref(property)) == null ? void 0 : _j.pricingType) {
        _push(`<div class="text-sm font-medium text-muted-foreground">${ssrInterpolate(unref(property).pricingType)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><section id="hero" class="w-full mb-10">`);
      if ((_k = unref(property)) == null ? void 0 : _k.video) {
        _push(ssrRenderComponent(unref(_sfc_main$3), { class: "relative w-full overflow-hidden rounded-xl aspect-video shadow-xl" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b2;
            if (_push2) {
              _push2(`<video class="absolute inset-0 object-cover w-full h-full"${ssrRenderAttr("src", (_a2 = unref(property)) == null ? void 0 : _a2.video)} autoplay muted loop playsinline controls${_scopeId}></video>`);
            } else {
              return [
                createVNode("video", {
                  class: "absolute inset-0 object-cover w-full h-full",
                  src: (_b2 = unref(property)) == null ? void 0 : _b2.video,
                  autoplay: "",
                  muted: "",
                  loop: "",
                  playsinline: "",
                  controls: ""
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else if (unref(imgSrc)) {
        _push(`<img${ssrRenderAttr("src", unref(imgSrc))}${ssrRenderAttr("alt", (_l = unref(property)) == null ? void 0 : _l.title)} class="w-full h-auto max-h-[600px] object-cover rounded-xl shadow-lg">`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section id="details" class="grid grid-cols-1 gap-8 lg:grid-cols-3 scroll-mt-24"><div class="lg:col-span-3 flex w-full p-0 -mt-4 -mb-4">`);
      _push(ssrRenderComponent(_sfc_main$2$1, { class: "p-0 m-0" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2;
          if (_push2) {
            _push2(ssrRenderComponent(ShareTools, {
              title: (_a2 = unref(property)) == null ? void 0 : _a2.title,
              description: (_b2 = unref(property)) == null ? void 0 : _b2.description,
              class: "ml-auto"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(ShareTools, {
                title: (_c2 = unref(property)) == null ? void 0 : _c2.title,
                description: (_d2 = unref(property)) == null ? void 0 : _d2.description,
                class: "ml-auto"
              }, null, 8, ["title", "description"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="lg:col-span-2 space-y-10"><div class="prose prose-slate max-w-none">${(_n = (_m = unref(property)) == null ? void 0 : _m.content) != null ? _n : ""}</div>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), { class: "p-6 md:p-8" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2;
          if (_push2) {
            _push2(`<h3 class="mb-6 text-xl font-bold border-b pb-4"${_scopeId}> Property Specifics </h3><dl class="grid grid-cols-1 gap-y-6 gap-x-12 sm:grid-cols-2"${_scopeId}>`);
            if ((_a2 = unref(property)) == null ? void 0 : _a2.lotSize) {
              _push2(`<div${_scopeId}><dt class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"${_scopeId}> Lot Size </dt><dd class="text-lg font-medium"${_scopeId}>${ssrInterpolate(unref(property).lotSize)} acres</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            if ((_b2 = unref(property)) == null ? void 0 : _b2.type) {
              _push2(`<div${_scopeId}><dt class="text-xs font-semibold text-muted-foreground uppercase tracking-wider"${_scopeId}> Property Type </dt><dd class="text-lg font-medium capitalize"${_scopeId}>${ssrInterpolate(unref(property).type)}</dd></div>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</dl>`);
            if ((_d2 = (_c2 = unref(property)) == null ? void 0 : _c2.amenities) == null ? void 0 : _d2.length) {
              _push2(`<div class="mt-10"${_scopeId}><h4 class="mb-4 text-sm font-semibold text-muted-foreground uppercase"${_scopeId}> Key Amenities </h4><div class="grid grid-cols-2 gap-3 sm:grid-cols-3"${_scopeId}><!--[-->`);
              ssrRenderList(unref(property).amenities, (amenity, index) => {
                _push2(`<div class="flex items-center gap-2 p-3 rounded-lg bg-muted/40"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(Check), {
                  size: 16,
                  class: "text-green-600"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-sm font-medium"${_scopeId}>${ssrInterpolate(amenity == null ? void 0 : amenity.name)}</span></div>`);
              });
              _push2(`<!--]--></div></div>`);
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              createVNode("h3", { class: "mb-6 text-xl font-bold border-b pb-4" }, " Property Specifics "),
              createVNode("dl", { class: "grid grid-cols-1 gap-y-6 gap-x-12 sm:grid-cols-2" }, [
                ((_e2 = unref(property)) == null ? void 0 : _e2.lotSize) ? (openBlock(), createBlock("div", { key: 0 }, [
                  createVNode("dt", { class: "text-xs font-semibold text-muted-foreground uppercase tracking-wider" }, " Lot Size "),
                  createVNode("dd", { class: "text-lg font-medium" }, toDisplayString(unref(property).lotSize) + " acres", 1)
                ])) : createCommentVNode("", true),
                ((_f2 = unref(property)) == null ? void 0 : _f2.type) ? (openBlock(), createBlock("div", { key: 1 }, [
                  createVNode("dt", { class: "text-xs font-semibold text-muted-foreground uppercase tracking-wider" }, " Property Type "),
                  createVNode("dd", { class: "text-lg font-medium capitalize" }, toDisplayString(unref(property).type), 1)
                ])) : createCommentVNode("", true)
              ]),
              ((_h2 = (_g2 = unref(property)) == null ? void 0 : _g2.amenities) == null ? void 0 : _h2.length) ? (openBlock(), createBlock("div", {
                key: 0,
                class: "mt-10"
              }, [
                createVNode("h4", { class: "mb-4 text-sm font-semibold text-muted-foreground uppercase" }, " Key Amenities "),
                createVNode("div", { class: "grid grid-cols-2 gap-3 sm:grid-cols-3" }, [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(property).amenities, (amenity, index) => {
                    return openBlock(), createBlock("div", {
                      key: index,
                      class: "flex items-center gap-2 p-3 rounded-lg bg-muted/40"
                    }, [
                      createVNode(unref(Check), {
                        size: 16,
                        class: "text-green-600"
                      }),
                      createVNode("span", { class: "text-sm font-medium" }, toDisplayString(amenity == null ? void 0 : amenity.name), 1)
                    ]);
                  }), 128))
                ])
              ])) : createCommentVNode("", true)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(mapSrc)) {
        _push(ssrRenderComponent(unref(_sfc_main$3), { class: "relative my-auto w-full h-[400px] bg-primary overflow-hidden rounded-xl shadow-md" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<iframe class="inset-0 w-full h-full object-cover"${ssrRenderAttr("src", unref(mapSrc))} style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen loading="lazy" title="Property Location"${_scopeId}></iframe>`);
            } else {
              return [
                createVNode("iframe", {
                  class: "inset-0 w-full h-full object-cover",
                  src: unref(mapSrc),
                  style: { "border": "0" },
                  allowfullscreen: "",
                  loading: "lazy",
                  title: "Property Location"
                }, null, 8, ["src"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section id="gallery"><h2 class="text-2xl font-bold mb-4 w-full mt-16 scroll-mt-24"> Photo Gallery </h2>`);
      if ((_o = unref(property)) == null ? void 0 : _o.id) {
        _push(ssrRenderComponent(_sfc_main$1, {
          slides: unref(property).gallery || [],
          collectionId: unref(property).collectionId,
          propertyId: unref(property).id
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section id="realtor" class="py-12 scroll-mt-40"><h2 class="mb-8 text-3xl font-bold sm:text-4xl font-heading text-primary"> Realtor </h2>`);
      _push(ssrRenderComponent(unref(_sfc_main$3), { class: "flex flex-col gap-6 rounded-lg md:flex-row md:gap-8 border overflow-hidden shadow-md" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          var _a2, _b2, _c2, _d2, _e2, _f2, _g2, _h2, _i2, _j2, _k2, _l2, _m2, _n2, _o2, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V;
          if (_push2) {
            _push2(`<div class="flex-shrink-0 w-full md:w-1/3"${_scopeId}>`);
            if (unref(authorImageUrl)) {
              _push2(`<img${ssrRenderAttr("src", unref(authorImageUrl))}${ssrRenderAttr("alt", (_c2 = (_b2 = (_a2 = unref(property)) == null ? void 0 : _a2.expand) == null ? void 0 : _b2.author) == null ? void 0 : _c2.name)} class="object-cover w-full h-64 rounded-lg shadow-md md:h-full"${_scopeId}>`);
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div><div class="grid w-full items-center md:w-2/3 lg:p-0 px-6 pb-6"${_scopeId}><div${_scopeId}><h3 class="text-2xl font-bold text-primary md:mt-4 lg:mt-0"${_scopeId}>${ssrInterpolate((_f2 = (_e2 = (_d2 = unref(property)) == null ? void 0 : _d2.expand) == null ? void 0 : _e2.author) == null ? void 0 : _f2.name)}</h3><p class="text-lg text-muted-foreground"${_scopeId}>${ssrInterpolate((_i2 = (_h2 = (_g2 = unref(property)) == null ? void 0 : _g2.expand) == null ? void 0 : _h2.author) == null ? void 0 : _i2.title)}</p><p class="mt-3 leading-relaxed"${_scopeId}>${ssrInterpolate((_l2 = (_k2 = (_j2 = unref(property)) == null ? void 0 : _j2.expand) == null ? void 0 : _k2.author) == null ? void 0 : _l2.bio)}</p></div><div class="flex flex-col gap-2 text-sm mt-4"${_scopeId}><a${ssrRenderAttr("href", `mailto:${(_o2 = (_n2 = (_m2 = unref(property)) == null ? void 0 : _m2.expand) == null ? void 0 : _n2.author) == null ? void 0 : _o2.email}`)} class="flex items-center gap-2 hover:underline text-primary"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Mail), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_r = (_q = (_p = unref(property)) == null ? void 0 : _p.expand) == null ? void 0 : _q.author) == null ? void 0 : _r.email)}</a><a${ssrRenderAttr("href", `tel:${(_u = (_t = (_s = unref(property)) == null ? void 0 : _s.expand) == null ? void 0 : _t.author) == null ? void 0 : _u.phone}`)} class="flex items-center gap-2 hover:underline text-primary"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Phone), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` ${ssrInterpolate((_x = (_w = (_v = unref(property)) == null ? void 0 : _v.expand) == null ? void 0 : _w.author) == null ? void 0 : _x.phone)}</a></div>`);
            _push2(ssrRenderComponent(_component_ContainersSocials, {
              socialLinks: unref(computedSocialLinks),
              columnOnMobile: false,
              class: "mt-4"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "flex-shrink-0 w-full md:w-1/3" }, [
                unref(authorImageUrl) ? (openBlock(), createBlock("img", {
                  key: 0,
                  src: unref(authorImageUrl),
                  alt: (_A = (_z = (_y = unref(property)) == null ? void 0 : _y.expand) == null ? void 0 : _z.author) == null ? void 0 : _A.name,
                  class: "object-cover w-full h-64 rounded-lg shadow-md md:h-full"
                }, null, 8, ["src", "alt"])) : createCommentVNode("", true)
              ]),
              createVNode("div", { class: "grid w-full items-center md:w-2/3 lg:p-0 px-6 pb-6" }, [
                createVNode("div", null, [
                  createVNode("h3", { class: "text-2xl font-bold text-primary md:mt-4 lg:mt-0" }, toDisplayString((_D = (_C = (_B = unref(property)) == null ? void 0 : _B.expand) == null ? void 0 : _C.author) == null ? void 0 : _D.name), 1),
                  createVNode("p", { class: "text-lg text-muted-foreground" }, toDisplayString((_G = (_F = (_E = unref(property)) == null ? void 0 : _E.expand) == null ? void 0 : _F.author) == null ? void 0 : _G.title), 1),
                  createVNode("p", { class: "mt-3 leading-relaxed" }, toDisplayString((_J = (_I = (_H = unref(property)) == null ? void 0 : _H.expand) == null ? void 0 : _I.author) == null ? void 0 : _J.bio), 1)
                ]),
                createVNode("div", { class: "flex flex-col gap-2 text-sm mt-4" }, [
                  createVNode("a", {
                    href: `mailto:${(_M = (_L = (_K = unref(property)) == null ? void 0 : _K.expand) == null ? void 0 : _L.author) == null ? void 0 : _M.email}`,
                    class: "flex items-center gap-2 hover:underline text-primary"
                  }, [
                    createVNode(unref(Mail), { class: "w-4 h-4" }),
                    createTextVNode(" " + toDisplayString((_P = (_O = (_N = unref(property)) == null ? void 0 : _N.expand) == null ? void 0 : _O.author) == null ? void 0 : _P.email), 1)
                  ], 8, ["href"]),
                  createVNode("a", {
                    href: `tel:${(_S = (_R = (_Q = unref(property)) == null ? void 0 : _Q.expand) == null ? void 0 : _R.author) == null ? void 0 : _S.phone}`,
                    class: "flex items-center gap-2 hover:underline text-primary"
                  }, [
                    createVNode(unref(Phone), { class: "w-4 h-4" }),
                    createTextVNode(" " + toDisplayString((_V = (_U = (_T = unref(property)) == null ? void 0 : _T.expand) == null ? void 0 : _U.author) == null ? void 0 : _V.phone), 1)
                  ], 8, ["href"])
                ]),
                createVNode(_component_ContainersSocials, {
                  socialLinks: unref(computedSocialLinks),
                  columnOnMobile: false,
                  class: "mt-4"
                }, null, 8, ["socialLinks"])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/real-estate/[type]/[property]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-CvuzdD9I.mjs.map
