interface CreateSeoObjectParams {
  title: string;
  summary?: string;
  imageUri?: string;
  pubDate?: string;
  byline?: string;
  tags?: string;
  keywords?: string;
  siteName?: string;
  twitterSite?: string;
  twitterCreator?: string;
  ogUrl?: string;
  page?: string | number;
  hideSiteName?: boolean;
  jsonLd?: Record<string, unknown> | string | null;
}

const DEFAULT_IMAGE_WIDTH = "1200";
const DEFAULT_IMAGE_HEIGHT = "627";

interface MetaTag {
  hid: string;
  name?: string;
  property?: string;
  content: string;
}

interface LinkTag {
  rel: string;
  href: string;
}

interface ScriptTag {
  type: string;
  children: string;
}

interface SeoObject {
  title: string;
  meta: MetaTag[];
  link: LinkTag[];
  script?: ScriptTag[];
}

// Helper to unwrap Vue refs
function unref<T>(value: T): T extends { value: infer V } ? V : T {
  return (
    value && typeof value === "object" && "value" in value
      ? (value as any).value
      : value
  ) as any;
}

function buildPageTitle(
  title: string,
  page: string,
  siteName: string,
  hideSiteName: boolean
): string {
  const pageNum = page !== "1" ? ` - Page ${page}` : "";
  const siteNameSuffix = hideSiteName ? "" : ` | ${siteName}`;
  return `${title}${pageNum}${siteNameSuffix}`;
}

function normalizeUrl(url: string, page: string): string {
  try {
    const urlObj = new URL(url);
    const isPageOne = page === "1";

    if (isPageOne) {
      urlObj.search = "";
    } else {
      const pageValue = urlObj.searchParams.get("page");
      urlObj.search = "";
      if (pageValue) {
        urlObj.searchParams.set("page", pageValue);
      }
    }

    return urlObj.toString().replace("http:", "https:");
  } catch {
    return url.split("?")[0].replace("http:", "https:");
  }
}

export function createSeoObject({
  title,
  summary = "",
  imageUri,
  pubDate,
  byline,
  tags = "",
  keywords = "",
  siteName = "RelocateToSanCarlos.com",
  twitterSite = "@relocatetosc",
  twitterCreator = "",
  ogUrl = "",
  page = "1",
  hideSiteName = false,
  jsonLd = null,
}: CreateSeoObjectParams): SeoObject {
  // Unwrap everything
  const unwrappedTitle = unref(title);
  const unwrappedSummary = unref(summary);
  const unwrappedPage = unref(page)?.toString() || "1";
  const unwrappedOgUrl = unref(ogUrl);
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

  const rawUrl = unwrappedOgUrl || useRequestURL().href;
  const canonicalUrl = normalizeUrl(rawUrl, unwrappedPage);

  const meta: MetaTag[] = [
    { hid: "description", name: "description", content: unwrappedSummary },

    ...(unwrappedKeywords
      ? [
          {
            hid: "keywords",
            name: "keywords",
            content: unwrappedKeywords,
          },
        ]
      : []),

    { hid: "og:title", property: "og:title", content: finalTitle },
    {
      hid: "og:image:alt",
      property: "og:image:alt",
      content: `An image related to ${unwrappedTitle}`,
    },
    {
      hid: "og:description",
      property: "og:description",
      content: unwrappedSummary,
    },
    { hid: "og:site_name", property: "og:site_name", content: siteName },
    { hid: "og:type", property: "og:type", content: "article" },
    { hid: "og:url", property: "og:url", content: canonicalUrl },
    { hid: "og:locale", property: "og:locale", content: "en_US" },

    { hid: "twitter:title", name: "twitter:title", content: finalTitle },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: unwrappedSummary,
    },
    {
      hid: "twitter:card",
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      hid: "twitter:site",
      name: "twitter:site",
      content: unwrappedTwitterSite,
    },
    {
      hid: "twitter:creator",
      name: "twitter:creator",
      content: unwrappedTwitterCreator || unwrappedTwitterSite,
    },

    { hid: "sailthru.title", name: "sailthru.title", content: finalTitle },
    {
      hid: "sailthru.description",
      name: "sailthru.description",
      content: unwrappedSummary,
    },
  ];

  if (unwrappedImageUri) {
    meta.push(
      { hid: "og:image", property: "og:image", content: unwrappedImageUri },
      {
        hid: "og:image:width",
        property: "og:image:width",
        content: DEFAULT_IMAGE_WIDTH,
      },
      {
        hid: "og:image:height",
        property: "og:image:height",
        content: DEFAULT_IMAGE_HEIGHT,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: unwrappedImageUri,
      },
      {
        hid: "sailthru.image.full",
        name: "sailthru.image.full",
        content: unwrappedImageUri,
      },
      {
        hid: "sailthru.image.thumb",
        name: "sailthru.image.thumb",
        content: unwrappedImageUri,
      }
    );
  }

  if (unwrappedPubDate) {
    meta.push({
      hid: "sailthru.date",
      name: "sailthru.date",
      content: unwrappedPubDate,
    });
  }

  if (unwrappedByline) {
    meta.push({
      hid: "sailthru.author",
      name: "sailthru.author",
      content: unwrappedByline,
    });
  }

  if (unwrappedTags) {
    meta.push({
      hid: "sailthru.tags",
      name: "sailthru.tags",
      content: unwrappedTags,
    });
  }

  const seoObject: SeoObject = {
    title: finalTitle,
    meta,
    link: [{ rel: "canonical", href: canonicalUrl }],
  };

  if (jsonLd) {
    seoObject.script = [
      {
        type: "application/ld+json",
        children:
          typeof jsonLd === "string" ? jsonLd : JSON.stringify(jsonLd, null, 2),
      },
    ];
  }

  return seoObject;
}
