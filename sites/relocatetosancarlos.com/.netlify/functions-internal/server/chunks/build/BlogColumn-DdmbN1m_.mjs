import { _ as _sfc_main$7 } from './SectionTitle-BDfWxJKH.mjs';
import { defineComponent, ref, watch, mergeProps, unref, withCtx, createTextVNode, createVNode, createBlock, openBlock, Fragment, renderList, renderSlot, toDisplayString, createCommentVNode, withModifiers, withDirectives, vModelCheckbox, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderSlot, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrRenderClass } from 'vue/server-renderer';
import { m as motion } from './index-D_6hfEP1.mjs';
import { _ as _sfc_main$9 } from './BlogHorizontal-Cr5Z5_WB.mjs';
import { _ as _sfc_main$a } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$b } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$d } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$c, a as _sfc_main$1$1 } from './Label-NdntEGti.mjs';
import { ShieldCheck, Lock } from 'lucide-vue-next';
import { a as usePocketBaseCore, c as useRoute } from './server.mjs';
import { _ as _sfc_main$1$2, a as _sfc_main$e } from './DialogContent--DfaB7PA.mjs';
import { _ as _sfc_main$1$3, a as _sfc_main$f, b as _sfc_main$2$1 } from './DialogTitle-etzFEgfj.mjs';
import { DialogTrigger } from 'reka-ui';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-8UYShezB.mjs';
import { _ as _sfc_main$8 } from './Pagination-XsHAzqkr.mjs';

const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "FixedRail",
  __ssrInlineRender: true,
  setup(__props) {
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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "flex flex-col w-full min-h-screen gap-8 pb-16 lg:pb-24 lg:flex-row",
        id: "main-content"
      }, _attrs))}>`);
      _push(ssrRenderComponent(unref(motion).section, {
        variants: fadeUp,
        "aria-labelledby": "main-content-heading",
        class: "w-full gap-4 lg:w-2/3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 id="main-content-heading" class="sr-only"${_scopeId}>Main content</h2>`);
            ssrRenderSlot(_ctx.$slots, "main", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              createVNode("h2", {
                id: "main-content-heading",
                class: "sr-only"
              }, "Main content"),
              renderSlot(_ctx.$slots, "main")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`<aside id="right-rail" aria-labelledby="sidebar-heading" class="w-full lg:w-1/3"><div class="lg:z-10 lg:sticky top-24"><h2 id="sidebar-heading" class="sr-only">Additional content</h2>`);
      ssrRenderSlot(_ctx.$slots, "right", {}, null, _push, _parent);
      _push(`</div></aside></div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/containers/FixedRail.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DialogTrigger",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(DialogTrigger), mergeProps(props, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/dialog/DialogTrigger.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    htmlContent: { type: String, default: "" },
    title: { type: String, default: "" },
    description: { type: String, default: "" }
  },
  setup(__props, { expose: __expose }) {
    const isOpen = ref(false);
    const toggleModal = (value) => {
      isOpen.value = value !== void 0 ? value : !isOpen.value;
    };
    __expose({ toggleModal });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$1$2), mergeProps({
        open: isOpen.value,
        "onUpdate:open": ($event) => isOpen.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$5), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "button", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "button")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$e), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                var _a;
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$1$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$f), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(__props.title)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(__props.title), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$2$1), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(__props.description)}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(__props.description), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$f), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.title), 1)
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$2$1), null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(__props.description), 1)
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`<div class="max-h-[60vh] overflow-y-auto px-1 mt-4"${_scopeId2}>`);
                  if (__props.htmlContent) {
                    _push3(`<div class="prose max-w-none"${_scopeId2}>${(_a = __props.htmlContent) != null ? _a : ""}</div>`);
                  } else {
                    _push3(`<!---->`);
                  }
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode(unref(_sfc_main$1$3), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$f), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.title), 1)
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$2$1), null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(__props.description), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode("div", { class: "max-h-[60vh] overflow-y-auto px-1 mt-4" }, [
                      __props.htmlContent ? (openBlock(), createBlock("div", {
                        key: 0,
                        innerHTML: __props.htmlContent,
                        class: "prose max-w-none"
                      }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                      renderSlot(_ctx.$slots, "default")
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$5), { "as-child": "" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "button")
                ]),
                _: 3
              }),
              createVNode(unref(_sfc_main$e), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$1$3), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$f), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.title), 1)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$2$1), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(__props.description), 1)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode("div", { class: "max-h-[60vh] overflow-y-auto px-1 mt-4" }, [
                    __props.htmlContent ? (openBlock(), createBlock("div", {
                      key: 0,
                      innerHTML: __props.htmlContent,
                      class: "prose max-w-none"
                    }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                    renderSlot(_ctx.$slots, "default")
                  ])
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/modal/Modal.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const privacyConfig = `<section>
    <h2>1. Information I Collect</h2>
    <p>I collect information to provide and improve my services, communicate with you, and understand how my website is used. The types of information I collect include:</p>
    
    <h3>Personal Information You Voluntarily Provide</h3>
    <ul>
      <li><strong>Newsletter Subscription:</strong> I collect your email address. You may also provide your name.</li>
      <li><strong>Blog Comments:</strong> I collect your name, email address, comment content, and optionally your website URL.</li>
      <li><strong>Contact Forms/Direct Communication:</strong> I collect your name, email address, and message content.</li>
    </ul>

    <h3>Automatically Collected Information (Usage Data)</h3>
    <ul>
      <li>IP address</li>
      <li>Browser type and version</li>
      <li>Operating system</li>
      <li>Referring and exit pages</li>
      <li>Dates and times of access</li>
      <li>Time spent on pages</li>
      <li>Clickstream data</li>
    </ul>
  </section>

  <section>
    <h2>2. How I Use Your Information</h2>
    <ul>
      <li>To provide and maintain the website</li>
      <li>To send newsletter updates</li>
      <li>To enable blog commenting</li>
      <li>To respond to inquiries</li>
      <li>To improve the website and content</li>
      <li>To protect against fraud and enforce terms</li>
    </ul>
  </section>

  <section>
    <h2>3. Sharing Your Information</h2>
    <p>I do not sell, rent, or trade your personal information. I may share it only in the following cases:</p>
    <ul>
      <li><strong>With Service Providers:</strong> For website operation, email marketing, and analytics.</li>
      <li><strong>For Legal Reasons:</strong> To comply with law, protect rights, investigate wrongdoing, or ensure safety.</li>
      <li><strong>With Your Consent:</strong> Only for purposes you explicitly agree to.</li>
    </ul>
  </section>

  <section>
    <h2>4. Data Retention</h2>
    <p>I retain data only as long as needed for the purpose it was collected, or for legal/reporting reasons:</p>
    <ul>
      <li><strong>Newsletter:</strong> Retained until you unsubscribe.</li>
      <li><strong>Blog Comments:</strong> May be kept indefinitely unless removal is requested.</li>
      <li><strong>Contact Submissions:</strong> Retained for a reasonable response window.</li>
      <li><strong>Usage Data:</strong> Typically retained briefly for analytics.</li>
    </ul>
  </section>

  <section>
    <h2>5. Your Choices and Rights</h2>
    <p>Depending on applicable laws, you may have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Request corrections</li>
      <li>Request deletion ("right to be forgotten")</li>
      <li>Unsubscribe from newsletters</li>
      <li>Object to certain data processing</li>
      <li>Withdraw consent at any time</li>
    </ul>
    <p>To exercise any of these rights, please contact me at the email listed below.</p>
  </section>

  <section>
    <h2>6. Cookies and Tracking Technologies</h2>
    <p>My website may use cookies and similar technologies:</p>
    <ul>
      <li><strong>Necessary Cookies:</strong> Enable core site functionality.</li>
      <li><strong>Analytics Cookies:</strong> Understand usage and performance (e.g., Google Analytics).</li>
    </ul>
    <p>You can manage cookie preferences through your browser settings. Disabling cookies may affect site functionality.</p>
  </section>

  <section>
    <h2>7. Links to Other Websites</h2>
    <p>This site may contain links to third-party websites. I am not responsible for their privacy practices or content. Always review their policies.</p>
  </section>

  <section>
    <h2>8. Security of Your Information</h2>
    <p>I use reasonable measures to protect your data but cannot guarantee absolute security. Transmission over the internet involves risk.</p>
  </section>

  <section>
    <h2>9. Children's Privacy</h2>
    <p>This site is not intended for children under 13. I do not knowingly collect data from them. If you believe a child has provided data, contact me for removal.</p>
  </section>

  <section>
    <h2>10. Changes to This Privacy Policy</h2>
    <p>I may update this Privacy Policy. Changes will be posted on this page with a revised "Last Updated" date. Review it periodically for updates.</p>
  </section>

  <section>
    <h2>11. Contact Me</h2>
    <p>If you have questions or concerns about this policy, reach out at:</p>
    <address>
      Guillermo Medel<br />
      <a href="mailto:GuillermoMedel@GuillermoMedel.com">GuillermoMedel@GuillermoMedel.com</a>
    </address>
  </section>`;
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "NewsletterHero",
  __ssrInlineRender: true,
  setup(__props) {
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
    const form = ref({
      email: "",
      name: "",
      consent: false
    });
    const isSubmitting = ref(false);
    const message = ref(null);
    const { createItem } = usePocketBaseCore();
    const handleSubmit = async () => {
      if (!form.value.consent) {
        message.value = {
          type: "error",
          text: "Please agree to the privacy policy"
        };
        return;
      }
      isSubmitting.value = true;
      message.value = null;
      try {
        await createItem("newsletterSubs", {
          email: form.value.email,
          name: form.value.name,
          consent_given: true,
          subscribed_at: (/* @__PURE__ */ new Date()).toISOString()
        });
        message.value = {
          type: "success",
          text: "Thank you for subscribing!"
        };
        form.value = {
          email: "",
          name: "",
          consent: false
        };
      } catch (error) {
        console.error("Subscription process failed:", error);
        message.value = {
          type: "error",
          text: "Subscription failed. You may already be subscribed or the server is unavailable."
        };
      } finally {
        isSubmitting.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(motion).div, mergeProps({
        variants: fadeUp,
        initial: "hidden",
        animate: "visible"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$a), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$b), { class: "p-6 space-y-6" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<form class="space-y-4" data-v-1ae7ff10${_scopeId3}><div class="space-y-2" data-v-1ae7ff10${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$c), { for: "newsletter-email" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Email Address`);
                            } else {
                              return [
                                createTextVNode("Email Address")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), {
                          id: "newsletter-email",
                          modelValue: unref(form).email,
                          "onUpdate:modelValue": ($event) => unref(form).email = $event,
                          type: "email",
                          placeholder: "your@email.com",
                          required: "",
                          class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="space-y-2" data-v-1ae7ff10${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$c), { for: "newsletter-name" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Name (Optional)`);
                            } else {
                              return [
                                createTextVNode("Name (Optional)")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$1$1), {
                          id: "newsletter-name",
                          modelValue: unref(form).name,
                          "onUpdate:modelValue": ($event) => unref(form).name = $event,
                          type: "text",
                          placeholder: "Your name",
                          class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                        }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="flex items-center" data-v-1ae7ff10${_scopeId3}><input id="newsletter-consent"${ssrIncludeBooleanAttr(Array.isArray(unref(form).consent) ? ssrLooseContain(unref(form).consent, null) : unref(form).consent) ? " checked" : ""} type="checkbox" required class="w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500" data-v-1ae7ff10${_scopeId3}><label for="newsletter-consent" class="ml-2 text-sm" data-v-1ae7ff10${_scopeId3}> I agree to receive emails and accept the `);
                        _push4(ssrRenderComponent(_sfc_main$4, {
                          title: "Privacy Policy",
                          description: "This Privacy Policy explains how information may be collected, used, and shared.",
                          htmlContent: unref(privacyConfig)
                        }, {
                          button: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<span class="cursor-pointer text-primary-500 hover:underline" data-v-1ae7ff10${_scopeId4}> privacy policy </span>`);
                            } else {
                              return [
                                createVNode("span", { class: "cursor-pointer text-primary-500 hover:underline" }, " privacy policy ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</label></div>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$d), {
                          size: "lg",
                          class: "w-full",
                          disabled: unref(isSubmitting),
                          type: "submit"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`${ssrInterpolate(unref(isSubmitting) ? "Subscribing..." : "Subscribe Now")}`);
                            } else {
                              return [
                                createTextVNode(toDisplayString(unref(isSubmitting) ? "Subscribing..." : "Subscribe Now"), 1)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(`</form>`);
                        if (unref(message)) {
                          _push4(`<div class="${ssrRenderClass([{
                            "bg-green-900/50 text-green-300": unref(message).type === "success",
                            "bg-red-900/50 text-red-300": unref(message).type === "error"
                          }, "p-4 text-sm rounded-lg"])}" data-v-1ae7ff10${_scopeId3}>${ssrInterpolate(unref(message).text)}</div>`);
                        } else {
                          _push4(`<!---->`);
                        }
                        _push4(`<div class="border-t border-white/10 pt-4" data-v-1ae7ff10${_scopeId3}><div class="flex flex-col items-center space-y-2 text-center" data-v-1ae7ff10${_scopeId3}><div class="flex space-x-2" data-v-1ae7ff10${_scopeId3}><div class="p-2 rounded-lg bg-primary-600/10" data-v-1ae7ff10${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ShieldCheck), { class: "w-5 h-5 text-primary-400" }, null, _parent4, _scopeId3));
                        _push4(`</div><div class="p-2 rounded-lg bg-primary-600/10" data-v-1ae7ff10${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(Lock), { class: "w-5 h-5 text-primary-400" }, null, _parent4, _scopeId3));
                        _push4(`</div></div></div></div>`);
                      } else {
                        return [
                          createVNode("form", {
                            onSubmit: withModifiers(handleSubmit, ["prevent"]),
                            class: "space-y-4"
                          }, [
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$c), { for: "newsletter-email" }, {
                                default: withCtx(() => [
                                  createTextVNode("Email Address")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$1), {
                                id: "newsletter-email",
                                modelValue: unref(form).email,
                                "onUpdate:modelValue": ($event) => unref(form).email = $event,
                                type: "email",
                                placeholder: "your@email.com",
                                required: "",
                                class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$c), { for: "newsletter-name" }, {
                                default: withCtx(() => [
                                  createTextVNode("Name (Optional)")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$1), {
                                id: "newsletter-name",
                                modelValue: unref(form).name,
                                "onUpdate:modelValue": ($event) => unref(form).name = $event,
                                type: "text",
                                placeholder: "Your name",
                                class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                            ]),
                            createVNode("div", { class: "flex items-center" }, [
                              withDirectives(createVNode("input", {
                                id: "newsletter-consent",
                                "onUpdate:modelValue": ($event) => unref(form).consent = $event,
                                type: "checkbox",
                                required: "",
                                class: "w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelCheckbox, unref(form).consent]
                              ]),
                              createVNode("label", {
                                for: "newsletter-consent",
                                class: "ml-2 text-sm"
                              }, [
                                createTextVNode(" I agree to receive emails and accept the "),
                                createVNode(_sfc_main$4, {
                                  title: "Privacy Policy",
                                  description: "This Privacy Policy explains how information may be collected, used, and shared.",
                                  htmlContent: unref(privacyConfig)
                                }, {
                                  button: withCtx(() => [
                                    createVNode("span", { class: "cursor-pointer text-primary-500 hover:underline" }, " privacy policy ")
                                  ]),
                                  _: 1
                                }, 8, ["htmlContent"])
                              ])
                            ]),
                            createVNode(unref(_sfc_main$d), {
                              size: "lg",
                              class: "w-full",
                              disabled: unref(isSubmitting),
                              type: "submit"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(isSubmitting) ? "Subscribing..." : "Subscribe Now"), 1)
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ], 32),
                          unref(message) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: ["p-4 text-sm rounded-lg", {
                              "bg-green-900/50 text-green-300": unref(message).type === "success",
                              "bg-red-900/50 text-red-300": unref(message).type === "error"
                            }]
                          }, toDisplayString(unref(message).text), 3)) : createCommentVNode("", true),
                          createVNode("div", { class: "border-t border-white/10 pt-4" }, [
                            createVNode("div", { class: "flex flex-col items-center space-y-2 text-center" }, [
                              createVNode("div", { class: "flex space-x-2" }, [
                                createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                                  createVNode(unref(ShieldCheck), { class: "w-5 h-5 text-primary-400" })
                                ]),
                                createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                                  createVNode(unref(Lock), { class: "w-5 h-5 text-primary-400" })
                                ])
                              ])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$b), { class: "p-6 space-y-6" }, {
                      default: withCtx(() => [
                        createVNode("form", {
                          onSubmit: withModifiers(handleSubmit, ["prevent"]),
                          class: "space-y-4"
                        }, [
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$c), { for: "newsletter-email" }, {
                              default: withCtx(() => [
                                createTextVNode("Email Address")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), {
                              id: "newsletter-email",
                              modelValue: unref(form).email,
                              "onUpdate:modelValue": ($event) => unref(form).email = $event,
                              type: "email",
                              placeholder: "your@email.com",
                              required: "",
                              class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "space-y-2" }, [
                            createVNode(unref(_sfc_main$c), { for: "newsletter-name" }, {
                              default: withCtx(() => [
                                createTextVNode("Name (Optional)")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$1$1), {
                              id: "newsletter-name",
                              modelValue: unref(form).name,
                              "onUpdate:modelValue": ($event) => unref(form).name = $event,
                              type: "text",
                              placeholder: "Your name",
                              class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          createVNode("div", { class: "flex items-center" }, [
                            withDirectives(createVNode("input", {
                              id: "newsletter-consent",
                              "onUpdate:modelValue": ($event) => unref(form).consent = $event,
                              type: "checkbox",
                              required: "",
                              class: "w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500"
                            }, null, 8, ["onUpdate:modelValue"]), [
                              [vModelCheckbox, unref(form).consent]
                            ]),
                            createVNode("label", {
                              for: "newsletter-consent",
                              class: "ml-2 text-sm"
                            }, [
                              createTextVNode(" I agree to receive emails and accept the "),
                              createVNode(_sfc_main$4, {
                                title: "Privacy Policy",
                                description: "This Privacy Policy explains how information may be collected, used, and shared.",
                                htmlContent: unref(privacyConfig)
                              }, {
                                button: withCtx(() => [
                                  createVNode("span", { class: "cursor-pointer text-primary-500 hover:underline" }, " privacy policy ")
                                ]),
                                _: 1
                              }, 8, ["htmlContent"])
                            ])
                          ]),
                          createVNode(unref(_sfc_main$d), {
                            size: "lg",
                            class: "w-full",
                            disabled: unref(isSubmitting),
                            type: "submit"
                          }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(isSubmitting) ? "Subscribing..." : "Subscribe Now"), 1)
                            ]),
                            _: 1
                          }, 8, ["disabled"])
                        ], 32),
                        unref(message) ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: ["p-4 text-sm rounded-lg", {
                            "bg-green-900/50 text-green-300": unref(message).type === "success",
                            "bg-red-900/50 text-red-300": unref(message).type === "error"
                          }]
                        }, toDisplayString(unref(message).text), 3)) : createCommentVNode("", true),
                        createVNode("div", { class: "border-t border-white/10 pt-4" }, [
                          createVNode("div", { class: "flex flex-col items-center space-y-2 text-center" }, [
                            createVNode("div", { class: "flex space-x-2" }, [
                              createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                                createVNode(unref(ShieldCheck), { class: "w-5 h-5 text-primary-400" })
                              ]),
                              createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                                createVNode(unref(Lock), { class: "w-5 h-5 text-primary-400" })
                              ])
                            ])
                          ])
                        ])
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
              createVNode(unref(_sfc_main$a), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$b), { class: "p-6 space-y-6" }, {
                    default: withCtx(() => [
                      createVNode("form", {
                        onSubmit: withModifiers(handleSubmit, ["prevent"]),
                        class: "space-y-4"
                      }, [
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$c), { for: "newsletter-email" }, {
                            default: withCtx(() => [
                              createTextVNode("Email Address")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), {
                            id: "newsletter-email",
                            modelValue: unref(form).email,
                            "onUpdate:modelValue": ($event) => unref(form).email = $event,
                            type: "email",
                            placeholder: "your@email.com",
                            required: "",
                            class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "space-y-2" }, [
                          createVNode(unref(_sfc_main$c), { for: "newsletter-name" }, {
                            default: withCtx(() => [
                              createTextVNode("Name (Optional)")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$1$1), {
                            id: "newsletter-name",
                            modelValue: unref(form).name,
                            "onUpdate:modelValue": ($event) => unref(form).name = $event,
                            type: "text",
                            placeholder: "Your name",
                            class: "bg-white/10 border-white/20 focus:ring-2 focus:ring-primary-500"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])
                        ]),
                        createVNode("div", { class: "flex items-center" }, [
                          withDirectives(createVNode("input", {
                            id: "newsletter-consent",
                            "onUpdate:modelValue": ($event) => unref(form).consent = $event,
                            type: "checkbox",
                            required: "",
                            class: "w-4 h-4 rounded text-primary-600 bg-white/10 border-white/20 focus:ring-primary-500"
                          }, null, 8, ["onUpdate:modelValue"]), [
                            [vModelCheckbox, unref(form).consent]
                          ]),
                          createVNode("label", {
                            for: "newsletter-consent",
                            class: "ml-2 text-sm"
                          }, [
                            createTextVNode(" I agree to receive emails and accept the "),
                            createVNode(_sfc_main$4, {
                              title: "Privacy Policy",
                              description: "This Privacy Policy explains how information may be collected, used, and shared.",
                              htmlContent: unref(privacyConfig)
                            }, {
                              button: withCtx(() => [
                                createVNode("span", { class: "cursor-pointer text-primary-500 hover:underline" }, " privacy policy ")
                              ]),
                              _: 1
                            }, 8, ["htmlContent"])
                          ])
                        ]),
                        createVNode(unref(_sfc_main$d), {
                          size: "lg",
                          class: "w-full",
                          disabled: unref(isSubmitting),
                          type: "submit"
                        }, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(isSubmitting) ? "Subscribing..." : "Subscribe Now"), 1)
                          ]),
                          _: 1
                        }, 8, ["disabled"])
                      ], 32),
                      unref(message) ? (openBlock(), createBlock("div", {
                        key: 0,
                        class: ["p-4 text-sm rounded-lg", {
                          "bg-green-900/50 text-green-300": unref(message).type === "success",
                          "bg-red-900/50 text-red-300": unref(message).type === "error"
                        }]
                      }, toDisplayString(unref(message).text), 3)) : createCommentVNode("", true),
                      createVNode("div", { class: "border-t border-white/10 pt-4" }, [
                        createVNode("div", { class: "flex flex-col items-center space-y-2 text-center" }, [
                          createVNode("div", { class: "flex space-x-2" }, [
                            createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                              createVNode(unref(ShieldCheck), { class: "w-5 h-5 text-primary-400" })
                            ]),
                            createVNode("div", { class: "p-2 rounded-lg bg-primary-600/10" }, [
                              createVNode(unref(Lock), { class: "w-5 h-5 text-primary-400" })
                            ])
                          ])
                        ])
                      ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/NewsletterHero.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-1ae7ff10"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Subscribe",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Join Newsletter"
    },
    description: {
      type: String,
      default: "Stay updated with the latest news, articles, and resources. Subscribe and never miss out!"
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SectionsNewsletterHero = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col w-full md:flex-row lg:flex-col" }, _attrs))}><div class="grid content-center w-full px-2 mb-8 md:w-1/2 lg:w-full md:pr-16 lg:pr-0 md:mb-4 md:px-0"><h2 class="mb-2 text-2xl font-bold tracking-tight text-primary md:text-3xl lg:text-4xl">${ssrInterpolate(__props.title)}</h2><p class="mt-3 text-sm line-clamp-3">${ssrInterpolate(__props.description)}</p></div>`);
      _push(ssrRenderComponent(_component_SectionsNewsletterHero, { class: "w-full md:w-1/2 md:pl-2 lg:pl-0 lg:w-full" }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/Subscribe.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Blog",
  __ssrInlineRender: true,
  props: {
    content: {
      type: Array,
      required: true
    },
    baseUrl: {
      type: String
    },
    type: {
      type: String,
      default: "posts"
    }
  },
  setup(__props) {
    usePocketBaseCore();
    ref([]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_containers_fixed_rail = _sfc_main$6;
      const _component_CardsBlogHorizontal = _sfc_main$9;
      const _component_SectionsSubscribe = _sfc_main$2;
      _push(ssrRenderComponent(_component_containers_fixed_rail, _attrs, {
        main: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="grid w-full gap-4"${_scopeId}><!--[-->`);
            ssrRenderList(__props.content, (post, index) => {
              _push2(ssrRenderComponent(_component_CardsBlogHorizontal, {
                key: post.id,
                title: post.title,
                description: post.description,
                created: post.created,
                slug: post.slug,
                "collection-id": post.collectionId,
                id: post.id,
                "cover-image": post.cover_image,
                index,
                "base-url": __props.baseUrl
              }, null, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode("div", { class: "grid w-full gap-4" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(__props.content, (post, index) => {
                  return openBlock(), createBlock(_component_CardsBlogHorizontal, {
                    key: post.id,
                    title: post.title,
                    description: post.description,
                    created: post.created,
                    slug: post.slug,
                    "collection-id": post.collectionId,
                    id: post.id,
                    "cover-image": post.cover_image,
                    index,
                    "base-url": __props.baseUrl
                  }, null, 8, ["title", "description", "created", "slug", "collection-id", "id", "cover-image", "index", "base-url"]);
                }), 128))
              ])
            ];
          }
        }),
        right: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_SectionsSubscribe, { class: "z-10 sticky-position top-24" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_SectionsSubscribe, { class: "z-10 sticky-position top-24" })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/Blog.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlogColumn",
  __ssrInlineRender: true,
  props: {
    title: {
      type: String,
      default: "Blog Articles & Tutorials"
    },
    description: {
      type: String,
      default: "Explore my latest articles and insights on web development, design, and technology. Learn from practical tutorials and stay updated with industry trends."
    },
    perPage: {
      type: Number,
      default: 5
    },
    content: {
      type: Object
    },
    showMore: {
      type: Boolean,
      default: true
    },
    showPagination: {
      type: Boolean,
      default: true
    },
    baseUrl: {
      type: String,
      default: ""
    },
    h1: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: "posts"
    }
  },
  setup(__props) {
    const props = __props;
    const { fetchCollection } = usePocketBaseCore();
    const posts = ref({
      items: [],
      page: 1,
      perPage: props.perPage,
      totalItems: 0,
      totalPages: 0
    });
    const route = useRoute();
    const fetchPosts = async (page, perPage) => {
      try {
        const result = await fetchCollection(
          props.type,
          page,
          perPage,
          "",
          "-created",
          ""
        );
        return result;
      } catch (error) {
        console.error("Error fetching posts:", error);
        return {
          items: [],
          page: 1,
          perPage,
          totalItems: 0,
          totalPages: 0
        };
      }
    };
    watch(
      () => route.query.page,
      async (newPage) => {
        const pageNumber = newPage ? parseInt(newPage, 10) : 1;
        if (!isNaN(pageNumber)) {
          posts.value = await fetchPosts(pageNumber, props.perPage);
        }
      },
      { immediate: true }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_TextSectionTitle = _sfc_main$7;
      const _component_SectionsBlog = _sfc_main$1;
      const _component_nuxt_link = __nuxt_component_0$1;
      const _component_Pagination = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container flex flex-col w-full mx-auto" }, _attrs))} data-v-fc55dea5>`);
      if (__props.title || __props.description) {
        _push(ssrRenderComponent(_component_TextSectionTitle, {
          class: "pb-16",
          title: __props.title,
          description: __props.description,
          h1: __props.h1
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if ((_b = (_a = unref(posts)) == null ? void 0 : _a.items) == null ? void 0 : _b.length) {
        _push(ssrRenderComponent(_component_SectionsBlog, {
          class: "flex w-full mt-6",
          content: unref(posts).items,
          baseUrl: __props.baseUrl
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex justify-center w-full mr-auto -mt-12 lg:-mt-20 lg:w-2/3" data-v-fc55dea5><div data-v-fc55dea5>`);
      if (__props.showMore) {
        _push(ssrRenderComponent(_component_nuxt_link, {
          to: "/blog/",
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (((_c = unref(posts)) == null ? void 0 : _c.totalPages) > 1 && __props.showPagination) {
        _push(ssrRenderComponent(_component_Pagination, {
          "total-pages": (_d = unref(posts)) == null ? void 0 : _d.totalPages,
          "show-pagination": true
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/BlogColumn.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fc55dea5"]]);

export { __nuxt_component_2 as _ };
//# sourceMappingURL=BlogColumn-DdmbN1m_.mjs.map
