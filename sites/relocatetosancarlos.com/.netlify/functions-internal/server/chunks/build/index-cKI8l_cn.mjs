import { c as createSeoObject, _ as _sfc_main$1 } from './useSeo-8eJjrpUV.mjs';
import { _ as _sfc_main$2 } from './SectionTitle-BDfWxJKH.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { _ as _sfc_main$4 } from './PropertyCard-BwcRjl5g.mjs';
import { _ as _sfc_main$5 } from './InfoCard-ZpyzUNO7.mjs';
import { defineComponent, computed, withAsyncContext, resolveComponent, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './index-CnW7QFU2.mjs';
import { a as usePocketBaseCore, b as useRuntimeConfig } from './server.mjs';
import { d as categories, r as realEstateHeroSection } from './layout-CjWJD1bx.mjs';
import { Edit } from 'lucide-vue-next';
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
import './Card-BcNzGmRo.mjs';
import 'clsx';
import 'tailwind-merge';
import './CardContent-BeoP9VPq.mjs';
import './index-imKBogpg.mjs';
import 'class-variance-authority';
import './CardTitle-C2-Lmbuw.mjs';
import 'radix-vue';
import 'pinia';
import 'vue-router';
import 'pocketbase';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const config = useRuntimeConfig();
    const { fetchCollection, isUserVerified } = usePocketBaseCore();
    const isVerified = computed(() => isUserVerified());
    const fetchPropertiesByType = async (type) => {
      try {
        return await fetchCollection(
          "properties",
          1,
          6,
          `type="${type}"`,
          "-created",
          ""
        );
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      }
    };
    categories[0].properties = ([__temp, __restore] = withAsyncContext(() => fetchPropertiesByType("property")), __temp = await __temp, __restore(), __temp) || [];
    categories[1].properties = ([__temp, __restore] = withAsyncContext(() => fetchPropertiesByType("rental")), __temp = await __temp, __restore(), __temp) || [];
    categories[2].properties = ([__temp, __restore] = withAsyncContext(() => fetchPropertiesByType("lot")), __temp = await __temp, __restore(), __temp) || [];
    const computedSeoData = computed(() => {
      return createSeoObject({
        title: realEstateHeroSection.titleLine1 + " " + realEstateHeroSection.titleHighlight,
        summary: realEstateHeroSection.description,
        keywords: realEstateHeroSection.keywords,
        imageUri: realEstateHeroSection.imageSrc,
        pubDate: "",
        byline: "Brenda \u2013 San Carlos Relocation Specialist",
        // Optional for homepage JSON-LD customization
        jsonLd: {
          "@type": "WebSite",
          url: config.public.siteUrl,
          name: realEstateHeroSection.titleLine1 + " " + realEstateHeroSection.titleHighlight,
          description: realEstateHeroSection.description,
          publisher: {
            "@type": "Organization",
            name: config.public.siteName
          }
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SeoMeta = _sfc_main$1;
      const _component_TextSectionTitle = _sfc_main$2;
      const _component_nuxt_link = __nuxt_component_0;
      const _component_AtomsPictureGrid = resolveComponent("AtomsPictureGrid");
      const _component_CardsPropertyCard = _sfc_main$4;
      const _component_CardsInfoCard = _sfc_main$5;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "pt-16 pb-32 container space-y-32 lg:pt-24" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
      _push(`<div class="flex flex-col md:flex-row justify-between gap-4">`);
      _push(ssrRenderComponent(_component_TextSectionTitle, {
        title: "Relocate to San Carlos",
        description: "Your trusted partner for finding the perfect property in San Carlos, Mexico. From expert guidance and personalized service to comprehensive support throughout your relocation journey, we're here to make your move seamless and stress-free.",
        h1: true
      }, null, _parent));
      if (unref(isVerified)) {
        _push(ssrRenderComponent(_sfc_main$3, { onClick: () => {
        } }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_nuxt_link, {
                to: "/real-estate/admin",
                class: "flex items-center justify-center text-center w-full gap-2"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Edit), { class: "w-4 h-4" }, null, _parent3, _scopeId2));
                    _push3(` Manage Listings `);
                  } else {
                    return [
                      createVNode(unref(Edit), { class: "w-4 h-4" }),
                      createTextVNode(" Manage Listings ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_nuxt_link, {
                  to: "/real-estate/admin",
                  class: "flex items-center justify-center text-center w-full gap-2"
                }, {
                  default: withCtx(() => [
                    createVNode(unref(Edit), { class: "w-4 h-4" }),
                    createTextVNode(" Manage Listings ")
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
      _push(`</div>`);
      _push(ssrRenderComponent(_component_AtomsPictureGrid, null, null, _parent));
      _push(`<!--[-->`);
      ssrRenderList(unref(categories), (category, index) => {
        var _a, _b, _c, _d, _e;
        _push(`<li>`);
        _push(ssrRenderComponent(_component_TextSectionTitle, {
          class: { "pt-12": index !== 0 },
          title: category.title,
          description: category.sectionSubTitle,
          h1: false
        }, null, _parent));
        _push(`<div class="${ssrRenderClass([index % 2 ? "lg:flex-row-reverse" : "lg:flex-row", "flex flex-col gap-8 mt-6"])}"><div class="grid w-full items-center grid-cols-1 gap-8 md:grid-cols-2 lg:w-2/3">`);
        if (!((_b = (_a = category == null ? void 0 : category.properties) == null ? void 0 : _a.items) == null ? void 0 : _b.length)) {
          _push(`<p class="col-span-2 text-center text-muted-foreground italic"> No results available right now. Please check back soon. </p>`);
        } else {
          _push(`<!--[-->`);
          ssrRenderList((_c = category == null ? void 0 : category.properties) == null ? void 0 : _c.items, (item, itemIndex) => {
            _push(ssrRenderComponent(_component_CardsPropertyCard, {
              key: `${index}-${itemIndex}`,
              baseUrl: "/real-estate",
              removeSpacing: true,
              content: item,
              buttonText: "Check it Out!"
            }, {
              extraButton: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) ;
                else {
                  return [];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]-->`);
        }
        if (((_d = category == null ? void 0 : category.properties) == null ? void 0 : _d.totalPages) > 1) {
          _push(`<div class="flex justify-center md:col-span-2">`);
          _push(ssrRenderComponent(_component_nuxt_link, {
            to: `/real-estate/${category == null ? void 0 : category.type}/`,
            class: "text-sm font-medium underline capitalize transition-colors hover:text-primary underline-offset-4"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` View All ${ssrInterpolate(category == null ? void 0 : category.type)}`);
              } else {
                return [
                  createTextVNode(" View All " + toDisplayString(category == null ? void 0 : category.type), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="w-full lg:w-1/3">`);
        if (category) {
          _push(ssrRenderComponent(_component_CardsInfoCard, {
            title: category.sectionTitle,
            footerText: category.footerText,
            subtitle: category.subtitle,
            benefits: category.benefits,
            categories: unref(categories),
            dataArray: (_e = category == null ? void 0 : category.properties) == null ? void 0 : _e.items,
            class: "z-10 sticky-position top-28",
            mode: category.mode
          }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/real-estate/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-cKI8l_cn.mjs.map
