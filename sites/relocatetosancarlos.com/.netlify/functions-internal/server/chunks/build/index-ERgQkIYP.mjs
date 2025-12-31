import { c as createSeoObject, _ as _sfc_main$1 } from './useSeo-8eJjrpUV.mjs';
import { _ as __nuxt_component_2 } from './BlogColumn-DdmbN1m_.mjs';
import { defineComponent, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { c as blogSection } from './layout-CjWJD1bx.mjs';
import { b as useRuntimeConfig } from './server.mjs';
import './SectionTitle-BDfWxJKH.mjs';
import './index-D_6hfEP1.mjs';
import 'hey-listen';
import './index-C2tg38pJ.mjs';
import './BlogHorizontal-Cr5Z5_WB.mjs';
import './nuxt-link-8UYShezB.mjs';
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
import './index-CnW7QFU2.mjs';
import 'radix-vue';
import 'class-variance-authority';
import './Label-NdntEGti.mjs';
import './index-K7kOdbQk.mjs';
import 'lucide-vue-next';
import './DialogContent--DfaB7PA.mjs';
import 'reka-ui';
import './DialogTitle-etzFEgfj.mjs';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './Pagination-XsHAzqkr.mjs';
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
  setup(__props) {
    const config = useRuntimeConfig();
    const computedSeoData = computed(
      () => createSeoObject({
        title: blogSection.title,
        summary: blogSection.description,
        keywords: blogSection.keywords,
        imageUri: blogSection.imgSrc,
        pubDate: "",
        byline: blogSection.byline,
        // Optional for homepage JSON-LD customization
        jsonLd: {
          "@type": "WebSite",
          url: config.public.siteUrl,
          name: blogSection.title,
          description: blogSection.description,
          publisher: {
            "@type": "Organization",
            name: config.public.siteName
          }
        }
      })
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_SeoMeta = _sfc_main$1;
      const _component_SectionsBlogColumn = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "mt-8 md:pt-16" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
      _push(ssrRenderComponent(_component_SectionsBlogColumn, {
        h1: true,
        title: (_a = unref(blogSection)) == null ? void 0 : _a.title,
        description: (_b = unref(blogSection)) == null ? void 0 : _b.description,
        type: unref(config).public.blogType,
        imgSrc: _ctx.imgSrc,
        showMore: false,
        showPagination: true
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-ERgQkIYP.mjs.map
