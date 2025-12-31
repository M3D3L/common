import { defineComponent, ref, computed, watch, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, createBlock, openBlock, Fragment, renderList, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { _ as _sfc_main$3 } from './Card-BcNzGmRo.mjs';
import { _ as _sfc_main$7 } from './CardContent-BeoP9VPq.mjs';
import { _ as _sfc_main$a } from './index-CnW7QFU2.mjs';
import { _ as _sfc_main$9 } from './Textarea-jDz9Vded.mjs';
import { _ as _sfc_main$6, a as _sfc_main$1, b as _sfc_main$2, c as _sfc_main$5, d as _sfc_main$4 } from './SelectValue-DCL2EBub.mjs';
import { _ as _sfc_main$8 } from './Html-BJT4P5oF.mjs';
import { a as usePocketBaseCore } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import 'clsx';
import 'tailwind-merge';
import 'radix-vue';
import 'class-variance-authority';
import './index-K7kOdbQk.mjs';
import './index-C2tg38pJ.mjs';
import 'reka-ui';
import '@radix-icons/vue';
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

const COLLECTION_NAME = "posts";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { fetchRecord, updateItem } = usePocketBaseCore();
    const postList = ref([]);
    const selectedPostId = ref(null);
    const post = ref(null);
    const editableContent = ref("");
    const loading = ref(false);
    const isSaving = ref(false);
    const saveMessage = ref("");
    const saveSuccess = ref(false);
    const hasChanges = computed(() => {
      return post.value && post.value.content !== editableContent.value;
    });
    const fetchSelectedPost = async (id) => {
      if (!id) {
        post.value = null;
        editableContent.value = "";
        return;
      }
      loading.value = true;
      post.value = null;
      saveMessage.value = "";
      try {
        const record = await fetchRecord(COLLECTION_NAME, id);
        post.value = record;
        editableContent.value = record.content || "";
      } catch (error) {
        console.error(`Error fetching post ${id}:`, error);
      } finally {
        loading.value = false;
      }
    };
    const updatePostContent = async () => {
      if (!post.value || !hasChanges.value) {
        saveMessage.value = "No changes to save.";
        saveSuccess.value = false;
        return;
      }
      isSaving.value = true;
      saveMessage.value = "";
      try {
        const updatedRecord = await updateItem(COLLECTION_NAME, post.value.id, {
          content: editableContent.value
        });
        post.value = updatedRecord;
        saveSuccess.value = true;
        saveMessage.value = "Post content updated successfully!";
        setTimeout(() => saveMessage.value = "", 3e3);
      } catch (error) {
        console.error("Error saving post content:", error);
        saveSuccess.value = false;
        saveMessage.value = "Failed to save changes. Check console for details.";
      } finally {
        isSaving.value = false;
      }
    };
    watch(selectedPostId, (newId) => {
      if (newId) {
        fetchSelectedPost(newId);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "container relative z-10 min-h-screen px-4 pt-20 pb-24 mx-auto" }, _attrs))} data-v-71028a0f><div class="w-full" data-v-71028a0f><h1 class="mb-8 text-4xl font-bold" data-v-71028a0f>Content Preview &amp; Editor</h1><div class="mb-8 max-w-lg" data-v-71028a0f><label for="post-select" class="block mb-2 text-lg font-medium" data-v-71028a0f>Select Blog Post:</label>`);
      _push(ssrRenderComponent(unref(_sfc_main$6), {
        modelValue: unref(selectedPostId),
        "onUpdate:modelValue": ($event) => isRef(selectedPostId) ? selectedPostId.value = $event : null,
        id: "post-select"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$1), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$2), { placeholder: "Select a post to edit" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$2), { placeholder: "Select a post to edit" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$5), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(unref(postList), (item) => {
                    _push3(ssrRenderComponent(unref(_sfc_main$4), {
                      key: item.id,
                      value: item.id
                    }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.title)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.title), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(postList), (item) => {
                      return openBlock(), createBlock(unref(_sfc_main$4), {
                        key: item.id,
                        value: item.id
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.title), 1)
                        ]),
                        _: 2
                      }, 1032, ["value"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$1), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$2), { placeholder: "Select a post to edit" })
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$5), null, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(unref(postList), (item) => {
                    return openBlock(), createBlock(unref(_sfc_main$4), {
                      key: item.id,
                      value: item.id
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.title), 1)
                      ]),
                      _: 2
                    }, 1032, ["value"]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(loading)) {
        _push(`<div class="text-center py-12" data-v-71028a0f> Loading post content... </div>`);
      } else if (!unref(selectedPostId)) {
        _push(`<div class="text-center py-12 text-muted-foreground" data-v-71028a0f> Please select a blog post from the dropdown above to view and edit its content. </div>`);
      } else if (unref(post) && unref(post).id) {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-12" data-v-71028a0f><div data-v-71028a0f><h2 class="text-2xl font-semibold mb-4 border-b pb-2" data-v-71028a0f> Live Preview </h2>`);
        _push(ssrRenderComponent(unref(_sfc_main$3), { class: "overflow-hidden" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$7), { class: "p-0" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`<div class="items-center p-6 lg:p-12" data-v-71028a0f${_scopeId2}><div class="flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" data-v-71028a0f${_scopeId2}><h3 class="mb-0 text-3xl w-full block font-bold md:text-4xl" data-v-71028a0f${_scopeId2}>${ssrInterpolate(unref(post).title)}</h3>`);
                    if (unref(post).description) {
                      _push3(`<div class="text-lg leading-relaxed text-muted-foreground italic" data-v-71028a0f${_scopeId2}>${ssrInterpolate(unref(post).description)}</div>`);
                    } else {
                      _push3(`<!---->`);
                    }
                    _push3(`</div><article class="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" data-v-71028a0f${_scopeId2}>`);
                    _push3(ssrRenderComponent(_sfc_main$8, { content: unref(editableContent) }, null, _parent3, _scopeId2));
                    _push3(`</article></div>`);
                  } else {
                    return [
                      createVNode("div", { class: "items-center p-6 lg:p-12" }, [
                        createVNode("div", { class: "flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" }, [
                          createVNode("h3", { class: "mb-0 text-3xl w-full block font-bold md:text-4xl" }, toDisplayString(unref(post).title), 1),
                          unref(post).description ? (openBlock(), createBlock("div", {
                            key: 0,
                            class: "text-lg leading-relaxed text-muted-foreground italic"
                          }, toDisplayString(unref(post).description), 1)) : createCommentVNode("", true)
                        ]),
                        createVNode("article", { class: "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" }, [
                          createVNode(_sfc_main$8, { content: unref(editableContent) }, null, 8, ["content"])
                        ])
                      ])
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(_sfc_main$7), { class: "p-0" }, {
                  default: withCtx(() => [
                    createVNode("div", { class: "items-center p-6 lg:p-12" }, [
                      createVNode("div", { class: "flex flex-wrap items-center gap-4 pb-8 mb-8 border-b border-border/40" }, [
                        createVNode("h3", { class: "mb-0 text-3xl w-full block font-bold md:text-4xl" }, toDisplayString(unref(post).title), 1),
                        unref(post).description ? (openBlock(), createBlock("div", {
                          key: 0,
                          class: "text-lg leading-relaxed text-muted-foreground italic"
                        }, toDisplayString(unref(post).description), 1)) : createCommentVNode("", true)
                      ]),
                      createVNode("article", { class: "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:scroll-mt-24 prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-img:shadow-lg prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border/40" }, [
                        createVNode(_sfc_main$8, { content: unref(editableContent) }, null, 8, ["content"])
                      ])
                    ])
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div data-v-71028a0f><h2 class="text-2xl font-semibold mb-4 border-b pb-2" data-v-71028a0f> HTML Content Editor (${ssrInterpolate(unref(post).id)}) </h2><div class="space-y-4" data-v-71028a0f>`);
        _push(ssrRenderComponent(unref(_sfc_main$9), {
          modelValue: unref(editableContent),
          "onUpdate:modelValue": ($event) => isRef(editableContent) ? editableContent.value = $event : null,
          class: "min-h-[600px] font-mono text-sm",
          placeholder: "Post content HTML goes here..."
        }, null, _parent));
        _push(ssrRenderComponent(unref(_sfc_main$a), {
          onClick: updatePostContent,
          disabled: !unref(hasChanges) || unref(isSaving)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(isSaving) ? "Saving..." : "Save Changes")}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(isSaving) ? "Saving..." : "Save Changes"), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        if (unref(saveMessage)) {
          _push(`<p class="${ssrRenderClass({
            "text-green-500": unref(saveSuccess),
            "text-red-500": !unref(saveSuccess)
          })}" data-v-71028a0f>${ssrInterpolate(unref(saveMessage))}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../pages/blog/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-71028a0f"]]);

export { index as default };
//# sourceMappingURL=index-DIyA1q63.mjs.map
