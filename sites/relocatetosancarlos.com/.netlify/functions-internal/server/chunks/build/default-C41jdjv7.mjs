import { _ as _sfc_main$5, a as __nuxt_component_1 } from './TheNavbar-CIucisYU.mjs';
import { defineComponent, computed, mergeProps, unref, ref, withCtx, createTextVNode, isRef, createBlock, openBlock, createVNode, withModifiers, createCommentVNode, withDirectives, vModelText, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$6 } from './index-CnW7QFU2.mjs';
import { _ as __nuxt_component_2 } from './BlogColumn-DdmbN1m_.mjs';
import { _ as _sfc_main$7 } from './Video-D1RJ9xBX.mjs';
import { _ as _sfc_main$9 } from './SectionTitle-BDfWxJKH.mjs';
import { _ as _sfc_main$d } from './Socials-Cbbymkzi.mjs';
import { m as motion } from './index-D_6hfEP1.mjs';
import { _ as _sfc_main$8 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$a } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$b, a as _sfc_main$1$1 } from './Label-NdntEGti.mjs';
import { _ as _sfc_main$c } from './Textarea-jDz9Vded.mjs';
import { Linkedin, Github, Mail, Phone } from 'lucide-vue-next';
import { c as useRoute, a as usePocketBaseCore } from './server.mjs';
import { e as contactInfo, f as siteMap, c as blogSection, g as socials, i as contactSection } from './layout-CjWJD1bx.mjs';
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
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './useAuth-yR7jtp4v.mjs';
import './index-K7kOdbQk.mjs';
import './index-C2tg38pJ.mjs';
import 'radix-vue';
import 'class-variance-authority';
import './BlogHorizontal-Cr5Z5_WB.mjs';
import './DialogContent--DfaB7PA.mjs';
import 'reka-ui';
import './DialogTitle-etzFEgfj.mjs';
import './Pagination-XsHAzqkr.mjs';
import 'hey-listen';
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
  __name: "Modal",
  __ssrInlineRender: true,
  emits: ["close"],
  setup(__props, { expose: __expose, emit: __emit }) {
    const isOpen = ref(false);
    const emit = __emit;
    const openModal = () => {
      isOpen.value = true;
    };
    const closeModal = () => {
      isOpen.value = false;
      emit("close");
    };
    __expose({
      openModal,
      closeModal,
      isOpen
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(isOpen)) {
        _push(`<section${ssrRenderAttrs(mergeProps({ class: "fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black/50" }, _attrs))}><div class="relative p-6 rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto">`);
        _push(ssrRenderComponent(unref(_sfc_main$6), {
          onClick: closeModal,
          class: "absolute text-gray-500 top-4 right-4 hover:text-gray-700"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` \xD7 `);
            } else {
              return [
                createTextVNode(" \xD7 ")
              ];
            }
          }),
          _: 1
        }, _parent));
        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
        _push(`</div></section>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/Modal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Contact",
  __ssrInlineRender: true,
  props: {
    title: { type: String, default: "Contact Me" },
    description: { type: String, default: "" },
    formAction: {
      type: String,
      default: "https://formsubmit.co/7cbfcf8a8143c9f8708006416b2a0aae"
    },
    contactInfo: {
      type: Object,
      default: () => ({})
    },
    imgSrc: {
      type: String,
      default: ""
    },
    socialLinks: {
      type: Array,
      default: () => [
        {
          icon: Linkedin,
          href: "https://www.linkedin.com/in/guillermo-medel-9a4465151/"
        },
        {
          icon: Github,
          href: "https://github.com/M3D3L"
        }
      ]
    }
  },
  setup(__props) {
    const props = __props;
    const videoArray = [
      "https://www.pexels.com/download/video/33792753/",
      "https://www.pexels.com/download/video/32926637/",
      "https://www.pexels.com/download/video/32106032/",
      "https://www.pexels.com/download/video/32104595/"
    ];
    const randomIndex = Math.floor(Math.random() * videoArray.length);
    const form = ref(null);
    const email = ref("");
    const message = ref("");
    const honeypot = ref("");
    const emailError = ref("");
    const messageError = ref("");
    const isSubmitting = ref(false);
    const formMessage = ref("");
    const formMessageClass = ref("");
    const fadeUp = {
      hidden: { opacity: 0, y: 40 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1]
        }
      }
    };
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2
        }
      }
    };
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value) {
        emailError.value = "Email is required";
      } else if (!emailRegex.test(email.value)) {
        emailError.value = "Please enter a valid email address";
      } else {
        emailError.value = "";
      }
    };
    const validateMessage = () => {
      if (!message.value) {
        messageError.value = "Message is required";
      } else if (message.value.length < 10) {
        messageError.value = "Message should be at least 10 characters";
      } else {
        messageError.value = "";
      }
    };
    const validateForm = () => {
      validateEmail();
      validateMessage();
      return !emailError.value && !messageError.value;
    };
    const handleSubmit = async () => {
      if (honeypot.value) {
        formMessage.value = "There was an error submitting your message. Please try again.";
        formMessageClass.value = "bg-destructive/10 text-destructive border border-destructive/20";
        return;
      }
      if (!validateForm()) return;
      isSubmitting.value = true;
      formMessage.value = "";
      try {
        if (props.formAction) {
          const formData = new FormData(form.value);
          formData.append("_captcha", "false");
          formData.append("_template", "table");
          formData.append("_next", (void 0).location.href);
          const response = await fetch(props.formAction, {
            method: "POST",
            body: formData,
            headers: {
              "Accept": "application/json"
            }
          });
          if (response.ok) {
            formMessage.value = "Message sent successfully! We will get back to you soon.";
            formMessageClass.value = "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
            email.value = "";
            message.value = "";
          } else {
            throw new Error("Failed to submit form");
          }
        } else {
          await new Promise((resolve) => setTimeout(resolve, 1500));
          formMessage.value = "Message sent successfully! We will get back to you soon.";
          formMessageClass.value = "bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20";
          email.value = "";
          message.value = "";
        }
      } catch (error) {
        formMessage.value = "There was an error submitting your message. Please try again later.";
        formMessageClass.value = "bg-destructive/10 text-destructive border border-destructive/20";
        console.error("Form submission error:", error);
      } finally {
        isSubmitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_containers_video = _sfc_main$7;
      const _component_TextSectionTitle = _sfc_main$9;
      const _component_ContainersSocials = _sfc_main$d;
      _push(ssrRenderComponent(_component_containers_video, mergeProps({
        id: "contact",
        video: videoArray[unref(randomIndex)],
        title: "",
        description: __props.description,
        class: "w-full min-h-screen"
      }, _attrs), {
        "video-container-content": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$8), { class: "relative w-full py-1 my-8 overflow-hidden" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_TextSectionTitle, {
                    title: __props.title,
                    description: __props.description,
                    imgSrc: __props.imgSrc,
                    h1: false,
                    class: "px-6 pt-6 pb-4 md:px-8"
                  }, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$a), {
                    class: "relative grid grid-cols-1 gap-8 pt-2 lg:grid-cols-2 lg:gap-12",
                    initial: "hidden",
                    animate: "visible",
                    variants: containerVariants
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(motion).div, {
                          variants: fadeUp,
                          class: "px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<form${ssrRenderAttr("action", __props.formAction)} method="POST" class="space-y-6"${_scopeId4}><div class="absolute opacity-0 left-[-9999px]"${_scopeId4}><label for="honeypot"${_scopeId4}>Leave this field empty</label><input id="honeypot"${ssrRenderAttr("value", unref(honeypot))} type="text" name="honeypot" tabindex="-1" autocomplete="off"${_scopeId4}></div><div class="space-y-2"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(_sfc_main$b), {
                                for: "email",
                                class: "text-sm font-semibold text-foreground"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Email Address`);
                                  } else {
                                    return [
                                      createTextVNode("Email Address")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`<div class="relative group"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Mail), { class: "absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" }, null, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$1$1), {
                                id: "email",
                                modelValue: unref(email),
                                "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                                name: "email",
                                type: "email",
                                placeholder: "you@example.com",
                                class: ["w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(emailError) }],
                                required: "",
                                onInput: validateEmail
                              }, null, _parent5, _scopeId4));
                              _push5(`</div>`);
                              if (unref(emailError)) {
                                _push5(`<p class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"${_scopeId4}><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"${_scopeId4}><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId4}></path></svg> ${ssrInterpolate(unref(emailError))}</p>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div><div class="space-y-2"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(_sfc_main$b), {
                                for: "message",
                                class: "text-sm font-semibold text-foreground"
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Message`);
                                  } else {
                                    return [
                                      createTextVNode("Message")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$c), {
                                id: "message",
                                modelValue: unref(message),
                                "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                                name: "message",
                                placeholder: "Tell us about your project or inquiry...",
                                class: ["min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(messageError) }],
                                required: "",
                                onInput: validateMessage
                              }, null, _parent5, _scopeId4));
                              if (unref(messageError)) {
                                _push5(`<p class="flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"${_scopeId4}><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"${_scopeId4}><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"${_scopeId4}></path></svg> ${ssrInterpolate(unref(messageError))}</p>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(`</div>`);
                              if (unref(formMessage)) {
                                _push5(`<div class="${ssrRenderClass([unref(formMessageClass), "p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2"])}"${_scopeId4}><div class="flex items-center gap-2"${_scopeId4}>`);
                                if (unref(formMessageClass).includes("success")) {
                                  _push5(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId4}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"${_scopeId4}></path></svg>`);
                                } else {
                                  _push5(`<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"${_scopeId4}><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"${_scopeId4}></path></svg>`);
                                }
                                _push5(`<span${_scopeId4}>${ssrInterpolate(unref(formMessage))}</span></div></div>`);
                              } else {
                                _push5(`<!---->`);
                              }
                              _push5(ssrRenderComponent(unref(_sfc_main$6), {
                                type: "submit",
                                size: "lg",
                                class: "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                disabled: unref(isSubmitting)
                              }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    if (!unref(isSubmitting)) {
                                      _push6(`<span class="flex items-center justify-center gap-2"${_scopeId5}>`);
                                      _push6(ssrRenderComponent(unref(Mail), { class: "w-5 h-5" }, null, _parent6, _scopeId5));
                                      _push6(` Send Message </span>`);
                                    } else {
                                      _push6(`<span class="flex items-center justify-center gap-2"${_scopeId5}><svg class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"${_scopeId5}><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"${_scopeId5}></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"${_scopeId5}></path></svg> Sending... </span>`);
                                    }
                                  } else {
                                    return [
                                      !unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "flex items-center justify-center gap-2"
                                      }, [
                                        createVNode(unref(Mail), { class: "w-5 h-5" }),
                                        createTextVNode(" Send Message ")
                                      ])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "flex items-center justify-center gap-2"
                                      }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5 animate-spin",
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "none",
                                          viewBox: "0 0 24 24"
                                        }, [
                                          createVNode("circle", {
                                            class: "opacity-25",
                                            cx: "12",
                                            cy: "12",
                                            r: "10",
                                            stroke: "currentColor",
                                            "stroke-width": "4"
                                          }),
                                          createVNode("path", {
                                            class: "opacity-75",
                                            fill: "currentColor",
                                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          })
                                        ])),
                                        createTextVNode(" Sending... ")
                                      ]))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                              _push5(`</form>`);
                            } else {
                              return [
                                createVNode("form", {
                                  ref_key: "form",
                                  ref: form,
                                  action: __props.formAction,
                                  method: "POST",
                                  class: "space-y-6",
                                  onSubmit: withModifiers(handleSubmit, ["prevent"])
                                }, [
                                  createVNode("div", { class: "absolute opacity-0 left-[-9999px]" }, [
                                    createVNode("label", { for: "honeypot" }, "Leave this field empty"),
                                    withDirectives(createVNode("input", {
                                      id: "honeypot",
                                      "onUpdate:modelValue": ($event) => isRef(honeypot) ? honeypot.value = $event : null,
                                      type: "text",
                                      name: "honeypot",
                                      tabindex: "-1",
                                      autocomplete: "off"
                                    }, null, 8, ["onUpdate:modelValue"]), [
                                      [vModelText, unref(honeypot)]
                                    ])
                                  ]),
                                  createVNode("div", { class: "space-y-2" }, [
                                    createVNode(unref(_sfc_main$b), {
                                      for: "email",
                                      class: "text-sm font-semibold text-foreground"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Email Address")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "relative group" }, [
                                      createVNode(unref(Mail), { class: "absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" }),
                                      createVNode(unref(_sfc_main$1$1), {
                                        id: "email",
                                        modelValue: unref(email),
                                        "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                                        name: "email",
                                        type: "email",
                                        placeholder: "you@example.com",
                                        class: ["w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(emailError) }],
                                        required: "",
                                        onInput: validateEmail
                                      }, null, 8, ["modelValue", "onUpdate:modelValue", "class"])
                                    ]),
                                    unref(emailError) ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-4 h-4",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20"
                                      }, [
                                        createVNode("path", {
                                          "fill-rule": "evenodd",
                                          d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                          "clip-rule": "evenodd"
                                        })
                                      ])),
                                      createTextVNode(" " + toDisplayString(unref(emailError)), 1)
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  createVNode("div", { class: "space-y-2" }, [
                                    createVNode(unref(_sfc_main$b), {
                                      for: "message",
                                      class: "text-sm font-semibold text-foreground"
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode("Message")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$c), {
                                      id: "message",
                                      modelValue: unref(message),
                                      "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                                      name: "message",
                                      placeholder: "Tell us about your project or inquiry...",
                                      class: ["min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(messageError) }],
                                      required: "",
                                      onInput: validateMessage
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                    unref(messageError) ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-4 h-4",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20"
                                      }, [
                                        createVNode("path", {
                                          "fill-rule": "evenodd",
                                          d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                          "clip-rule": "evenodd"
                                        })
                                      ])),
                                      createTextVNode(" " + toDisplayString(unref(messageError)), 1)
                                    ])) : createCommentVNode("", true)
                                  ]),
                                  unref(formMessage) ? (openBlock(), createBlock("div", {
                                    key: 0,
                                    class: ["p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2", unref(formMessageClass)]
                                  }, [
                                    createVNode("div", { class: "flex items-center gap-2" }, [
                                      unref(formMessageClass).includes("success") ? (openBlock(), createBlock("svg", {
                                        key: 0,
                                        class: "w-5 h-5",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20"
                                      }, [
                                        createVNode("path", {
                                          "fill-rule": "evenodd",
                                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                          "clip-rule": "evenodd"
                                        })
                                      ])) : (openBlock(), createBlock("svg", {
                                        key: 1,
                                        class: "w-5 h-5",
                                        fill: "currentColor",
                                        viewBox: "0 0 20 20"
                                      }, [
                                        createVNode("path", {
                                          "fill-rule": "evenodd",
                                          d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                          "clip-rule": "evenodd"
                                        })
                                      ])),
                                      createVNode("span", null, toDisplayString(unref(formMessage)), 1)
                                    ])
                                  ], 2)) : createCommentVNode("", true),
                                  createVNode(unref(_sfc_main$6), {
                                    type: "submit",
                                    size: "lg",
                                    class: "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                    disabled: unref(isSubmitting)
                                  }, {
                                    default: withCtx(() => [
                                      !unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                        key: 0,
                                        class: "flex items-center justify-center gap-2"
                                      }, [
                                        createVNode(unref(Mail), { class: "w-5 h-5" }),
                                        createTextVNode(" Send Message ")
                                      ])) : (openBlock(), createBlock("span", {
                                        key: 1,
                                        class: "flex items-center justify-center gap-2"
                                      }, [
                                        (openBlock(), createBlock("svg", {
                                          class: "w-5 h-5 animate-spin",
                                          xmlns: "http://www.w3.org/2000/svg",
                                          fill: "none",
                                          viewBox: "0 0 24 24"
                                        }, [
                                          createVNode("circle", {
                                            class: "opacity-25",
                                            cx: "12",
                                            cy: "12",
                                            r: "10",
                                            stroke: "currentColor",
                                            "stroke-width": "4"
                                          }),
                                          createVNode("path", {
                                            class: "opacity-75",
                                            fill: "currentColor",
                                            d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                          })
                                        ])),
                                        createTextVNode(" Sending... ")
                                      ]))
                                    ]),
                                    _: 1
                                  }, 8, ["disabled"])
                                ], 40, ["action"])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(motion).div, {
                          variants: fadeUp,
                          class: "space-y-8"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            var _a, _b, _c, _d, _e, _f, _g, _h;
                            if (_push5) {
                              _push5(`<div class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40"${_scopeId4}><h3 class="mb-2 text-2xl font-bold"${_scopeId4}>Get in Touch</h3><p class="text-sm leading-relaxed text-muted-foreground"${_scopeId4}> Fill out the form or reach out directly through these channels. We&#39;ll get back to you as soon as possible. </p></div><div class="space-y-4"${_scopeId4}><a${ssrRenderAttr("href", `mailto:${(_a = __props.contactInfo) == null ? void 0 : _a.email}`)} class="flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"${_scopeId4}><div class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Mail), { class: "w-6 h-6 text-primary" }, null, _parent5, _scopeId4));
                              _push5(`</div><div${_scopeId4}><p class="mb-1 text-base font-semibold"${_scopeId4}>Email</p><p class="text-sm transition-colors text-muted-foreground group-hover:text-primary"${_scopeId4}>${ssrInterpolate((_b = __props.contactInfo) == null ? void 0 : _b.email)}</p></div></a><a${ssrRenderAttr("href", `tel:${(_c = __props.contactInfo) == null ? void 0 : _c.phone}`)} class="flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"${_scopeId4}><div class="flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"${_scopeId4}>`);
                              _push5(ssrRenderComponent(unref(Phone), { class: "w-6 h-6 text-primary" }, null, _parent5, _scopeId4));
                              _push5(`</div><div${_scopeId4}><p class="mb-1 text-base font-semibold"${_scopeId4}>Phone</p><p class="text-sm transition-colors text-muted-foreground group-hover:text-primary"${_scopeId4}>${ssrInterpolate((_d = __props.contactInfo) == null ? void 0 : _d.phone)}</p></div></a></div><div class="p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40"${_scopeId4}><h3 class="mb-4 text-xl font-bold"${_scopeId4}>Follow Us</h3>`);
                              _push5(ssrRenderComponent(_component_ContainersSocials, { socialLinks: __props.socialLinks }, null, _parent5, _scopeId4));
                              _push5(`</div>`);
                            } else {
                              return [
                                createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                  createVNode("h3", { class: "mb-2 text-2xl font-bold" }, "Get in Touch"),
                                  createVNode("p", { class: "text-sm leading-relaxed text-muted-foreground" }, " Fill out the form or reach out directly through these channels. We'll get back to you as soon as possible. ")
                                ]),
                                createVNode("div", { class: "space-y-4" }, [
                                  createVNode("a", {
                                    href: `mailto:${(_e = __props.contactInfo) == null ? void 0 : _e.email}`,
                                    class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                  }, [
                                    createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                      createVNode(unref(Mail), { class: "w-6 h-6 text-primary" })
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("p", { class: "mb-1 text-base font-semibold" }, "Email"),
                                      createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_f = __props.contactInfo) == null ? void 0 : _f.email), 1)
                                    ])
                                  ], 8, ["href"]),
                                  createVNode("a", {
                                    href: `tel:${(_g = __props.contactInfo) == null ? void 0 : _g.phone}`,
                                    class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                  }, [
                                    createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                      createVNode(unref(Phone), { class: "w-6 h-6 text-primary" })
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("p", { class: "mb-1 text-base font-semibold" }, "Phone"),
                                      createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_h = __props.contactInfo) == null ? void 0 : _h.phone), 1)
                                    ])
                                  ], 8, ["href"])
                                ]),
                                createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                  createVNode("h3", { class: "mb-4 text-xl font-bold" }, "Follow Us"),
                                  createVNode(_component_ContainersSocials, { socialLinks: __props.socialLinks }, null, 8, ["socialLinks"])
                                ])
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(motion).div, {
                            variants: fadeUp,
                            class: "px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm"
                          }, {
                            default: withCtx(() => [
                              createVNode("form", {
                                ref_key: "form",
                                ref: form,
                                action: __props.formAction,
                                method: "POST",
                                class: "space-y-6",
                                onSubmit: withModifiers(handleSubmit, ["prevent"])
                              }, [
                                createVNode("div", { class: "absolute opacity-0 left-[-9999px]" }, [
                                  createVNode("label", { for: "honeypot" }, "Leave this field empty"),
                                  withDirectives(createVNode("input", {
                                    id: "honeypot",
                                    "onUpdate:modelValue": ($event) => isRef(honeypot) ? honeypot.value = $event : null,
                                    type: "text",
                                    name: "honeypot",
                                    tabindex: "-1",
                                    autocomplete: "off"
                                  }, null, 8, ["onUpdate:modelValue"]), [
                                    [vModelText, unref(honeypot)]
                                  ])
                                ]),
                                createVNode("div", { class: "space-y-2" }, [
                                  createVNode(unref(_sfc_main$b), {
                                    for: "email",
                                    class: "text-sm font-semibold text-foreground"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Email Address")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "relative group" }, [
                                    createVNode(unref(Mail), { class: "absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" }),
                                    createVNode(unref(_sfc_main$1$1), {
                                      id: "email",
                                      modelValue: unref(email),
                                      "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                                      name: "email",
                                      type: "email",
                                      placeholder: "you@example.com",
                                      class: ["w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(emailError) }],
                                      required: "",
                                      onInput: validateEmail
                                    }, null, 8, ["modelValue", "onUpdate:modelValue", "class"])
                                  ]),
                                  unref(emailError) ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-4 h-4",
                                      fill: "currentColor",
                                      viewBox: "0 0 20 20"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                        "clip-rule": "evenodd"
                                      })
                                    ])),
                                    createTextVNode(" " + toDisplayString(unref(emailError)), 1)
                                  ])) : createCommentVNode("", true)
                                ]),
                                createVNode("div", { class: "space-y-2" }, [
                                  createVNode(unref(_sfc_main$b), {
                                    for: "message",
                                    class: "text-sm font-semibold text-foreground"
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode("Message")
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(_sfc_main$c), {
                                    id: "message",
                                    modelValue: unref(message),
                                    "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                                    name: "message",
                                    placeholder: "Tell us about your project or inquiry...",
                                    class: ["min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(messageError) }],
                                    required: "",
                                    onInput: validateMessage
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                  unref(messageError) ? (openBlock(), createBlock("p", {
                                    key: 0,
                                    class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-4 h-4",
                                      fill: "currentColor",
                                      viewBox: "0 0 20 20"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                        "clip-rule": "evenodd"
                                      })
                                    ])),
                                    createTextVNode(" " + toDisplayString(unref(messageError)), 1)
                                  ])) : createCommentVNode("", true)
                                ]),
                                unref(formMessage) ? (openBlock(), createBlock("div", {
                                  key: 0,
                                  class: ["p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2", unref(formMessageClass)]
                                }, [
                                  createVNode("div", { class: "flex items-center gap-2" }, [
                                    unref(formMessageClass).includes("success") ? (openBlock(), createBlock("svg", {
                                      key: 0,
                                      class: "w-5 h-5",
                                      fill: "currentColor",
                                      viewBox: "0 0 20 20"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                        "clip-rule": "evenodd"
                                      })
                                    ])) : (openBlock(), createBlock("svg", {
                                      key: 1,
                                      class: "w-5 h-5",
                                      fill: "currentColor",
                                      viewBox: "0 0 20 20"
                                    }, [
                                      createVNode("path", {
                                        "fill-rule": "evenodd",
                                        d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                        "clip-rule": "evenodd"
                                      })
                                    ])),
                                    createVNode("span", null, toDisplayString(unref(formMessage)), 1)
                                  ])
                                ], 2)) : createCommentVNode("", true),
                                createVNode(unref(_sfc_main$6), {
                                  type: "submit",
                                  size: "lg",
                                  class: "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                  disabled: unref(isSubmitting)
                                }, {
                                  default: withCtx(() => [
                                    !unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                      key: 0,
                                      class: "flex items-center justify-center gap-2"
                                    }, [
                                      createVNode(unref(Mail), { class: "w-5 h-5" }),
                                      createTextVNode(" Send Message ")
                                    ])) : (openBlock(), createBlock("span", {
                                      key: 1,
                                      class: "flex items-center justify-center gap-2"
                                    }, [
                                      (openBlock(), createBlock("svg", {
                                        class: "w-5 h-5 animate-spin",
                                        xmlns: "http://www.w3.org/2000/svg",
                                        fill: "none",
                                        viewBox: "0 0 24 24"
                                      }, [
                                        createVNode("circle", {
                                          class: "opacity-25",
                                          cx: "12",
                                          cy: "12",
                                          r: "10",
                                          stroke: "currentColor",
                                          "stroke-width": "4"
                                        }),
                                        createVNode("path", {
                                          class: "opacity-75",
                                          fill: "currentColor",
                                          d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        })
                                      ])),
                                      createTextVNode(" Sending... ")
                                    ]))
                                  ]),
                                  _: 1
                                }, 8, ["disabled"])
                              ], 40, ["action"])
                            ]),
                            _: 1
                          }),
                          createVNode(unref(motion).div, {
                            variants: fadeUp,
                            class: "space-y-8"
                          }, {
                            default: withCtx(() => {
                              var _a, _b, _c, _d;
                              return [
                                createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                  createVNode("h3", { class: "mb-2 text-2xl font-bold" }, "Get in Touch"),
                                  createVNode("p", { class: "text-sm leading-relaxed text-muted-foreground" }, " Fill out the form or reach out directly through these channels. We'll get back to you as soon as possible. ")
                                ]),
                                createVNode("div", { class: "space-y-4" }, [
                                  createVNode("a", {
                                    href: `mailto:${(_a = __props.contactInfo) == null ? void 0 : _a.email}`,
                                    class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                  }, [
                                    createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                      createVNode(unref(Mail), { class: "w-6 h-6 text-primary" })
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("p", { class: "mb-1 text-base font-semibold" }, "Email"),
                                      createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_b = __props.contactInfo) == null ? void 0 : _b.email), 1)
                                    ])
                                  ], 8, ["href"]),
                                  createVNode("a", {
                                    href: `tel:${(_c = __props.contactInfo) == null ? void 0 : _c.phone}`,
                                    class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                  }, [
                                    createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                      createVNode(unref(Phone), { class: "w-6 h-6 text-primary" })
                                    ]),
                                    createVNode("div", null, [
                                      createVNode("p", { class: "mb-1 text-base font-semibold" }, "Phone"),
                                      createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_d = __props.contactInfo) == null ? void 0 : _d.phone), 1)
                                    ])
                                  ], 8, ["href"])
                                ]),
                                createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                  createVNode("h3", { class: "mb-4 text-xl font-bold" }, "Follow Us"),
                                  createVNode(_component_ContainersSocials, { socialLinks: __props.socialLinks }, null, 8, ["socialLinks"])
                                ])
                              ];
                            }),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_TextSectionTitle, {
                      title: __props.title,
                      description: __props.description,
                      imgSrc: __props.imgSrc,
                      h1: false,
                      class: "px-6 pt-6 pb-4 md:px-8"
                    }, null, 8, ["title", "description", "imgSrc"]),
                    createVNode(unref(_sfc_main$a), {
                      class: "relative grid grid-cols-1 gap-8 pt-2 lg:grid-cols-2 lg:gap-12",
                      initial: "hidden",
                      animate: "visible",
                      variants: containerVariants
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(motion).div, {
                          variants: fadeUp,
                          class: "px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm"
                        }, {
                          default: withCtx(() => [
                            createVNode("form", {
                              ref_key: "form",
                              ref: form,
                              action: __props.formAction,
                              method: "POST",
                              class: "space-y-6",
                              onSubmit: withModifiers(handleSubmit, ["prevent"])
                            }, [
                              createVNode("div", { class: "absolute opacity-0 left-[-9999px]" }, [
                                createVNode("label", { for: "honeypot" }, "Leave this field empty"),
                                withDirectives(createVNode("input", {
                                  id: "honeypot",
                                  "onUpdate:modelValue": ($event) => isRef(honeypot) ? honeypot.value = $event : null,
                                  type: "text",
                                  name: "honeypot",
                                  tabindex: "-1",
                                  autocomplete: "off"
                                }, null, 8, ["onUpdate:modelValue"]), [
                                  [vModelText, unref(honeypot)]
                                ])
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$b), {
                                  for: "email",
                                  class: "text-sm font-semibold text-foreground"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Email Address")
                                  ]),
                                  _: 1
                                }),
                                createVNode("div", { class: "relative group" }, [
                                  createVNode(unref(Mail), { class: "absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" }),
                                  createVNode(unref(_sfc_main$1$1), {
                                    id: "email",
                                    modelValue: unref(email),
                                    "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                                    name: "email",
                                    type: "email",
                                    placeholder: "you@example.com",
                                    class: ["w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(emailError) }],
                                    required: "",
                                    onInput: validateEmail
                                  }, null, 8, ["modelValue", "onUpdate:modelValue", "class"])
                                ]),
                                unref(emailError) ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-4 h-4",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20"
                                  }, [
                                    createVNode("path", {
                                      "fill-rule": "evenodd",
                                      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                      "clip-rule": "evenodd"
                                    })
                                  ])),
                                  createTextVNode(" " + toDisplayString(unref(emailError)), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              createVNode("div", { class: "space-y-2" }, [
                                createVNode(unref(_sfc_main$b), {
                                  for: "message",
                                  class: "text-sm font-semibold text-foreground"
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode("Message")
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(_sfc_main$c), {
                                  id: "message",
                                  modelValue: unref(message),
                                  "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                                  name: "message",
                                  placeholder: "Tell us about your project or inquiry...",
                                  class: ["min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(messageError) }],
                                  required: "",
                                  onInput: validateMessage
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                                unref(messageError) ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-4 h-4",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20"
                                  }, [
                                    createVNode("path", {
                                      "fill-rule": "evenodd",
                                      d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                      "clip-rule": "evenodd"
                                    })
                                  ])),
                                  createTextVNode(" " + toDisplayString(unref(messageError)), 1)
                                ])) : createCommentVNode("", true)
                              ]),
                              unref(formMessage) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: ["p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2", unref(formMessageClass)]
                              }, [
                                createVNode("div", { class: "flex items-center gap-2" }, [
                                  unref(formMessageClass).includes("success") ? (openBlock(), createBlock("svg", {
                                    key: 0,
                                    class: "w-5 h-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20"
                                  }, [
                                    createVNode("path", {
                                      "fill-rule": "evenodd",
                                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                      "clip-rule": "evenodd"
                                    })
                                  ])) : (openBlock(), createBlock("svg", {
                                    key: 1,
                                    class: "w-5 h-5",
                                    fill: "currentColor",
                                    viewBox: "0 0 20 20"
                                  }, [
                                    createVNode("path", {
                                      "fill-rule": "evenodd",
                                      d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                      "clip-rule": "evenodd"
                                    })
                                  ])),
                                  createVNode("span", null, toDisplayString(unref(formMessage)), 1)
                                ])
                              ], 2)) : createCommentVNode("", true),
                              createVNode(unref(_sfc_main$6), {
                                type: "submit",
                                size: "lg",
                                class: "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                                disabled: unref(isSubmitting)
                              }, {
                                default: withCtx(() => [
                                  !unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                    key: 0,
                                    class: "flex items-center justify-center gap-2"
                                  }, [
                                    createVNode(unref(Mail), { class: "w-5 h-5" }),
                                    createTextVNode(" Send Message ")
                                  ])) : (openBlock(), createBlock("span", {
                                    key: 1,
                                    class: "flex items-center justify-center gap-2"
                                  }, [
                                    (openBlock(), createBlock("svg", {
                                      class: "w-5 h-5 animate-spin",
                                      xmlns: "http://www.w3.org/2000/svg",
                                      fill: "none",
                                      viewBox: "0 0 24 24"
                                    }, [
                                      createVNode("circle", {
                                        class: "opacity-25",
                                        cx: "12",
                                        cy: "12",
                                        r: "10",
                                        stroke: "currentColor",
                                        "stroke-width": "4"
                                      }),
                                      createVNode("path", {
                                        class: "opacity-75",
                                        fill: "currentColor",
                                        d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      })
                                    ])),
                                    createTextVNode(" Sending... ")
                                  ]))
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ], 40, ["action"])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(motion).div, {
                          variants: fadeUp,
                          class: "space-y-8"
                        }, {
                          default: withCtx(() => {
                            var _a, _b, _c, _d;
                            return [
                              createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                createVNode("h3", { class: "mb-2 text-2xl font-bold" }, "Get in Touch"),
                                createVNode("p", { class: "text-sm leading-relaxed text-muted-foreground" }, " Fill out the form or reach out directly through these channels. We'll get back to you as soon as possible. ")
                              ]),
                              createVNode("div", { class: "space-y-4" }, [
                                createVNode("a", {
                                  href: `mailto:${(_a = __props.contactInfo) == null ? void 0 : _a.email}`,
                                  class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                }, [
                                  createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                    createVNode(unref(Mail), { class: "w-6 h-6 text-primary" })
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("p", { class: "mb-1 text-base font-semibold" }, "Email"),
                                    createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_b = __props.contactInfo) == null ? void 0 : _b.email), 1)
                                  ])
                                ], 8, ["href"]),
                                createVNode("a", {
                                  href: `tel:${(_c = __props.contactInfo) == null ? void 0 : _c.phone}`,
                                  class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                                }, [
                                  createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                    createVNode(unref(Phone), { class: "w-6 h-6 text-primary" })
                                  ]),
                                  createVNode("div", null, [
                                    createVNode("p", { class: "mb-1 text-base font-semibold" }, "Phone"),
                                    createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_d = __props.contactInfo) == null ? void 0 : _d.phone), 1)
                                  ])
                                ], 8, ["href"])
                              ]),
                              createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                                createVNode("h3", { class: "mb-4 text-xl font-bold" }, "Follow Us"),
                                createVNode(_component_ContainersSocials, { socialLinks: __props.socialLinks }, null, 8, ["socialLinks"])
                              ])
                            ];
                          }),
                          _: 1
                        })
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
              createVNode(unref(_sfc_main$8), { class: "relative w-full py-1 my-8 overflow-hidden" }, {
                default: withCtx(() => [
                  createVNode(_component_TextSectionTitle, {
                    title: __props.title,
                    description: __props.description,
                    imgSrc: __props.imgSrc,
                    h1: false,
                    class: "px-6 pt-6 pb-4 md:px-8"
                  }, null, 8, ["title", "description", "imgSrc"]),
                  createVNode(unref(_sfc_main$a), {
                    class: "relative grid grid-cols-1 gap-8 pt-2 lg:grid-cols-2 lg:gap-12",
                    initial: "hidden",
                    animate: "visible",
                    variants: containerVariants
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(motion).div, {
                        variants: fadeUp,
                        class: "px-6 py-8 border shadow-lg rounded-xl md:px-8 border-border/40 bg-card/50 backdrop-blur-sm"
                      }, {
                        default: withCtx(() => [
                          createVNode("form", {
                            ref_key: "form",
                            ref: form,
                            action: __props.formAction,
                            method: "POST",
                            class: "space-y-6",
                            onSubmit: withModifiers(handleSubmit, ["prevent"])
                          }, [
                            createVNode("div", { class: "absolute opacity-0 left-[-9999px]" }, [
                              createVNode("label", { for: "honeypot" }, "Leave this field empty"),
                              withDirectives(createVNode("input", {
                                id: "honeypot",
                                "onUpdate:modelValue": ($event) => isRef(honeypot) ? honeypot.value = $event : null,
                                type: "text",
                                name: "honeypot",
                                tabindex: "-1",
                                autocomplete: "off"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(honeypot)]
                              ])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$b), {
                                for: "email",
                                class: "text-sm font-semibold text-foreground"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Email Address")
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "relative group" }, [
                                createVNode(unref(Mail), { class: "absolute w-5 h-5 transition-colors -translate-y-1/2 left-3 top-1/2 text-muted-foreground group-focus-within:text-primary" }),
                                createVNode(unref(_sfc_main$1$1), {
                                  id: "email",
                                  modelValue: unref(email),
                                  "onUpdate:modelValue": ($event) => isRef(email) ? email.value = $event : null,
                                  name: "email",
                                  type: "email",
                                  placeholder: "you@example.com",
                                  class: ["w-full py-3 pl-10 pr-4 transition-all duration-300 border rounded-lg border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(emailError) }],
                                  required: "",
                                  onInput: validateEmail
                                }, null, 8, ["modelValue", "onUpdate:modelValue", "class"])
                              ]),
                              unref(emailError) ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4",
                                  fill: "currentColor",
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", {
                                    "fill-rule": "evenodd",
                                    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                    "clip-rule": "evenodd"
                                  })
                                ])),
                                createTextVNode(" " + toDisplayString(unref(emailError)), 1)
                              ])) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$b), {
                                for: "message",
                                class: "text-sm font-semibold text-foreground"
                              }, {
                                default: withCtx(() => [
                                  createTextVNode("Message")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$c), {
                                id: "message",
                                modelValue: unref(message),
                                "onUpdate:modelValue": ($event) => isRef(message) ? message.value = $event : null,
                                name: "message",
                                placeholder: "Tell us about your project or inquiry...",
                                class: ["min-h-[140px] rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none hover:border-primary/50", { "border-destructive focus:ring-destructive/20 focus:border-destructive": unref(messageError) }],
                                required: "",
                                onInput: validateMessage
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "class"]),
                              unref(messageError) ? (openBlock(), createBlock("p", {
                                key: 0,
                                class: "flex items-center gap-1 mt-1 text-sm text-destructive animate-in fade-in slide-in-from-top-1"
                              }, [
                                (openBlock(), createBlock("svg", {
                                  class: "w-4 h-4",
                                  fill: "currentColor",
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", {
                                    "fill-rule": "evenodd",
                                    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z",
                                    "clip-rule": "evenodd"
                                  })
                                ])),
                                createTextVNode(" " + toDisplayString(unref(messageError)), 1)
                              ])) : createCommentVNode("", true)
                            ]),
                            unref(formMessage) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: ["p-4 text-sm rounded-lg animate-in fade-in slide-in-from-top-2", unref(formMessageClass)]
                            }, [
                              createVNode("div", { class: "flex items-center gap-2" }, [
                                unref(formMessageClass).includes("success") ? (openBlock(), createBlock("svg", {
                                  key: 0,
                                  class: "w-5 h-5",
                                  fill: "currentColor",
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", {
                                    "fill-rule": "evenodd",
                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z",
                                    "clip-rule": "evenodd"
                                  })
                                ])) : (openBlock(), createBlock("svg", {
                                  key: 1,
                                  class: "w-5 h-5",
                                  fill: "currentColor",
                                  viewBox: "0 0 20 20"
                                }, [
                                  createVNode("path", {
                                    "fill-rule": "evenodd",
                                    d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z",
                                    "clip-rule": "evenodd"
                                  })
                                ])),
                                createVNode("span", null, toDisplayString(unref(formMessage)), 1)
                              ])
                            ], 2)) : createCommentVNode("", true),
                            createVNode(unref(_sfc_main$6), {
                              type: "submit",
                              size: "lg",
                              class: "w-full h-12 text-base font-semibold transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
                              disabled: unref(isSubmitting)
                            }, {
                              default: withCtx(() => [
                                !unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "flex items-center justify-center gap-2"
                                }, [
                                  createVNode(unref(Mail), { class: "w-5 h-5" }),
                                  createTextVNode(" Send Message ")
                                ])) : (openBlock(), createBlock("span", {
                                  key: 1,
                                  class: "flex items-center justify-center gap-2"
                                }, [
                                  (openBlock(), createBlock("svg", {
                                    class: "w-5 h-5 animate-spin",
                                    xmlns: "http://www.w3.org/2000/svg",
                                    fill: "none",
                                    viewBox: "0 0 24 24"
                                  }, [
                                    createVNode("circle", {
                                      class: "opacity-25",
                                      cx: "12",
                                      cy: "12",
                                      r: "10",
                                      stroke: "currentColor",
                                      "stroke-width": "4"
                                    }),
                                    createVNode("path", {
                                      class: "opacity-75",
                                      fill: "currentColor",
                                      d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    })
                                  ])),
                                  createTextVNode(" Sending... ")
                                ]))
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ], 40, ["action"])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(motion).div, {
                        variants: fadeUp,
                        class: "space-y-8"
                      }, {
                        default: withCtx(() => {
                          var _a, _b, _c, _d;
                          return [
                            createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                              createVNode("h3", { class: "mb-2 text-2xl font-bold" }, "Get in Touch"),
                              createVNode("p", { class: "text-sm leading-relaxed text-muted-foreground" }, " Fill out the form or reach out directly through these channels. We'll get back to you as soon as possible. ")
                            ]),
                            createVNode("div", { class: "space-y-4" }, [
                              createVNode("a", {
                                href: `mailto:${(_a = __props.contactInfo) == null ? void 0 : _a.email}`,
                                class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                              }, [
                                createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                  createVNode(unref(Mail), { class: "w-6 h-6 text-primary" })
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "mb-1 text-base font-semibold" }, "Email"),
                                  createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_b = __props.contactInfo) == null ? void 0 : _b.email), 1)
                                ])
                              ], 8, ["href"]),
                              createVNode("a", {
                                href: `tel:${(_c = __props.contactInfo) == null ? void 0 : _c.phone}`,
                                class: "flex items-start gap-4 p-5 transition-all duration-300 rounded-xl bg-card/30 backdrop-blur-sm border border-border/40 hover:border-primary/40 hover:shadow-lg hover:scale-[1.02] group"
                              }, [
                                createVNode("div", { class: "flex-shrink-0 p-3 transition-all duration-300 rounded-lg bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110" }, [
                                  createVNode(unref(Phone), { class: "w-6 h-6 text-primary" })
                                ]),
                                createVNode("div", null, [
                                  createVNode("p", { class: "mb-1 text-base font-semibold" }, "Phone"),
                                  createVNode("p", { class: "text-sm transition-colors text-muted-foreground group-hover:text-primary" }, toDisplayString((_d = __props.contactInfo) == null ? void 0 : _d.phone), 1)
                                ])
                              ], 8, ["href"])
                            ]),
                            createVNode("div", { class: "p-6 border rounded-xl bg-card/30 backdrop-blur-sm border-border/40" }, [
                              createVNode("h3", { class: "mb-4 text-xl font-bold" }, "Follow Us"),
                              createVNode(_component_ContainersSocials, { socialLinks: __props.socialLinks }, null, 8, ["socialLinks"])
                            ])
                          ];
                        }),
                        _: 1
                      })
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
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/Contact.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "TheFooter",
  __ssrInlineRender: true,
  props: {
    socials: {},
    type: {},
    contactInfo: {},
    links: {}
  },
  setup(__props) {
    usePocketBaseCore();
    ref(null);
    const localFooterColumns = ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_ContainersSocials = _sfc_main$d;
      const _component_AtomsStyledLink = __nuxt_component_1;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" }, _attrs))}><div class="container flex flex-col gap-12 px-4 py-16 mx-auto lg:px-6"><div class="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"><div class="flex flex-col gap-6 sm:col-span-2 lg:col-span-1"><div class="flex flex-col gap-3"><h3 class="text-lg font-bold text-foreground">${ssrInterpolate((_a = _ctx.contactInfo) == null ? void 0 : _a.siteName)}</h3><p class="text-sm leading-relaxed text-muted-foreground">${ssrInterpolate((_b = _ctx.contactInfo) == null ? void 0 : _b.slogan)}</p></div><div class="flex flex-col gap-3"><p class="text-xs font-semibold tracking-wide uppercase text-foreground/60"> Connect With Us </p>`);
      _push(ssrRenderComponent(_component_ContainersSocials, { socialLinks: _ctx.socials }, null, _parent));
      _push(`</div></div><!--[-->`);
      ssrRenderList(unref(localFooterColumns), (column, colIndex) => {
        _push(`<div class="flex flex-col gap-4"><h3 class="text-sm font-semibold tracking-wide uppercase text-foreground/80">${ssrInterpolate(column.title)}</h3><div class="flex flex-col gap-2.5"><!--[-->`);
        ssrRenderList(column.links, (link, linkIndex) => {
          _push(ssrRenderComponent(_component_AtomsStyledLink, {
            key: linkIndex,
            to: link.href,
            title: link.label
          }, null, _parent));
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div><div class="relative w-full h-px overflow-hidden bg-border/40"><div class="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div></div><div class="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left"><p class="text-sm text-muted-foreground"> \xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} <span class="font-medium text-foreground">${ssrInterpolate((_c = _ctx.contactInfo) == null ? void 0 : _c.siteName)}</span> . All rights reserved. </p><div class="flex flex-wrap items-center justify-center gap-6"><!--[-->`);
      ssrRenderList(_ctx.links || [], (link, index) => {
        _push(ssrRenderComponent(_component_AtomsStyledLink, {
          key: index,
          to: link.href,
          title: link.label
        }, null, _parent));
      });
      _push(`<!--]--></div></div><div class="flex justify-center pt-6"><button class="p-3 transition-all rounded-full bg-accent/50 hover:bg-accent hover:scale-110 active:scale-95 group" aria-label="Back to top"><svg class="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg></button></div></div></footer>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/TheFooter.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "BaseFooter",
  __ssrInlineRender: true,
  props: {
    socials: {
      type: Array,
      default: () => []
    },
    contactInfo: {
      type: Object,
      default: () => ({})
    },
    siteMap: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_TheFooter = _sfc_main$2;
      _push(ssrRenderComponent(_component_TheFooter, mergeProps({
        links: __props.siteMap,
        contactInfo: __props.contactInfo,
        socials: __props.socials,
        type: "relocateBlog"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/organisms/BaseFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const isBlogPage = computed(() => {
      return route.path === "/blog/" || route.path.startsWith("/blog");
    });
    const isOnBoadrdingPage = computed(() => {
      return route.path === "/onboarding" || route.path.startsWith("/onboarding");
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_TheNavbar = _sfc_main$5;
      const _component_SectionsModal = _sfc_main$4;
      const _component_SectionsBlogColumn = __nuxt_component_2;
      const _component_SectionsContact = _sfc_main$3;
      const _component_OrganismsBaseFooter = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative flex flex-col min-h-screen mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_TheNavbar, {
        links: unref(siteMap),
        siteName: (_a = unref(contactInfo)) == null ? void 0 : _a.siteName
      }, null, _parent));
      _push(ssrRenderComponent(_component_SectionsModal, null, null, _parent));
      _push(`<main class="w-full">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (!unref(isBlogPage) && !unref(isOnBoadrdingPage)) {
        _push(ssrRenderComponent(_component_SectionsBlogColumn, mergeProps({
          class: "pb-16",
          showPagination: false,
          type: "relocateBlog"
        }, unref(blogSection)), null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_SectionsContact, mergeProps({
        contactInfo: unref(contactInfo),
        "social-links": unref(socials)
      }, unref(contactSection)), null, _parent));
      _push(`<a href="https://calendly.com/brendaaigsc/30min" target="_blank" rel="noopener noreferrer" class="fixed z-50 bottom-4 px-4 py-2 right-4 flex gap-4 items-center bg-primary text-primary-foreground rounded-lg whitespace-nowrap shadow-lg"><p>Schedule a Call</p></a>`);
      _push(ssrRenderComponent(_component_OrganismsBaseFooter, {
        links: unref(siteMap),
        contactInfo: unref(contactInfo),
        socials: unref(socials)
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-C41jdjv7.mjs.map
