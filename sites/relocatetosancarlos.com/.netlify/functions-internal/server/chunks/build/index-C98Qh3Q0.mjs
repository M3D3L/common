import { c as createSeoObject, _ as _sfc_main$2 } from './useSeo-8eJjrpUV.mjs';
import { defineComponent, ref, computed, withAsyncContext, watch, unref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, createBlock, openBlock, Fragment, renderList, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseEqual, ssrLooseContain, ssrRenderClass } from 'vue/server-renderer';
import { _ as _sfc_main$8 } from './BlogHorizontal-Cr5Z5_WB.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { _ as _sfc_main$3 } from './TitleBlock-WYYv2Zkj.mjs';
import { _ as _sfc_main$7 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$4 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$6 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$5 } from './CardTitle-C2-Lmbuw.mjs';
import { c as useRoute, a as usePocketBaseCore, e as useSeoMeta } from './server.mjs';
import { u as userData } from './user-data-25SiGUPC.mjs';
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
import 'radix-vue';
import 'class-variance-authority';
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
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DynamicInput",
  __ssrInlineRender: true,
  props: {
    q: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const getInitialValue = () => {
      if (props.modelValue !== void 0 && props.modelValue !== null) {
        return props.modelValue;
      }
      switch (props.q.questionType) {
        case "checkbox":
        case "multiselect":
          return [];
        case "slider":
          return props.q.min || 0;
        case "number":
          return props.q.min || 0;
        case "radio":
        case "text":
        case "email":
        case "phone":
        default:
          return "";
      }
    };
    const localValue = ref(getInitialValue());
    const sanitizedName = computed(() => {
      return props.q.question.replace(/[^a-zA-Z0-9]/g, "_");
    });
    watch(localValue, (val) => {
      emits("update:modelValue", val);
    }, { deep: true });
    watch(() => props.modelValue, (val) => {
      if (JSON.stringify(val) !== JSON.stringify(localValue.value)) {
        localValue.value = val != null ? val : getInitialValue();
      }
    }, { deep: true });
    const error = ref("");
    const phoneError = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      if (_ctx.q.questionType === "radio") {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(_ctx.q.options, (opt) => {
          _push(`<div class="flex items-center space-x-3"><input type="radio"${ssrRenderAttr("id", `${_ctx.q.question}-${opt.value}`)}${ssrRenderAttr("name", unref(sanitizedName))}${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(ssrLooseEqual(unref(localValue), opt.value)) ? " checked" : ""} class="w-4 h-4 cursor-pointer text-primary focus:ring-2 focus:ring-primary accent-primary"><label${ssrRenderAttr("for", `${_ctx.q.question}-${opt.value}`)} class="text-sm cursor-pointer select-none">${ssrInterpolate(opt.label)}</label></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (_ctx.q.questionType === "checkbox") {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(_ctx.q.options, (opt) => {
          _push(`<div class="flex items-center space-x-3"><input type="checkbox"${ssrRenderAttr("id", `${_ctx.q.question}-${opt.value}`)}${ssrRenderAttr("value", opt.value)}${ssrIncludeBooleanAttr(Array.isArray(unref(localValue)) ? ssrLooseContain(unref(localValue), opt.value) : unref(localValue)) ? " checked" : ""} class="w-4 h-4 rounded cursor-pointer text-primary focus:ring-2 focus:ring-primary accent-primary"><label${ssrRenderAttr("for", `${_ctx.q.question}-${opt.value}`)} class="text-sm cursor-pointer select-none">${ssrInterpolate(opt.label)}</label></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (_ctx.q.questionType === "slider") {
        _push(`<div class="space-y-2"><div class="flex items-center justify-between mb-2"><span class="text-sm text-muted-foreground"> $${ssrInterpolate(Number(_ctx.q.min || 0).toLocaleString())}</span><span class="text-base font-semibold text-primary"> $${ssrInterpolate(Number(unref(localValue) || _ctx.q.min || 0).toLocaleString())}</span><span class="text-sm text-muted-foreground"> $${ssrInterpolate(Number(_ctx.q.max || 1e4).toLocaleString())}</span></div><input type="range"${ssrRenderAttr("min", _ctx.q.min || 0)}${ssrRenderAttr("max", _ctx.q.max || 1e4)}${ssrRenderAttr("step", _ctx.q.step || 100)}${ssrRenderAttr("value", unref(localValue))} class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"></div>`);
      } else if (_ctx.q.questionType === "number") {
        _push(`<div><input type="number"${ssrRenderAttr("value", unref(localValue))}${ssrRenderAttr("min", _ctx.q.min || 0)}${ssrRenderAttr("max", _ctx.q.max || 100)}${ssrRenderAttr("placeholder", _ctx.q.placeholder || "Enter a number")} class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></div>`);
      } else if (_ctx.q.questionType === "text") {
        _push(`<div><input type="text"${ssrRenderAttr("value", unref(localValue))}${ssrRenderAttr("placeholder", _ctx.q.placeholder || "Enter text...")} class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"></div>`);
      } else if (_ctx.q.questionType === "email") {
        _push(`<div class="flex flex-col gap-2"><input type="email"${ssrRenderAttr("value", unref(localValue))}${ssrRenderAttr("placeholder", _ctx.q.placeholder || "your.email@example.com")} class="${ssrRenderClass([{ "border-red-500 focus:ring-red-500": unref(error) }, "w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"])}">`);
        if (unref(error)) {
          _push(`<p class="flex items-center gap-1 text-sm text-red-500"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> ${ssrInterpolate(unref(error))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (_ctx.q.questionType === "phone") {
        _push(`<div class="flex flex-col gap-2"><input type="tel"${ssrRenderAttr("value", unref(localValue))}${ssrRenderAttr("placeholder", _ctx.q.placeholder || "+1 (555) 123-4567")} class="${ssrRenderClass([{ "border-red-500 focus:ring-red-500": unref(phoneError) }, "w-full p-3 transition-colors border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"])}">`);
        if (unref(phoneError)) {
          _push(`<p class="flex items-center gap-1 text-sm text-red-500"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg> ${ssrInterpolate(unref(phoneError))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else if (_ctx.q.questionType === "multiselect") {
        _push(`<div class="flex flex-col gap-2"><select multiple class="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent min-h-[120px]"><!--[-->`);
        ssrRenderList(_ctx.q.options, (opt) => {
          _push(`<option${ssrRenderAttr("value", opt.value)} class="p-2"${ssrIncludeBooleanAttr(Array.isArray(unref(localValue)) ? ssrLooseContain(unref(localValue), opt.value) : ssrLooseEqual(unref(localValue), opt.value)) ? " selected" : ""}>${ssrInterpolate(opt.label)}</option>`);
        });
        _push(`<!--]--></select><p class="flex items-center gap-1 text-xs text-muted-foreground"><svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg> Hold Ctrl (Cmd on Mac) to select multiple </p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/inputs/DynamicInput.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useRoute();
    const userType = ref("");
    const { fetchCollection } = usePocketBaseCore();
    const posts = ref(null);
    const currentType = computed(() => {
      return userData.find(
        (x) => {
          var _a;
          return ((_a = x == null ? void 0 : x.type) == null ? void 0 : _a.toUpperCase()) === userType.value.toUpperCase();
        }
      ) || null;
    });
    const currentQuestions = computed(() => {
      var _a;
      return ((_a = currentType.value) == null ? void 0 : _a.questions) || [];
    });
    const formAnswers = ref([]);
    const { data: fetchedPosts, error } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "posts",
      () => fetchCollection("relocateBlog", 1, 3, "", "-created")
    )), __temp = await __temp, __restore(), __temp);
    if (fetchedPosts.value) {
      posts.value = fetchedPosts.value;
    }
    if (error.value) {
      console.error("Error fetching posts:", error.value);
    }
    const computedSeoData = computed(() => {
      var _a, _b;
      const pageTitle = ((_a = currentType.value) == null ? void 0 : _a.type) || "Default Title";
      const pageDescription = ((_b = currentType.value) == null ? void 0 : _b.description) || "Default description";
      return createSeoObject({
        title: pageTitle,
        summary: pageDescription,
        imageUri: "",
        pubDate: (/* @__PURE__ */ new Date()).toISOString(),
        byline: "RelocateToSanCarlos",
        // Optional for homepage JSON-LD customization
        jsonLd: {
          "@type": "WebSite",
          url: "https://relocatetosancarlos.com",
          name: pageTitle,
          description: pageDescription
        }
      });
    });
    useSeoMeta(computedSeoData.value);
    watch(
      currentQuestions,
      (newQs) => {
        formAnswers.value = newQs.map((q) => {
          if (q.questionType === "slider" || q.questionType === "number") return 0;
          return "";
        });
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_SeoMeta = _sfc_main$2;
      const _component_InputsDynamicInput = _sfc_main$1;
      const _component_CardsBlogHorizontal = _sfc_main$8;
      const _component_nuxt_link = __nuxt_component_0;
      if ((_a = unref(currentType)) == null ? void 0 : _a.type) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "container relative content-center min-h-screen pt-10 pb-32" }, _attrs))}>`);
        _push(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$3, {
          class: "mb-8",
          title: unref(currentType).type,
          description: unref(currentType).description,
          type: "h1"
        }, null, _parent));
        _push(`<div class="relative flex flex-col gap-6 lg:flex-row">`);
        if (unref(currentQuestions).length) {
          _push(`<form class="w-full lg:w-1/2">`);
          _push(ssrRenderComponent(unref(_sfc_main$4), { class: "flex flex-col gap-4 p-8" }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`<!--[-->`);
                ssrRenderList(unref(currentQuestions), (q, index) => {
                  _push2(`<div${_scopeId}>`);
                  _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "mb-4 text-lg font-semibold" }, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(`${ssrInterpolate(q.question)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(q.question), 1)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(ssrRenderComponent(unref(_sfc_main$6), null, {
                    default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                      if (_push3) {
                        _push3(ssrRenderComponent(_component_InputsDynamicInput, {
                          modelValue: unref(formAnswers)[index],
                          "onUpdate:modelValue": ($event) => unref(formAnswers)[index] = $event,
                          q
                        }, null, _parent3, _scopeId2));
                      } else {
                        return [
                          createVNode(_component_InputsDynamicInput, {
                            modelValue: unref(formAnswers)[index],
                            "onUpdate:modelValue": ($event) => unref(formAnswers)[index] = $event,
                            q
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "q"])
                        ];
                      }
                    }),
                    _: 2
                  }, _parent2, _scopeId));
                  _push2(`</div>`);
                });
                _push2(`<!--]-->`);
              } else {
                return [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(currentQuestions), (q, index) => {
                    return openBlock(), createBlock("div", { key: index }, [
                      createVNode(unref(_sfc_main$5), { class: "mb-4 text-lg font-semibold" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(q.question), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$6), null, {
                        default: withCtx(() => [
                          createVNode(_component_InputsDynamicInput, {
                            modelValue: unref(formAnswers)[index],
                            "onUpdate:modelValue": ($event) => unref(formAnswers)[index] = $event,
                            q
                          }, null, 8, ["modelValue", "onUpdate:modelValue", "q"])
                        ]),
                        _: 2
                      }, 1024)
                    ]);
                  }), 128))
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<div class="flex w-full mt-8">`);
          _push(ssrRenderComponent(unref(_sfc_main$7), {
            class: "w-full text-lg font-bold",
            variant: "outline",
            size: "lg",
            type: "submit",
            disabled: !unref(formAnswers).every(
              (a) => a !== void 0 && a !== "" && a !== null
            )
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(` Submit `);
              } else {
                return [
                  createTextVNode(" Submit ")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div></form>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="sticky grid w-full h-full gap-3 top-32 lg:w-1/2"><h2 class="">Related Posts</h2><!--[-->`);
        ssrRenderList((_b = unref(posts)) == null ? void 0 : _b.items, (post, index) => {
          _push(ssrRenderComponent(_component_CardsBlogHorizontal, {
            title: post.title,
            description: post.description,
            created: post.created,
            slug: post.slug,
            "collection-id": post.collectionId,
            id: post.id,
            "cover-image": post.cover_image,
            index
          }, null, _parent));
        });
        _push(`<!--]--><div class="w-full flex justify-end"><div>`);
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: "/blog",
          class: "font-bold w-full transition-all hover:opacity-90 text-primary hover:underline pb-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` View All Posts `);
            } else {
              return [
                createTextVNode(" View All Posts ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/onboarding/[type]/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-C98Qh3Q0.mjs.map
