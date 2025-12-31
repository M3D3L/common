import { _ as _sfc_main$1 } from './Video-D1RJ9xBX.mjs';
import { c as createSeoObject, _ as _sfc_main$2 } from './useSeo-8eJjrpUV.mjs';
import { c as useRoute, d as useRouter, b as useRuntimeConfig, _ as __nuxt_component_2 } from './server.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { defineComponent, computed, ref, watch, reactive, mergeProps, unref, withCtx, createVNode, createBlock, createCommentVNode, isRef, createTextVNode, openBlock, toDisplayString, withModifiers, withDirectives, vModelText, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { Loader2 } from 'lucide-vue-next';
import { _ as _sfc_main$3 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$4 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$8 } from './CardFooter-BWzQ2wlE.mjs';
import { _ as _sfc_main$2$1, a as _sfc_main$1$1, b as _sfc_main$5 } from './TabsTrigger-CSTcvnFX.mjs';
import { _ as _sfc_main$7 } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$6, a as _sfc_main$1$2 } from './Label-NdntEGti.mjs';
import { u as useAuth } from './useAuth-yR7jtp4v.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AuthForm",
  __ssrInlineRender: true,
  setup(__props) {
    const config = useRuntimeConfig();
    const auth = useAuth();
    const route = useRoute();
    const router = useRouter();
    const videoArray = [
      "https://www.pexels.com/download/video/33792753/",
      "https://www.pexels.com/download/video/32926637/",
      "https://www.pexels.com/download/video/32106032/",
      "https://www.pexels.com/download/video/32104595/"
    ];
    const randomIndex = Math.floor(Math.random() * videoArray.length);
    const isRegister = computed(() => route.path === "/register");
    const redirectPath = computed(() => {
      const source = route.query.source;
      return source && source.startsWith("/") ? source : "/";
    });
    const activeTab = ref(isRegister.value ? "register" : "login");
    watch(
      () => route.path,
      (newPath) => {
        activeTab.value = newPath === "/register" ? "register" : "login";
      }
    );
    const showSuccess = ref(false);
    const isSubmitting = ref(false);
    const generalError = ref("");
    const form = reactive({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      avatar: null,
      avatarUrl: null,
      remember: false
    });
    const errors = reactive({});
    const resetForm = () => {
      form.username = "";
      form.email = "";
      form.password = "";
      form.confirmPassword = "";
      form.bio = "";
      form.avatar = null;
      form.avatarUrl = null;
      form.remember = false;
      const fileInput = (void 0).getElementById("avatar");
      if (fileInput) fileInput.value = "";
    };
    const validateForm = () => {
      Object.keys(errors).forEach((key) => delete errors[key]);
      if (isRegister.value && !form.username)
        errors.username = "Username is required";
      if (!form.email) errors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(form.email))
        errors.email = "Please enter a valid email";
      if (!form.password) errors.password = "Password is required";
      else if (isRegister.value && form.password.length < 8)
        errors.password = "Password must be at least 8 characters";
      if (isRegister.value) {
        if (!form.confirmPassword)
          errors.confirmPassword = "Please confirm your password";
        else if (form.password !== form.confirmPassword)
          errors.confirmPassword = "Passwords do not match";
      }
      return Object.keys(errors).length === 0;
    };
    const handleAvatarChange = (event) => {
      const target = event.target;
      if (target.files && target.files.length > 0) {
        form.avatar = target.files[0];
        form.avatarUrl = URL.createObjectURL(target.files[0]);
      } else {
        form.avatar = null;
        form.avatarUrl = null;
      }
    };
    const handleSubmit = async () => {
      var _a, _b, _c;
      if (!validateForm()) return;
      isSubmitting.value = true;
      showSuccess.value = false;
      generalError.value = "";
      Object.keys(errors).forEach((key) => delete errors[key]);
      try {
        if (isRegister.value) {
          const registerData = {
            email: form.email.trim(),
            password: form.password,
            passwordConfirm: form.confirmPassword,
            username: (_a = form.username) == null ? void 0 : _a.trim(),
            bio: (_b = form.bio) == null ? void 0 : _b.trim()
          };
          if (form.avatar) registerData.avatar = form.avatar;
          const result = await auth.register(registerData);
          if (result.success) {
            showSuccess.value = true;
            resetForm();
            setTimeout(() => {
              showSuccess.value = false;
              const loginPath = redirectPath.value === "/" ? "/login" : `/login?source=${encodeURIComponent(redirectPath.value)}`;
              router.push(loginPath);
            }, 3e3);
          } else {
            generalError.value = result.message || "Registration failed";
          }
        } else {
          const result = await auth.login({
            email: form.email.trim(),
            password: form.password
          });
          if (result.success) {
            await router.push(redirectPath.value);
          } else {
            generalError.value = result.message || "Invalid email or password";
          }
        }
      } catch (error) {
        console.error("Form submission error:", error);
        if ((_c = error.data) == null ? void 0 : _c.data) {
          Object.entries(error.data.data).forEach(([field, message]) => {
            if (field in errors) {
              errors[field] = Array.isArray(message) ? message.join(", ") : String(message);
            }
          });
        } else {
          generalError.value = error.message || "An unexpected error occurred";
        }
      } finally {
        isSubmitting.value = false;
      }
    };
    const computedSeoData = computed(() => {
      return createSeoObject({
        title: `${isRegister.value ? "Register" : "Login"} - ${config.public.siteName}`,
        summary: `${isRegister.value ? "Create a new account" : "Access your account"} on ${config.public.siteName}.`,
        keywords: isRegister.value ? "register, sign up, create account, new user, join" : "login, sign in, access account, returning user",
        imageUri: "",
        pubDate: "",
        byline: isRegister.value ? "Register for a new account" : "Login to your account",
        // Optional for homepage JSON-LD customization
        jsonLd: {
          "@type": "WebSite",
          url: config.public.siteUrl,
          name: `${isRegister.value ? "Register" : "Login"} - ${config.public.siteName}`,
          description: `${isRegister.value ? "Create a new account" : "Access your account"} on ${config.public.siteName}.`,
          publisher: {
            "@type": "Organization",
            name: config.public.siteName
          }
        }
      });
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_containers_video = _sfc_main$1;
      const _component_SeoMeta = _sfc_main$2;
      const _component_ClientOnly = __nuxt_component_2;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_containers_video, mergeProps({
        id: "auth",
        class: "min-h-[90vh] md:min-h-screen",
        title: "",
        description: "",
        video: videoArray[unref(randomIndex)]
      }, _attrs), {
        "video-container-content": withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_ClientOnly, null, {}, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_SeoMeta, { seoData: unref(computedSeoData) }, null, 8, ["seoData"]),
              createVNode(_component_ClientOnly, null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$3), { class: "max-w-2xl mx-auto" }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$4), { class: "p-6" }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex justify-center mb-6" }, [
                            createVNode(unref(_sfc_main$2$1), {
                              modelValue: unref(activeTab),
                              "onUpdate:modelValue": ($event) => isRef(activeTab) ? activeTab.value = $event : null,
                              class: "w-full"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$1$1), { class: "grid w-full grid-cols-2" }, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$5), {
                                      value: "login",
                                      asChild: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_NuxtLink, {
                                          to: { path: "/login", query: unref(route).query },
                                          class: "w-full"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Login")
                                          ]),
                                          _: 1
                                        }, 8, ["to"])
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(unref(_sfc_main$5), {
                                      value: "register",
                                      asChild: ""
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(_component_NuxtLink, {
                                          to: { path: "/register", query: unref(route).query },
                                          class: "w-full"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Register")
                                          ]),
                                          _: 1
                                        }, 8, ["to"])
                                      ]),
                                      _: 1
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            }, 8, ["modelValue", "onUpdate:modelValue"])
                          ]),
                          unref(showSuccess) ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "p-4 mb-4 text-center text-green-600 bg-green-100 rounded-md"
                          }, [
                            createVNode("p", null, " Thank you for registering! You can now login with your credentials. ")
                          ])) : createCommentVNode("", true),
                          unref(generalError) ? (openBlock(), createBlock("div", {
                            key: 1,
                            class: "p-4 mb-4 text-center text-red-600 bg-red-100 rounded-md"
                          }, [
                            createVNode("p", null, toDisplayString(unref(generalError)), 1)
                          ])) : createCommentVNode("", true),
                          createVNode("form", {
                            onSubmit: withModifiers(handleSubmit, ["prevent"]),
                            class: "space-y-4"
                          }, [
                            unref(isRegister) ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "space-y-2"
                            }, [
                              createVNode(unref(_sfc_main$6), { for: "username" }, {
                                default: withCtx(() => [
                                  createTextVNode("Username")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$2), {
                                id: "username",
                                modelValue: unref(form).username,
                                "onUpdate:modelValue": ($event) => unref(form).username = $event,
                                placeholder: "johndoe",
                                required: "",
                                autocomplete: "username"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(errors).username ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).username), 1)) : createCommentVNode("", true)
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$6), { for: "email" }, {
                                default: withCtx(() => [
                                  createTextVNode("Email")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$2), {
                                id: "email",
                                modelValue: unref(form).email,
                                "onUpdate:modelValue": ($event) => unref(form).email = $event,
                                type: "email",
                                placeholder: "your@email.com",
                                required: "",
                                autocomplete: "email"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(errors).email ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).email), 1)) : createCommentVNode("", true)
                            ]),
                            createVNode("div", { class: "space-y-2" }, [
                              createVNode(unref(_sfc_main$6), { for: "password" }, {
                                default: withCtx(() => [
                                  createTextVNode("Password")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$2), {
                                id: "password",
                                modelValue: unref(form).password,
                                "onUpdate:modelValue": ($event) => unref(form).password = $event,
                                type: "password",
                                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                                required: "",
                                minlength: unref(isRegister) ? 8 : 1,
                                autocomplete: "current-password"
                              }, null, 8, ["modelValue", "onUpdate:modelValue", "minlength"]),
                              unref(errors).password ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).password), 1)) : createCommentVNode("", true),
                              unref(isRegister) ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "text-xs text-muted-foreground"
                              }, " Password must be at least 8 characters ")) : createCommentVNode("", true)
                            ]),
                            unref(isRegister) ? (openBlock(), createBlock("div", {
                              key: 1,
                              class: "space-y-2"
                            }, [
                              createVNode(unref(_sfc_main$6), { for: "confirmPassword" }, {
                                default: withCtx(() => [
                                  createTextVNode("Confirm Password")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$2), {
                                id: "confirmPassword",
                                modelValue: unref(form).confirmPassword,
                                "onUpdate:modelValue": ($event) => unref(form).confirmPassword = $event,
                                type: "password",
                                placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
                                required: "",
                                minlength: "8",
                                autocomplete: "new-password"
                              }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                              unref(errors).confirmPassword ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).confirmPassword), 1)) : createCommentVNode("", true)
                            ])) : createCommentVNode("", true),
                            unref(isRegister) ? (openBlock(), createBlock("div", {
                              key: 2,
                              class: "space-y-2"
                            }, [
                              createVNode(unref(_sfc_main$6), { for: "bio" }, {
                                default: withCtx(() => [
                                  createTextVNode("Bio")
                                ]),
                                _: 1
                              }),
                              withDirectives(createVNode("textarea", {
                                id: "bio",
                                "onUpdate:modelValue": ($event) => unref(form).bio = $event,
                                class: "w-full px-3 py-2 text-sm border rounded-md border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                                placeholder: "A short bio about yourself"
                              }, null, 8, ["onUpdate:modelValue"]), [
                                [vModelText, unref(form).bio]
                              ]),
                              unref(errors).bio ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).bio), 1)) : createCommentVNode("", true)
                            ])) : createCommentVNode("", true),
                            unref(isRegister) ? (openBlock(), createBlock("div", {
                              key: 3,
                              class: "space-y-2"
                            }, [
                              createVNode(unref(_sfc_main$6), { for: "avatar" }, {
                                default: withCtx(() => [
                                  createTextVNode("Avatar")
                                ]),
                                _: 1
                              }),
                              createVNode(unref(_sfc_main$1$2), {
                                id: "avatar",
                                type: "file",
                                onChange: handleAvatarChange,
                                accept: "image/*"
                              }),
                              unref(errors).avatar ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "text-sm text-destructive"
                              }, toDisplayString(unref(errors).avatar), 1)) : createCommentVNode("", true),
                              unref(form).avatarUrl ? (openBlock(), createBlock("div", {
                                key: 1,
                                class: "mt-2"
                              }, [
                                createVNode("img", {
                                  src: unref(form).avatarUrl,
                                  alt: "Avatar Preview",
                                  class: "object-cover w-16 h-16 rounded-full"
                                }, null, 8, ["src"])
                              ])) : createCommentVNode("", true)
                            ])) : createCommentVNode("", true),
                            createVNode(unref(_sfc_main$7), {
                              type: "submit",
                              class: "w-full",
                              disabled: unref(isSubmitting)
                            }, {
                              default: withCtx(() => [
                                unref(isSubmitting) ? (openBlock(), createBlock("span", {
                                  key: 0,
                                  class: "flex items-center"
                                }, [
                                  createVNode(unref(Loader2), { class: "w-4 h-4 mr-2 animate-spin" }),
                                  createTextVNode(" Processing... ")
                                ])) : (openBlock(), createBlock("span", { key: 1 }, toDisplayString(unref(isRegister) ? "Create Account" : "Sign In"), 1))
                              ]),
                              _: 1
                            }, 8, ["disabled"])
                          ], 32)
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$8), { class: "flex flex-col items-center justify-center p-6 pt-0" }, {
                        default: withCtx(() => [
                          createVNode("p", { class: "text-sm text-muted-foreground" }, [
                            createTextVNode(toDisplayString(unref(isRegister) ? "Already have an account?" : "Don't have an account?") + " ", 1),
                            createVNode(_component_NuxtLink, {
                              to: {
                                path: unref(isRegister) ? "/login" : "/register",
                                query: unref(route).query
                              },
                              class: "font-medium text-primary hover:underline"
                            }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(unref(isRegister) ? "Sign in" : "Sign up"), 1)
                              ]),
                              _: 1
                            }, 8, ["to"])
                          ])
                        ]),
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/sections/AuthForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AuthForm-CUF0Vkow.mjs.map
