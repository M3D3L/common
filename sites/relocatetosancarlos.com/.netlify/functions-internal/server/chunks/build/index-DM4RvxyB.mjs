import { c as createSeoObject, _ as _sfc_main$5 } from './useSeo-8eJjrpUV.mjs';
import { _ as _sfc_main$8 } from './Video-D1RJ9xBX.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { ref, computed, mergeProps, unref, defineComponent, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, resolveDynamicComponent, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderClass, ssrRenderVNode } from 'vue/server-renderer';
import { _ as _sfc_main$9 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$6 } from './SectionTitle-BDfWxJKH.mjs';
import { _ as __nuxt_component_1 } from './UserTypes-PENMNly5.mjs';
import { _ as _sfc_main$7 } from './PropertyCard-BwcRjl5g.mjs';
import { _ as _sfc_main$a } from './Carousel-CBZY9l1v.mjs';
import { _ as _sfc_main$b } from './Card-BcNzGmRo.mjs';
import { YoutubeIcon, MusicIcon, FacebookIcon, InstagramIcon } from 'lucide-vue-next';
import { h as heroSection, s as servicesSection, p as propertiesSection, a as socialsSection, b as seoDefaults } from './layout-CjWJD1bx.mjs';
import { a as usePocketBaseCore, b as useRuntimeConfig } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './index-D_6hfEP1.mjs';
import 'hey-listen';
import './index-C2tg38pJ.mjs';
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
import 'radix-vue';
import 'class-variance-authority';
import './tetakawi-BCtB9dcW.mjs';
import './nuxt-icon-BceZjI9b.mjs';
import './CardContent-BeoP9VPq.mjs';
import './CardTitle-C2-Lmbuw.mjs';
import './user-data-25SiGUPC.mjs';
import './index-imKBogpg.mjs';
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

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Hero",
  __ssrInlineRender: true,
  props: {
    id: {},
    padding: {},
    video: {},
    headerId: {},
    imageSrc: {},
    imageAlt: {},
    titleLine1: {},
    titleHighlight: {},
    description: {},
    buttons: {}
  },
  setup(__props) {
    const props = __props;
    const {
      id,
      padding,
      video,
      headerId,
      imageSrc,
      imageAlt,
      titleLine1,
      titleHighlight,
      description
    } = props;
    const parallaxContainer = ref(null);
    const parallaxOffset = ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_containers_video = _sfc_main$8;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_nuxt_link = __nuxt_component_0;
      _push(ssrRenderComponent(_component_containers_video, mergeProps({
        id: unref(id),
        padding: unref(padding),
        video: unref(video)
      }, _attrs), {
        "video-container-content": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<section${ssrRenderAttr("id", unref(headerId))} class="flex flex-col min-h-screen items-center justify-center w-full py-16 md:flex-row md:py-0"${_scopeId}><div class="flex flex-col rounded-lg items-center justify-center w-full overflow-hidden md:flex-row md:py-0"${_scopeId}><div class="flex items-end justify-center w-full md:w-1/2 lg:w-1/2 xl:w-2/3"${_scopeId}><img${ssrRenderAttr("src", unref(imageSrc))}${ssrRenderAttr("alt", unref(imageAlt))} class="hidden w-full lg:w-2/3 md:block ml-auto"${_scopeId}></div><section style="${ssrRenderStyle({ transform: `translateY(${parallaxOffset.value}px)` })}"${ssrRenderAttr("id", unref(headerId))} class="md:w-1/2 z-10 flex h-full bg-black bg-opacity-50 rounded-lg overflow-hidden flex-col items-center justify-center text-center p-6 transition-transform duration-100 ease-out"${_scopeId}><div class="w-full space-y-6"${_scopeId}><h1 class="text-2xl font-extralight uppercase tracking-[0.3em] text-white sm:text-3xl lg:text-4xl"${_scopeId}>${ssrInterpolate(unref(titleLine1))} <span class="mt-2 font-bold leading-tight text-primary text-xl sm:text-2xl"${_scopeId}>${ssrInterpolate(unref(titleHighlight))}</span></h1><img${ssrRenderAttr("src", unref(imageSrc))}${ssrRenderAttr("alt", unref(imageAlt))} class="md:hidden w-2/3 mx-auto"${_scopeId}><p class="mx-auto max-w-xl text-white/90 sm:text-base font-light leading-tight"${_scopeId}>${ssrInterpolate(unref(description))}</p><div class="flex flex-col gap-4 pt-8 lg:flex-row sm:justify-center"${_scopeId}><!--[-->`);
            ssrRenderList(_ctx.buttons, (button, index2) => {
              _push2(ssrRenderComponent(unref(_sfc_main$9), {
                key: button.title,
                asChild: "",
                size: "lg",
                variant: index2 === 0 ? "default" : "outline-white",
                class: "min-w-56 font-semibold text-sm uppercase px-4 tracking-wider transition-all duration-300 transform hover:scale-[1.03]"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_NuxtLink, {
                      to: button.link
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(button.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(button.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(_component_NuxtLink, {
                        to: button.link
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(button.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["to"])
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div></div></section>`);
            _push2(ssrRenderComponent(_component_nuxt_link, {
              to: "/#about",
              class: "absolute hidden md:block bottom-24 cursor-pointer transition-opacity duration-500 hover:opacity-100"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<p class="text-xl uppercase tracking-widest text-white/70 font-light"${_scopeId2}> Discover San Carlos </p><svg class="mx-auto mt-2 h-6 w-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"${_scopeId2}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7"${_scopeId2}></path></svg>`);
                } else {
                  return [
                    createVNode("p", { class: "text-xl uppercase tracking-widest text-white/70 font-light" }, " Discover San Carlos "),
                    (openBlock(), createBlock("svg", {
                      class: "mx-auto mt-2 h-6 w-6 text-white animate-bounce",
                      fill: "none",
                      stroke: "currentColor",
                      viewBox: "0 0 24 24",
                      xmlns: "http://www.w3.org/2000/svg"
                    }, [
                      createVNode("path", {
                        "stroke-linecap": "round",
                        "stroke-linejoin": "round",
                        "stroke-width": "1.5",
                        d: "M19 9l-7 7-7-7"
                      })
                    ]))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></section>`);
          } else {
            return [
              createVNode("section", {
                id: unref(headerId),
                class: "flex flex-col min-h-screen items-center justify-center w-full py-16 md:flex-row md:py-0"
              }, [
                createVNode("div", { class: "flex flex-col rounded-lg items-center justify-center w-full overflow-hidden md:flex-row md:py-0" }, [
                  createVNode("div", { class: "flex items-end justify-center w-full md:w-1/2 lg:w-1/2 xl:w-2/3" }, [
                    createVNode("img", {
                      src: unref(imageSrc),
                      alt: unref(imageAlt),
                      class: "hidden w-full lg:w-2/3 md:block ml-auto"
                    }, null, 8, ["src", "alt"])
                  ]),
                  createVNode("section", {
                    ref_key: "parallaxContainer",
                    ref: parallaxContainer,
                    style: { transform: `translateY(${parallaxOffset.value}px)` },
                    id: unref(headerId),
                    class: "md:w-1/2 z-10 flex h-full bg-black bg-opacity-50 rounded-lg overflow-hidden flex-col items-center justify-center text-center p-6 transition-transform duration-100 ease-out"
                  }, [
                    createVNode("div", { class: "w-full space-y-6" }, [
                      createVNode("h1", { class: "text-2xl font-extralight uppercase tracking-[0.3em] text-white sm:text-3xl lg:text-4xl" }, [
                        createTextVNode(toDisplayString(unref(titleLine1)) + " ", 1),
                        createVNode("span", { class: "mt-2 font-bold leading-tight text-primary text-xl sm:text-2xl" }, toDisplayString(unref(titleHighlight)), 1)
                      ]),
                      createVNode("img", {
                        src: unref(imageSrc),
                        alt: unref(imageAlt),
                        class: "md:hidden w-2/3 mx-auto"
                      }, null, 8, ["src", "alt"]),
                      createVNode("p", { class: "mx-auto max-w-xl text-white/90 sm:text-base font-light leading-tight" }, toDisplayString(unref(description)), 1),
                      createVNode("div", { class: "flex flex-col gap-4 pt-8 lg:flex-row sm:justify-center" }, [
                        (openBlock(true), createBlock(Fragment, null, renderList(_ctx.buttons, (button, index2) => {
                          return openBlock(), createBlock(unref(_sfc_main$9), {
                            key: button.title,
                            asChild: "",
                            size: "lg",
                            variant: index2 === 0 ? "default" : "outline-white",
                            class: "min-w-56 font-semibold text-sm uppercase px-4 tracking-wider transition-all duration-300 transform hover:scale-[1.03]"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, {
                                to: button.link
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(button.title), 1)
                                ]),
                                _: 2
                              }, 1032, ["to"])
                            ]),
                            _: 2
                          }, 1032, ["variant"]);
                        }), 128))
                      ])
                    ])
                  ], 12, ["id"]),
                  createVNode(_component_nuxt_link, {
                    to: "/#about",
                    class: "absolute hidden md:block bottom-24 cursor-pointer transition-opacity duration-500 hover:opacity-100"
                  }, {
                    default: withCtx(() => [
                      createVNode("p", { class: "text-xl uppercase tracking-widest text-white/70 font-light" }, " Discover San Carlos "),
                      (openBlock(), createBlock("svg", {
                        class: "mx-auto mt-2 h-6 w-6 text-white animate-bounce",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        xmlns: "http://www.w3.org/2000/svg"
                      }, [
                        createVNode("path", {
                          "stroke-linecap": "round",
                          "stroke-linejoin": "round",
                          "stroke-width": "1.5",
                          d: "M19 9l-7 7-7-7"
                        })
                      ]))
                    ]),
                    _: 1
                  })
                ])
              ], 8, ["id"])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/organisms/Hero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Intro",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TextSectionTitle = _sfc_main$6;
      const _component_MoleculesUserTypes = __nuxt_component_1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "container grid content-center min-h-screen py-24 mx-auto"
      }, _attrs))}>`);
      _push(ssrRenderComponent(_component_TextSectionTitle, {
        class: "pt-12 pb-16",
        title: _ctx.title,
        description: _ctx.description,
        h1: false
      }, null, _parent));
      _push(ssrRenderComponent(_component_MoleculesUserTypes, null, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/Intro.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "SocialsCard",
  __ssrInlineRender: true,
  props: {
    platform: { default: "Instagram" },
    imageUrl: { default: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=1000&fit=crop" },
    handle: { default: "@RelocateToSanCarlos" },
    tagline: { default: "Follow Our Journey" },
    description: { default: "Daily updates from paradise \u{1F30A}\u2600\uFE0F" },
    ctaText: { default: "Follow Us" }
  },
  setup(__props) {
    const props = __props;
    const platformConfig = {
      Instagram: {
        icon: InstagramIcon,
        gradient: "from-purple-600 via-pink-600 to-orange-500",
        iconBg: "bg-white/20",
        buttonStyle: "bg-white text-purple-600 hover:bg-white/90"
      },
      Facebook: {
        icon: FacebookIcon,
        gradient: "from-blue-600 via-blue-700 to-blue-800",
        iconBg: "bg-white/20",
        buttonStyle: "bg-white text-blue-600 hover:bg-white/90"
      },
      TikTok: {
        icon: MusicIcon,
        gradient: "from-black via-gray-900 to-pink-900",
        iconBg: "bg-white/20",
        buttonStyle: "bg-white text-black hover:bg-white/90"
      },
      YouTube: {
        icon: YoutubeIcon,
        // Assuming you have this imported
        gradient: "from-red-600 via-red-700 to-red-800",
        iconBg: "bg-white/20",
        buttonStyle: "bg-white text-red-600 hover:bg-white/90"
      }
    };
    const config = computed(() => platformConfig[props.platform]);
    const platformIcon = computed(() => config.value.icon);
    const gradient = computed(() => config.value.gradient);
    const iconBg = computed(() => config.value.iconBg);
    const buttonStyle = computed(() => config.value.buttonStyle);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$b), mergeProps({ class: "group relative w-full aspect-[4/5] overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="absolute inset-0"${_scopeId}><img${ssrRenderAttr("src", _ctx.imageUrl)}${ssrRenderAttr("alt", _ctx.platform)} class="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"${_scopeId}><div class="${ssrRenderClass(`absolute inset-0 bg-gradient-to-br ${unref(gradient)} opacity-80 group-hover:opacity-70 transition-opacity duration-500`)}"${_scopeId}></div></div><div class="relative flex flex-col justify-between h-full p-6 text-white"${_scopeId}><div class="flex items-center space-x-3"${_scopeId}><div class="${ssrRenderClass(`p-2.5 rounded-full ${unref(iconBg)} backdrop-blur-sm`)}"${_scopeId}>`);
            ssrRenderVNode(_push2, createVNode(resolveDynamicComponent(unref(platformIcon)), { class: "w-6 h-6" }, null), _parent2, _scopeId);
            _push2(`</div><div${_scopeId}><h3 class="text-xl font-bold"${_scopeId}>${ssrInterpolate(_ctx.platform)}</h3><p class="text-sm text-white/90"${_scopeId}>${ssrInterpolate(_ctx.handle)}</p></div></div><div class="space-y-4"${_scopeId}><div class="space-y-2"${_scopeId}><p class="text-2xl font-bold leading-tight drop-shadow-lg"${_scopeId}>${ssrInterpolate(_ctx.tagline)}</p><p class="text-sm text-white/80 drop-shadow"${_scopeId}>${ssrInterpolate(_ctx.description)}</p></div>`);
            _push2(ssrRenderComponent(unref(_sfc_main$9), {
              class: `w-full ${unref(buttonStyle)} font-semibold py-6 text-base shadow-xl hover:scale-105 transition-transform duration-300`
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(_ctx.ctaText)}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(_ctx.ctaText), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div>`);
          } else {
            return [
              createVNode("div", { class: "absolute inset-0" }, [
                createVNode("img", {
                  src: _ctx.imageUrl,
                  alt: _ctx.platform,
                  class: "object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                }, null, 8, ["src", "alt"]),
                createVNode("div", {
                  class: `absolute inset-0 bg-gradient-to-br ${unref(gradient)} opacity-80 group-hover:opacity-70 transition-opacity duration-500`
                }, null, 2)
              ]),
              createVNode("div", { class: "relative flex flex-col justify-between h-full p-6 text-white" }, [
                createVNode("div", { class: "flex items-center space-x-3" }, [
                  createVNode("div", {
                    class: `p-2.5 rounded-full ${unref(iconBg)} backdrop-blur-sm`
                  }, [
                    (openBlock(), createBlock(resolveDynamicComponent(unref(platformIcon)), { class: "w-6 h-6" }))
                  ], 2),
                  createVNode("div", null, [
                    createVNode("h3", { class: "text-xl font-bold" }, toDisplayString(_ctx.platform), 1),
                    createVNode("p", { class: "text-sm text-white/90" }, toDisplayString(_ctx.handle), 1)
                  ])
                ]),
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", { class: "space-y-2" }, [
                    createVNode("p", { class: "text-2xl font-bold leading-tight drop-shadow-lg" }, toDisplayString(_ctx.tagline), 1),
                    createVNode("p", { class: "text-sm text-white/80 drop-shadow" }, toDisplayString(_ctx.description), 1)
                  ]),
                  createVNode(unref(_sfc_main$9), {
                    class: `w-full ${unref(buttonStyle)} font-semibold py-6 text-base shadow-xl hover:scale-105 transition-transform duration-300`
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(_ctx.ctaText), 1)
                    ]),
                    _: 1
                  }, 8, ["class"])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/cards/SocialsCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "SocialsCarousel",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String
    },
    description: {
      type: String
    },
    socials: {
      type: Array
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TextSectionTitle = _sfc_main$6;
      const _component_ContainersCarousel = _sfc_main$a;
      const _component_CardsSocialsCard = _sfc_main$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid content-center w-full min-h-screen px-4 mx-auto overflow-hidden lg:px-8 lg:container" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_TextSectionTitle, {
        class: "pt-12 pb-16",
        title: __props.title,
        description: __props.description,
        h1: false
      }, null, _parent));
      _push(ssrRenderComponent(_component_ContainersCarousel, { slides: __props.socials }, {
        slide: withCtx(({ slide, index: index2 }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardsSocialsCard, mergeProps({ key: index2 }, slide), null, _parent2, _scopeId));
          } else {
            return [
              (openBlock(), createBlock(_component_CardsSocialsCard, mergeProps({ key: index2 }, slide), null, 16))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/SocialsCarousel.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    usePocketBaseCore();
    const config = useRuntimeConfig();
    ref(false);
    const properties = ref([]);
    const computedSeoData = computed(
      () => createSeoObject({
        title: seoDefaults.home.title,
        summary: seoDefaults.home.description,
        keywords: seoDefaults.home.keywords,
        imageUri: seoDefaults.home.image,
        pubDate: "",
        byline: seoDefaults.home.byline,
        // Optional for homepage JSON-LD customization
        jsonLd: {
          "@type": "WebSite",
          url: config.public.siteUrl,
          name: seoDefaults.home.title,
          description: seoDefaults.home.description,
          publisher: {
            "@type": "Organization",
            name: config.public.siteName
          }
        }
      })
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_SeoMeta = _sfc_main$5;
      const _component_OrganismsHero = _sfc_main$4;
      const _component_SectionsIntro = _sfc_main$3;
      const _component_TextSectionTitle = _sfc_main$6;
      const _component_CardsPropertyCard = _sfc_main$7;
      const _component_nuxt_link = __nuxt_component_0;
      const _component_SectionsSocialsCarousel = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full pb-16" }, _attrs))} data-v-5143ce18>`);
      _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
      _push(ssrRenderComponent(_component_OrganismsHero, unref(heroSection), null, _parent));
      _push(ssrRenderComponent(_component_SectionsIntro, unref(servicesSection), null, _parent));
      _push(`<div class="container" data-v-5143ce18>`);
      _push(ssrRenderComponent(_component_TextSectionTitle, {
        class: "pt-12 pb-8",
        title: unref(propertiesSection).title,
        description: unref(propertiesSection).description,
        h1: false
      }, null, _parent));
      _push(`<div class="grid md:grid-cols-3 gap-6" data-v-5143ce18><!--[-->`);
      ssrRenderList((_a = unref(properties)) == null ? void 0 : _a.items, (item, itemIndex) => {
        _push(ssrRenderComponent(_component_CardsPropertyCard, {
          key: `property-home-${itemIndex}`,
          content: item,
          class: "mt-8"
        }, null, _parent));
      });
      _push(`<!--]--></div><div class="w-full flex justify-end" data-v-5143ce18><div class="mt-16" data-v-5143ce18>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "/real-estate/",
        class: "font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` View More Properties `);
          } else {
            return [
              createTextVNode(" View More Properties ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
      _push(ssrRenderComponent(_component_SectionsSocialsCarousel, unref(socialsSection), null, _parent));
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5143ce18"]]);

export { index as default };
//# sourceMappingURL=index-DM4RvxyB.mjs.map
