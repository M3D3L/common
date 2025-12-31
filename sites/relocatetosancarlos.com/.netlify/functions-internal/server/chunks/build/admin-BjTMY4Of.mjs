import { _ as _sfc_main$1 } from './TheNavbar-CIucisYU.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { e as contactInfo, f as siteMap } from './layout-CjWJD1bx.mjs';
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
import './server.mjs';
import 'pinia';
import 'vue-router';
import 'pocketbase';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useAuth-yR7jtp4v.mjs';
import './index-CnW7QFU2.mjs';
import 'radix-vue';
import 'class-variance-authority';
import './Card-BcNzGmRo.mjs';
import 'clsx';
import 'tailwind-merge';
import './CardContent-BeoP9VPq.mjs';
import 'lucide-vue-next';
import './index-K7kOdbQk.mjs';
import './index-C2tg38pJ.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_TheNavbar = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative flex flex-col min-h-screen mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_TheNavbar, {
        links: unref(siteMap),
        siteName: (_a = unref(contactInfo)) == null ? void 0 : _a.siteName
      }, null, _parent));
      _push(`<main class="w-full">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=admin-BjTMY4Of.mjs.map
