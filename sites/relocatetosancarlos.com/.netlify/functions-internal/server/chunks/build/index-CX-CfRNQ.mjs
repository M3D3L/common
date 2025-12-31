import { _ as _sfc_main$1 } from './TitleBlock-WYYv2Zkj.mjs';
import { _ as __nuxt_component_1 } from './UserTypes-PENMNly5.mjs';
import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
import './tetakawi-BCtB9dcW.mjs';
import './nuxt-icon-BceZjI9b.mjs';
import 'lucide-vue-next';
import './Card-BcNzGmRo.mjs';
import 'clsx';
import 'tailwind-merge';
import './CardContent-BeoP9VPq.mjs';
import './CardTitle-C2-Lmbuw.mjs';
import './user-data-25SiGUPC.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_TitleBlock = _sfc_main$1;
  const _component_MoleculesUserTypes = __nuxt_component_1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "container relative content-center min-h-screen py-10 duration-150 ease-in-out transition-color" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_TitleBlock, {
    class: "mb-6",
    title: "Tell Us About Yourself",
    description: "Share your interests and preferences to help us tailor your experience."
  }, null, _parent));
  _push(ssrRenderComponent(_component_MoleculesUserTypes, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-CX-CfRNQ.mjs.map
