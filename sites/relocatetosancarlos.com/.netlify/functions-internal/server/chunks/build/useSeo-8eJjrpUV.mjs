import { defineComponent, computed, useSSRContext } from 'vue';
import { ssrRenderSlot } from 'vue/server-renderer';
import { c as useRoute, b as useRuntimeConfig, u as useHead } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SeoMeta",
  __ssrInlineRender: true,
  props: {
    seoData: { default: void 0 },
    noIndex: { type: Boolean, default: false }
  },
  setup(__props) {
    const props = __props;
    const headConfig = computed(() => {
      const base = props.seoData || { meta: [], link: [], script: [] };
      return {
        title: base.title,
        meta: [
          ...base.meta,
          {
            name: "robots",
            content: props.noIndex ? "noindex, nofollow" : "index, follow"
          }
        ],
        link: [...base.link || []],
        script: [...base.script || []]
      };
    });
    useHead(headConfig);
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("../../components/SeoMeta.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DEFAULT_IMAGE_WIDTH = "1200";
const DEFAULT_IMAGE_HEIGHT = "627";
function unref(value) {
  return value && typeof value === "object" && "value" in value ? value.value : value;
}
function buildPageTitle(title, page, siteName, hideSiteName) {
  const pageNum = page !== "1" ? ` - Page ${page}` : "";
  const siteNameSuffix = hideSiteName ? "" : ` | ${siteName}`;
  return `${title}${pageNum}${siteNameSuffix}`;
}
function normalizeUrl(url, page) {
  if (!url) return "";
  try {
    const sanitizedBase = url.replace(/\/$/, "");
    const urlObj = new URL(sanitizedBase);
    const isPageOne = page === "1";
    if (isPageOne) {
      urlObj.search = "";
    } else {
      urlObj.searchParams.set("page", page);
    }
    return urlObj.toString().replace("http:", "https:");
  } catch {
    return url.split("?")[0].replace("http:", "https:");
  }
}
function createSeoObject({
  title,
  summary = "",
  imageUri,
  pubDate,
  byline,
  tags = "",
  keywords = "",
  twitterCreator = "",
  page = "1",
  hideSiteName = false,
  jsonLd = null
}) {
  var _a;
  const config = useRuntimeConfig();
  const route = useRoute();
  const siteName = config.public.siteName || "";
  const baseSiteUrl = config.public.siteUrl || "";
  const twitterSite = config.public.twitterSite;
  const unwrappedTitle = unref(title);
  const unwrappedSummary = unref(summary);
  const unwrappedPage = ((_a = unref(page)) == null ? void 0 : _a.toString()) || "1";
  const unwrappedImageUri = unref(imageUri);
  const unwrappedPubDate = unref(pubDate);
  const unwrappedByline = unref(byline);
  const unwrappedTags = unref(tags);
  const unwrappedKeywords = unref(keywords);
  const unwrappedTwitterSite = unref(twitterSite);
  const unwrappedTwitterCreator = unref(twitterCreator);
  const finalTitle = buildPageTitle(
    unwrappedTitle,
    unwrappedPage,
    siteName,
    hideSiteName
  );
  const fullUrlWithDomain = `${baseSiteUrl.replace(/\/$/, "")}${route.path}`;
  const canonicalUrl = normalizeUrl(fullUrlWithDomain, unwrappedPage);
  const meta = [
    {
      hid: "description",
      name: "description",
      content: unwrappedSummary || ""
    },
    ...unwrappedKeywords ? [{ hid: "keywords", name: "keywords", content: unwrappedKeywords }] : [],
    { hid: "og:title", property: "og:title", content: finalTitle || "" },
    {
      hid: "og:image:alt",
      property: "og:image:alt",
      content: `An image related to ${unwrappedTitle}`
    },
    {
      hid: "og:description",
      property: "og:description",
      content: unwrappedSummary || ""
    },
    { hid: "og:site_name", property: "og:site_name", content: siteName || "" },
    { hid: "og:type", property: "og:type", content: "article" },
    { hid: "og:url", property: "og:url", content: canonicalUrl || "" },
    { hid: "og:locale", property: "og:locale", content: "en_US" },
    { hid: "twitter:title", name: "twitter:title", content: finalTitle || "" },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: unwrappedSummary || ""
    },
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image"
    },
    {
      hid: "twitter:site",
      name: "twitter:site",
      content: unwrappedTwitterSite || ""
    },
    {
      hid: "twitter:creator",
      name: "twitter:creator",
      content: unwrappedTwitterCreator || unwrappedTwitterSite || ""
    },
    {
      hid: "sailthru.title",
      name: "sailthru.title",
      content: finalTitle || ""
    },
    {
      hid: "sailthru.description",
      name: "sailthru.description",
      content: unwrappedSummary || ""
    }
  ];
  if (unwrappedImageUri) {
    meta.push(
      { hid: "og:image", property: "og:image", content: unwrappedImageUri },
      {
        hid: "og:image:width",
        property: "og:image:width",
        content: DEFAULT_IMAGE_WIDTH
      },
      {
        hid: "og:image:height",
        property: "og:image:height",
        content: DEFAULT_IMAGE_HEIGHT
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: unwrappedImageUri
      },
      {
        hid: "sailthru.image.full",
        name: "sailthru.image.full",
        content: unwrappedImageUri
      },
      {
        hid: "sailthru.image.thumb",
        name: "sailthru.image.thumb",
        content: unwrappedImageUri
      }
    );
  }
  if (unwrappedPubDate) {
    meta.push({
      hid: "sailthru.date",
      name: "sailthru.date",
      content: unwrappedPubDate
    });
  }
  if (unwrappedByline) {
    meta.push({
      hid: "sailthru.author",
      name: "sailthru.author",
      content: unwrappedByline
    });
  }
  if (unwrappedTags) {
    meta.push({
      hid: "sailthru.tags",
      name: "sailthru.tags",
      content: unwrappedTags
    });
  }
  const seoObject = {
    title: finalTitle,
    meta,
    link: [{ rel: "canonical", href: canonicalUrl }]
  };
  if (jsonLd) {
    seoObject.script = [
      {
        type: "application/ld+json",
        children: typeof jsonLd === "string" ? jsonLd : JSON.stringify(jsonLd, null, 2)
      }
    ];
  }
  return seoObject;
}

export { _sfc_main as _, createSeoObject as c };
//# sourceMappingURL=useSeo-8eJjrpUV.mjs.map
