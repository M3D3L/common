import { c as createSeoObject, _ as _sfc_main$4 } from './useSeo-8eJjrpUV.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-8UYShezB.mjs';
import { c as useRoute, b as useRuntimeConfig, _ as __nuxt_component_2, a as usePocketBaseCore, n as navigateTo } from './server.mjs';
import { _ as _sfc_main$2$1, S as ShareTools } from './ShareTools-BLUPBveq.mjs';
import { _ as _sfc_main$7 } from './Html-BJT4P5oF.mjs';
import { defineComponent, withAsyncContext, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createBlock, createCommentVNode, createVNode, openBlock, Fragment, renderList, renderSlot, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { Calendar, Clock } from 'lucide-vue-next';
import { _ as _sfc_main$5, c as cn } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$6 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$9 } from './CardFooter-BWzQ2wlE.mjs';
import { _ as _sfc_main$8 } from './index-imKBogpg.mjs';
import { cva } from 'class-variance-authority';
import { u as useAsyncData } from './asyncData-lKiuBvcZ.mjs';
import { AvatarRoot, AvatarImage, AvatarFallback } from 'reka-ui';
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
import './index-CnW7QFU2.mjs';
import 'radix-vue';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'clsx';
import 'tailwind-merge';
import 'perfect-debounce';

const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "Avatar",
  __ssrInlineRender: true,
  props: {
    class: {},
    size: { default: "sm" },
    shape: { default: "circle" }
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarRoot), mergeProps({
        class: unref(cn)(unref(avatarVariant)({ size: _ctx.size, shape: _ctx.shape }), props.class)
      }, _attrs), {
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
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/avatar/Avatar.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AvatarFallback",
  __ssrInlineRender: true,
  props: {
    delayMs: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarFallback), mergeProps(props, _attrs), {
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/avatar/AvatarFallback.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AvatarImage",
  __ssrInlineRender: true,
  props: {
    src: {},
    referrerPolicy: {},
    crossOrigin: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(AvatarImage), mergeProps(props, { class: "h-full w-full object-cover" }, _attrs), {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/ui/avatar/AvatarImage.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const avatarVariant = cva(
  "inline-flex items-center justify-center font-normal text-foreground select-none shrink-0 bg-secondary overflow-hidden",
  {
    variants: {
      size: {
        sm: "h-10 w-10 text-xs",
        base: "h-16 w-16 text-2xl",
        lg: "h-32 w-32 text-5xl"
      },
      shape: {
        circle: "rounded-full",
        square: "rounded-md"
      }
    }
  }
);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return [`${month}/${day}/${year}`, `${year}/${month}/${day}`];
};
function usePosts() {
  const {
    fetchCollection,
    createItem,
    updateItem,
    deleteItem,
    uploadFile,
    user
  } = usePocketBaseCore();
  const generateSlug = (title) => title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
  const fetchPosts = async ({
    page = 1,
    perPage = 10,
    filter = "",
    sort = "-created",
    expand = "author",
    author,
    tag
  } = {}) => {
    let finalFilter = filter;
    if (author)
      finalFilter += (finalFilter ? " && " : "") + `author="${author}"`;
    if (tag) finalFilter += (finalFilter ? " && " : "") + `tags ?~ "${tag}"`;
    return fetchCollection("posts", page, perPage, finalFilter, sort, expand);
  };
  const fetchPostBySlug = async (slug, type) => {
    const result = await fetchCollection(
      type,
      1,
      1,
      `slug="${slug}"`,
      "-created",
      "author,comments_via_post.author"
    );
    if (!result.items.length) {
      throw new Error(`Post not found: ${slug}`);
    }
    return result.items[0];
  };
  const createPost = async (data) => {
    if (!user) throw new Error("Authentication required");
    const post = await createItem("posts", {
      ...data,
      author: user.id,
      slug: generateSlug(data.title)
    });
    if (data.cover_image) {
      return uploadFile(data.cover_image, "posts", post.id, "cover_image");
    }
    return post;
  };
  const updatePost = async (id, data) => {
    if (!user) throw new Error("Authentication required");
    const payload = {
      ...data,
      ...data.title && { slug: generateSlug(data.title) }
    };
    const post = await updateItem("posts", id, payload);
    if (data.cover_image) {
      return uploadFile(data.cover_image, "posts", id, "cover_image");
    }
    return post;
  };
  const removePost = async (id) => {
    if (!user) throw new Error("Authentication required");
    return deleteItem("posts", id);
  };
  return {
    fetchPosts,
    fetchPostBySlug,
    createPost,
    updatePost,
    deletePost: removePost,
    generateSlug
  };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b, _c, _d;
    let __temp, __restore;
    const config = useRuntimeConfig();
    const route = useRoute();
    const { fetchPostBySlug } = usePosts();
    const { year, month, day, slug } = route.params;
    const fullSlug = `/${year}/${month}/${day}/${slug}`;
    const { data: post } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `blog-${slug}`,
      () => fetchPostBySlug(fullSlug, config.public.blogType)
    )), __temp = await __temp, __restore(), __temp);
    const seoData = createSeoObject({
      title: post.value.title,
      summary: post.value.description || "",
      imageUri: post.value.cover_image ? `${config.public.pocketbaseUrl}api/files/${post.value.collectionId}/${post.value.id}/${post.value.cover_image}` : void 0,
      pubDate: post.value.created,
      byline: (_b = (_a = post.value.expand) == null ? void 0 : _a.author) == null ? void 0 : _b.username,
      // Note: createSeoObject automatically handles twitter, og, and sailthru based on your logic
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.value.title,
        description: post.value.description || "",
        datePublished: post.value.created,
        dateModified: post.value.updated,
        author: {
          "@type": "Person",
          name: ((_d = (_c = post.value.expand) == null ? void 0 : _c.author) == null ? void 0 : _d.username) || "Author"
        },
        publisher: {
          "@type": "Organization",
          name: config.public.siteName
        }
      }
    });
    const calculateReadingTime = (html) => {
      if (!html) return "1 min read";
      const words = html.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
      return `${Math.ceil(words / 200)} min read`;
    };
    const getInitials = (name) => {
      return name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "A";
    };
    const navigateToTag = (tag) => {
      navigateTo(`/blog/tag/${encodeURIComponent(tag)}`);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_SeoMeta = _sfc_main$4;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_2;
      const _component_SectionsShareTools = ShareTools;
      const _component_ContainersHtml = _sfc_main$7;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_SeoMeta, {
        seoData: unref(seoData),
        "no-index": false
      }, null, _parent));
      if (unref(post)) {
        _push(`<div class="w-full"><nav class="mb-8"><ul class="flex flex-wrap items-center gap-2 text-sm"><li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "transition-colors text-muted-foreground hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Home`);
            } else {
              return [
                createTextVNode("Home")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li class="text-muted-foreground">/</li><li>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/blog",
          class: "transition-colors text-muted-foreground hover:text-primary"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Blog`);
            } else {
              return [
                createTextVNode("Blog")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</li><li class="text-muted-foreground">/</li><li class="font-medium text-foreground">${ssrInterpolate(unref(post).title)}</li></ul></nav>`);
        _push(ssrRenderComponent(_sfc_main$2$1, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$5), { class: "overflow-hidden" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a2, _b2;
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$6), { class: "p-0" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        var _a3, _b3, _c2;
                        if (_push4) {
                          if (unref(post).cover_image) {
                            _push4(`<div class="relative w-full overflow-hidden aspect-auto h-96 lg:h-[500px]"${_scopeId3}><img${ssrRenderAttr("src", `${unref(config).public.pocketbaseUrl}api/files/${unref(post).collectionId}/${unref(post).id}/${unref(post).cover_image}`)}${ssrRenderAttr("alt", unref(post).title)} class="w-full h-full object-cover"${_scopeId3}><div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"${_scopeId3}></div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`<div class="items-center p-6 lg:p-12"${_scopeId3}><div class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40"${_scopeId3}><div class="flex items-center gap-3 text-sm text-muted-foreground"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Calendar), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(_component_ClientOnly, null, {}, _parent4, _scopeId3));
                          _push4(`</div><span class="text-muted-foreground"${_scopeId3}>\u2022</span><div class="flex items-center gap-2 text-sm text-muted-foreground"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Clock), { class: "w-4 h-4" }, null, _parent4, _scopeId3));
                          _push4(` ${ssrInterpolate(calculateReadingTime(unref(post).content))}</div><h1 class="mb-6 text-3xl w-full block font-bold md:text-4xl lg:text-5xl"${_scopeId3}>${ssrInterpolate(unref(post).title)}</h1>`);
                          _push4(ssrRenderComponent(_component_SectionsShareTools, {
                            title: unref(post).title,
                            description: unref(post).description,
                            class: "ml-auto"
                          }, null, _parent4, _scopeId3));
                          _push4(`</div><article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40"${_scopeId3}>`);
                          if (unref(post).description) {
                            _push4(`<p class="text-xl leading-relaxed text-muted-foreground"${_scopeId3}>${(_a3 = unref(post).description) != null ? _a3 : ""}</p>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          if (unref(post).content) {
                            _push4(ssrRenderComponent(_component_ContainersHtml, {
                              content: unref(post).content
                            }, null, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</article>`);
                          if ((_b3 = unref(post).tags) == null ? void 0 : _b3.length) {
                            _push4(`<div class="pt-8 mt-12 border-t border-border/40"${_scopeId3}><h2 class="mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground"${_scopeId3}> Tags </h2><div class="flex flex-wrap gap-2"${_scopeId3}><!--[-->`);
                            ssrRenderList(unref(post).tags, (tag) => {
                              _push4(ssrRenderComponent(unref(_sfc_main$8), {
                                key: tag,
                                variant: "outline",
                                class: "text-sm font-medium transition-all cursor-pointer hover:bg-accent hover:scale-105",
                                onClick: ($event) => navigateToTag(tag)
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(` #${ssrInterpolate(tag)}`);
                                  } else {
                                    return [
                                      createTextVNode(" #" + toDisplayString(tag), 1)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            });
                            _push4(`<!--]--></div></div>`);
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            unref(post).cover_image ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "relative w-full overflow-hidden aspect-auto h-96 lg:h-[500px]"
                            }, [
                              createVNode("img", {
                                src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).collectionId}/${unref(post).id}/${unref(post).cover_image}`,
                                alt: unref(post).title,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"]),
                              createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" })
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "items-center p-6 lg:p-12" }, [
                              createVNode("div", { class: "flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" }, [
                                createVNode("div", { class: "flex items-center gap-3 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Calendar), { class: "w-4 h-4" }),
                                  createVNode(_component_ClientOnly, null, {
                                    default: withCtx(() => {
                                      var _a4;
                                      return [
                                        createVNode("time", {
                                          datetime: unref(post).created
                                        }, toDisplayString((_a4 = unref(formatDate)(unref(post).created)) == null ? void 0 : _a4[0]), 9, ["datetime"])
                                      ];
                                    }),
                                    _: 1
                                  })
                                ]),
                                createVNode("span", { class: "text-muted-foreground" }, "\u2022"),
                                createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Clock), { class: "w-4 h-4" }),
                                  createTextVNode(" " + toDisplayString(calculateReadingTime(unref(post).content)), 1)
                                ]),
                                createVNode("h1", { class: "mb-6 text-3xl w-full block font-bold md:text-4xl lg:text-5xl" }, toDisplayString(unref(post).title), 1),
                                createVNode(_component_SectionsShareTools, {
                                  title: unref(post).title,
                                  description: unref(post).description,
                                  class: "ml-auto"
                                }, null, 8, ["title", "description"])
                              ]),
                              createVNode("article", { class: "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" }, [
                                unref(post).description ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  innerHTML: unref(post).description,
                                  class: "text-xl leading-relaxed text-muted-foreground"
                                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                                unref(post).content ? (openBlock(), createBlock(_component_ContainersHtml, {
                                  key: 1,
                                  content: unref(post).content
                                }, null, 8, ["content"])) : createCommentVNode("", true)
                              ]),
                              ((_c2 = unref(post).tags) == null ? void 0 : _c2.length) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "pt-8 mt-12 border-t border-border/40"
                              }, [
                                createVNode("h2", { class: "mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground" }, " Tags "),
                                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(post).tags, (tag) => {
                                    return openBlock(), createBlock(unref(_sfc_main$8), {
                                      key: tag,
                                      variant: "outline",
                                      class: "text-sm font-medium transition-all cursor-pointer hover:bg-accent hover:scale-105",
                                      onClick: ($event) => navigateToTag(tag)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" #" + toDisplayString(tag), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"]);
                                  }), 128))
                                ])
                              ])) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    if ((_a2 = unref(post).expand) == null ? void 0 : _a2.author) {
                      _push3(ssrRenderComponent(unref(_sfc_main$9), { class: "p-6 border-t border-border/40 bg-muted/20 lg:p-8" }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`<div class="flex flex-col w-full gap-6 sm:flex-row sm:items-center sm:justify-between"${_scopeId3}><div class="flex items-start gap-4"${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(_sfc_main$3), { class: "w-16 h-16 border-2 shadow-md border-border" }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  if (unref(post).expand.author.avatar) {
                                    _push5(ssrRenderComponent(unref(_sfc_main$1), {
                                      src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).expand.author.collectionId}/${unref(post).expand.author.id}/${unref(post).expand.author.avatar}`,
                                      alt: unref(post).expand.author.username
                                    }, null, _parent5, _scopeId4));
                                  } else {
                                    _push5(`<!---->`);
                                  }
                                  _push5(ssrRenderComponent(unref(_sfc_main$2), { class: "text-lg font-semibold" }, {
                                    default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(getInitials(unref(post).expand.author.username))}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(getInitials(unref(post).expand.author.username)), 1)
                                        ];
                                      }
                                    }),
                                    _: 1
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    unref(post).expand.author.avatar ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                      key: 0,
                                      src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).expand.author.collectionId}/${unref(post).expand.author.id}/${unref(post).expand.author.avatar}`,
                                      alt: unref(post).expand.author.username
                                    }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                    createVNode(unref(_sfc_main$2), { class: "text-lg font-semibold" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(getInitials(unref(post).expand.author.username)), 1)
                                      ]),
                                      _: 1
                                    })
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                            _push4(`<div class="flex flex-col gap-1"${_scopeId3}><h3 class="text-lg font-semibold"${_scopeId3}>${ssrInterpolate(unref(post).expand.author.username)}</h3>`);
                            if (unref(post).expand.author.bio) {
                              _push4(`<p class="text-sm leading-relaxed text-muted-foreground"${_scopeId3}>${ssrInterpolate(unref(post).expand.author.bio)}</p>`);
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div></div></div>`);
                          } else {
                            return [
                              createVNode("div", { class: "flex flex-col w-full gap-6 sm:flex-row sm:items-center sm:justify-between" }, [
                                createVNode("div", { class: "flex items-start gap-4" }, [
                                  createVNode(unref(_sfc_main$3), { class: "w-16 h-16 border-2 shadow-md border-border" }, {
                                    default: withCtx(() => [
                                      unref(post).expand.author.avatar ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                        key: 0,
                                        src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).expand.author.collectionId}/${unref(post).expand.author.id}/${unref(post).expand.author.avatar}`,
                                        alt: unref(post).expand.author.username
                                      }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                      createVNode(unref(_sfc_main$2), { class: "text-lg font-semibold" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(getInitials(unref(post).expand.author.username)), 1)
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }),
                                  createVNode("div", { class: "flex flex-col gap-1" }, [
                                    createVNode("h3", { class: "text-lg font-semibold" }, toDisplayString(unref(post).expand.author.username), 1),
                                    unref(post).expand.author.bio ? (openBlock(), createBlock("p", {
                                      key: 0,
                                      class: "text-sm leading-relaxed text-muted-foreground"
                                    }, toDisplayString(unref(post).expand.author.bio), 1)) : createCommentVNode("", true)
                                  ])
                                ])
                              ])
                            ];
                          }
                        }),
                        _: 1
                      }, _parent3, _scopeId2));
                    } else {
                      _push3(`<!---->`);
                    }
                  } else {
                    return [
                      createVNode(unref(_sfc_main$6), { class: "p-0" }, {
                        default: withCtx(() => {
                          var _a3;
                          return [
                            unref(post).cover_image ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "relative w-full overflow-hidden aspect-auto h-96 lg:h-[500px]"
                            }, [
                              createVNode("img", {
                                src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).collectionId}/${unref(post).id}/${unref(post).cover_image}`,
                                alt: unref(post).title,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"]),
                              createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" })
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "items-center p-6 lg:p-12" }, [
                              createVNode("div", { class: "flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" }, [
                                createVNode("div", { class: "flex items-center gap-3 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Calendar), { class: "w-4 h-4" }),
                                  createVNode(_component_ClientOnly, null, {
                                    default: withCtx(() => {
                                      var _a4;
                                      return [
                                        createVNode("time", {
                                          datetime: unref(post).created
                                        }, toDisplayString((_a4 = unref(formatDate)(unref(post).created)) == null ? void 0 : _a4[0]), 9, ["datetime"])
                                      ];
                                    }),
                                    _: 1
                                  })
                                ]),
                                createVNode("span", { class: "text-muted-foreground" }, "\u2022"),
                                createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Clock), { class: "w-4 h-4" }),
                                  createTextVNode(" " + toDisplayString(calculateReadingTime(unref(post).content)), 1)
                                ]),
                                createVNode("h1", { class: "mb-6 text-3xl w-full block font-bold md:text-4xl lg:text-5xl" }, toDisplayString(unref(post).title), 1),
                                createVNode(_component_SectionsShareTools, {
                                  title: unref(post).title,
                                  description: unref(post).description,
                                  class: "ml-auto"
                                }, null, 8, ["title", "description"])
                              ]),
                              createVNode("article", { class: "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" }, [
                                unref(post).description ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  innerHTML: unref(post).description,
                                  class: "text-xl leading-relaxed text-muted-foreground"
                                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                                unref(post).content ? (openBlock(), createBlock(_component_ContainersHtml, {
                                  key: 1,
                                  content: unref(post).content
                                }, null, 8, ["content"])) : createCommentVNode("", true)
                              ]),
                              ((_a3 = unref(post).tags) == null ? void 0 : _a3.length) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "pt-8 mt-12 border-t border-border/40"
                              }, [
                                createVNode("h2", { class: "mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground" }, " Tags "),
                                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(post).tags, (tag) => {
                                    return openBlock(), createBlock(unref(_sfc_main$8), {
                                      key: tag,
                                      variant: "outline",
                                      class: "text-sm font-medium transition-all cursor-pointer hover:bg-accent hover:scale-105",
                                      onClick: ($event) => navigateToTag(tag)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" #" + toDisplayString(tag), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"]);
                                  }), 128))
                                ])
                              ])) : createCommentVNode("", true)
                            ])
                          ];
                        }),
                        _: 1
                      }),
                      ((_b2 = unref(post).expand) == null ? void 0 : _b2.author) ? (openBlock(), createBlock(unref(_sfc_main$9), {
                        key: 0,
                        class: "p-6 border-t border-border/40 bg-muted/20 lg:p-8"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-col w-full gap-6 sm:flex-row sm:items-center sm:justify-between" }, [
                            createVNode("div", { class: "flex items-start gap-4" }, [
                              createVNode(unref(_sfc_main$3), { class: "w-16 h-16 border-2 shadow-md border-border" }, {
                                default: withCtx(() => [
                                  unref(post).expand.author.avatar ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 0,
                                    src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).expand.author.collectionId}/${unref(post).expand.author.id}/${unref(post).expand.author.avatar}`,
                                    alt: unref(post).expand.author.username
                                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                  createVNode(unref(_sfc_main$2), { class: "text-lg font-semibold" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getInitials(unref(post).expand.author.username)), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "flex flex-col gap-1" }, [
                                createVNode("h3", { class: "text-lg font-semibold" }, toDisplayString(unref(post).expand.author.username), 1),
                                unref(post).expand.author.bio ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm leading-relaxed text-muted-foreground"
                                }, toDisplayString(unref(post).expand.author.bio), 1)) : createCommentVNode("", true)
                              ])
                            ])
                          ])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$5), { class: "overflow-hidden" }, {
                  default: withCtx(() => {
                    var _a2;
                    return [
                      createVNode(unref(_sfc_main$6), { class: "p-0" }, {
                        default: withCtx(() => {
                          var _a3;
                          return [
                            unref(post).cover_image ? (openBlock(), createBlock("div", {
                              key: 0,
                              class: "relative w-full overflow-hidden aspect-auto h-96 lg:h-[500px]"
                            }, [
                              createVNode("img", {
                                src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).collectionId}/${unref(post).id}/${unref(post).cover_image}`,
                                alt: unref(post).title,
                                class: "w-full h-full object-cover"
                              }, null, 8, ["src", "alt"]),
                              createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" })
                            ])) : createCommentVNode("", true),
                            createVNode("div", { class: "items-center p-6 lg:p-12" }, [
                              createVNode("div", { class: "flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" }, [
                                createVNode("div", { class: "flex items-center gap-3 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Calendar), { class: "w-4 h-4" }),
                                  createVNode(_component_ClientOnly, null, {
                                    default: withCtx(() => {
                                      var _a4;
                                      return [
                                        createVNode("time", {
                                          datetime: unref(post).created
                                        }, toDisplayString((_a4 = unref(formatDate)(unref(post).created)) == null ? void 0 : _a4[0]), 9, ["datetime"])
                                      ];
                                    }),
                                    _: 1
                                  })
                                ]),
                                createVNode("span", { class: "text-muted-foreground" }, "\u2022"),
                                createVNode("div", { class: "flex items-center gap-2 text-sm text-muted-foreground" }, [
                                  createVNode(unref(Clock), { class: "w-4 h-4" }),
                                  createTextVNode(" " + toDisplayString(calculateReadingTime(unref(post).content)), 1)
                                ]),
                                createVNode("h1", { class: "mb-6 text-3xl w-full block font-bold md:text-4xl lg:text-5xl" }, toDisplayString(unref(post).title), 1),
                                createVNode(_component_SectionsShareTools, {
                                  title: unref(post).title,
                                  description: unref(post).description,
                                  class: "ml-auto"
                                }, null, 8, ["title", "description"])
                              ]),
                              createVNode("article", { class: "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" }, [
                                unref(post).description ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  innerHTML: unref(post).description,
                                  class: "text-xl leading-relaxed text-muted-foreground"
                                }, null, 8, ["innerHTML"])) : createCommentVNode("", true),
                                unref(post).content ? (openBlock(), createBlock(_component_ContainersHtml, {
                                  key: 1,
                                  content: unref(post).content
                                }, null, 8, ["content"])) : createCommentVNode("", true)
                              ]),
                              ((_a3 = unref(post).tags) == null ? void 0 : _a3.length) ? (openBlock(), createBlock("div", {
                                key: 0,
                                class: "pt-8 mt-12 border-t border-border/40"
                              }, [
                                createVNode("h2", { class: "mb-4 text-sm font-semibold tracking-wide uppercase text-muted-foreground" }, " Tags "),
                                createVNode("div", { class: "flex flex-wrap gap-2" }, [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(post).tags, (tag) => {
                                    return openBlock(), createBlock(unref(_sfc_main$8), {
                                      key: tag,
                                      variant: "outline",
                                      class: "text-sm font-medium transition-all cursor-pointer hover:bg-accent hover:scale-105",
                                      onClick: ($event) => navigateToTag(tag)
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(" #" + toDisplayString(tag), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["onClick"]);
                                  }), 128))
                                ])
                              ])) : createCommentVNode("", true)
                            ])
                          ];
                        }),
                        _: 1
                      }),
                      ((_a2 = unref(post).expand) == null ? void 0 : _a2.author) ? (openBlock(), createBlock(unref(_sfc_main$9), {
                        key: 0,
                        class: "p-6 border-t border-border/40 bg-muted/20 lg:p-8"
                      }, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-col w-full gap-6 sm:flex-row sm:items-center sm:justify-between" }, [
                            createVNode("div", { class: "flex items-start gap-4" }, [
                              createVNode(unref(_sfc_main$3), { class: "w-16 h-16 border-2 shadow-md border-border" }, {
                                default: withCtx(() => [
                                  unref(post).expand.author.avatar ? (openBlock(), createBlock(unref(_sfc_main$1), {
                                    key: 0,
                                    src: `${unref(config).public.pocketbaseUrl}api/files/${unref(post).expand.author.collectionId}/${unref(post).expand.author.id}/${unref(post).expand.author.avatar}`,
                                    alt: unref(post).expand.author.username
                                  }, null, 8, ["src", "alt"])) : createCommentVNode("", true),
                                  createVNode(unref(_sfc_main$2), { class: "text-lg font-semibold" }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(getInitials(unref(post).expand.author.username)), 1)
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              }),
                              createVNode("div", { class: "flex flex-col gap-1" }, [
                                createVNode("h3", { class: "text-lg font-semibold" }, toDisplayString(unref(post).expand.author.username), 1),
                                unref(post).expand.author.bio ? (openBlock(), createBlock("p", {
                                  key: 0,
                                  class: "text-sm leading-relaxed text-muted-foreground"
                                }, toDisplayString(unref(post).expand.author.bio), 1)) : createCommentVNode("", true)
                              ])
                            ])
                          ])
                        ]),
                        _: 1
                      })) : createCommentVNode("", true)
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
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../pages/blog/[year]/[month]/[day]/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_-c4HVM0xL.mjs.map
