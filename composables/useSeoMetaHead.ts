import type { ComputedRef } from "vue";

interface SeoMetaHeadInput {
  seoData?: Record<string, any>;
  follow?: boolean;
}

interface RuntimePublicConfig {
  siteName?: string;
  siteUrl?: string;
  twitterSite?: string;
  business?: {
    brandName?: string;
    logoUrl?: string;
    whatsappNumber?: string;
    menuUrl?: string;
  };
}

interface HeadScriptItem {
  type?: string;
  children?: string;
  [key: string]: any;
}

const DEFAULT_BREEZY_TITLE =
  "Breezy Meals San Carlos, Sonora | Comida auténtica y abarrotes a domicilio";
const DEFAULT_BREEZY_DESCRIPTION =
  "Comida auténtica y abarrotes a domicilio en San Carlos, Sonora. Restaurante y tienda de conveniencia. Pide en línea para entrega o para llevar (order online).";
const DEFAULT_BREEZY_KEYWORDS =
  "Breezy Meals San Carlos Sonora, comida auténtica San Carlos, abarrotes a domicilio San Carlos, restaurante San Carlos Sonora, tienda de conveniencia San Carlos, comida para llevar San Carlos, pedir en línea San Carlos, order online San Carlos";

function hasMetaByName(meta: Record<string, any>[], name: string) {
  return meta.some((item) => item?.name === name);
}

function hasMetaByProperty(meta: Record<string, any>[], property: string) {
  return meta.some((item) => item?.property === property);
}

function hasCanonical(links: Record<string, any>[]) {
  return links.some((item) => item?.rel === "canonical");
}

function hasJsonLdScript(scripts: HeadScriptItem[]) {
  return scripts.some((item) => item?.type === "application/ld+json");
}

function normalizePhone(input?: string) {
  const digits = String(input || "").replace(/\D+/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("52")) return `+${digits}`;
  if (digits.length === 10) return `+52${digits}`;
  return `+${digits}`;
}

function breezyPageMetadata(path: string) {
  if (path.startsWith("/menu")) {
    return {
      title: "Menú del día | Breezy Meals San Carlos, Sonora",
      description:
        "Ordena el menú del día en San Carlos, Sonora. Entrega a domicilio o para llevar. Order online.",
    };
  }

  if (path.startsWith("/tienda")) {
    return {
      title: "Tienda y Abarrotes | Breezy Meals San Carlos Sonora",
      description:
        "Compra abarrotes y esenciales en San Carlos, Sonora. Agrégalos a tu pedido para entrega a domicilio o para llevar.",
    };
  }

  if (path.startsWith("/promos")) {
    return {
      title: "Promociones | Breezy Meals San Carlos Sonora",
      description:
        "Descubre promociones de Breezy Meals y pide en línea. Entrega a domicilio o para llevar en San Carlos, Sonora.",
    };
  }

  if (path.startsWith("/menu-semanal") || path.startsWith("/semana")) {
    return {
      title: "Menú semanal | Breezy Meals San Carlos Sonora",
      description:
        "Consulta el menú semanal y haz tu pedido en línea para entrega a domicilio o para llevar en San Carlos, Sonora.",
    };
  }

  return {
    title: DEFAULT_BREEZY_TITLE,
    description: DEFAULT_BREEZY_DESCRIPTION,
  };
}

export function useSeoMetaHead(
  input: SeoMetaHeadInput | ComputedRef<SeoMetaHeadInput>,
) {
  const route = useRoute();
  const runtimeConfig = useRuntimeConfig();
  const publicConfig = runtimeConfig.public as RuntimePublicConfig;

  const normalizedInput = computed(() => unref(input) || {});

  const siteName = computed(
    () => publicConfig.siteName || publicConfig.business?.brandName,
  );

  const businessName = computed(
    () => publicConfig.business?.brandName || siteName.value || "Breezy Meals",
  );

  const isBreezyMeals = computed(() => {
    const haystack =
      `${siteName.value || ""} ${businessName.value || ""}`.toLowerCase();
    return (
      haystack.includes("breezy meals") || haystack.includes("breezy market")
    );
  });

  const siteUrl = computed(() => {
    const configured = String(publicConfig.siteUrl || "").trim();
    return configured ? configured.replace(/\/+$/, "") : "";
  });

  const canonicalUrl = computed(() => {
    if (!siteUrl.value) return undefined;
    const cleanPath =
      route.path.length > 1 ? route.path.replace(/\/+$/, "") : route.path;
    return `${siteUrl.value}${cleanPath}`;
  });

  const headConfig = computed(() => {
    const base = normalizedInput.value.seoData || {
      meta: [],
      link: [],
      script: [],
    };
    const follow = normalizedInput.value.follow ?? true;
    const baseMeta = Array.isArray(base.meta) ? [...base.meta] : [];
    const baseLinks = Array.isArray(base.link) ? [...base.link] : [];
    const baseScripts = Array.isArray(base.script) ? [...base.script] : [];

    const breezyDefaults = isBreezyMeals.value
      ? breezyPageMetadata(route.path)
      : undefined;

    const resolvedTitle = base.title || breezyDefaults?.title;

    const description =
      baseMeta.find((item) => item?.name === "description")?.content ||
      breezyDefaults?.description ||
      `Explore ${siteName.value || "our site"}.`;

    const keywords =
      baseMeta.find((item) => item?.name === "keywords")?.content ||
      (isBreezyMeals.value ? DEFAULT_BREEZY_KEYWORDS : undefined);

    const locale =
      baseMeta.find((item) => item?.property === "og:locale")?.content ||
      (isBreezyMeals.value ? "es_MX" : "en_US");

    if (!hasMetaByName(baseMeta, "robots")) {
      baseMeta.push({
        name: "robots",
        content: follow ? "index, follow" : "noindex, nofollow",
      });
    }

    if (!hasMetaByName(baseMeta, "description")) {
      baseMeta.push({ name: "description", content: description });
    }

    if (!hasMetaByName(baseMeta, "keywords") && keywords) {
      baseMeta.push({ name: "keywords", content: keywords });
    }

    if (!hasMetaByProperty(baseMeta, "og:type")) {
      baseMeta.push({ property: "og:type", content: "website" });
    }

    if (!hasMetaByProperty(baseMeta, "og:title") && resolvedTitle) {
      baseMeta.push({ property: "og:title", content: resolvedTitle });
    }

    if (!hasMetaByProperty(baseMeta, "og:description")) {
      baseMeta.push({ property: "og:description", content: description });
    }

    if (!hasMetaByProperty(baseMeta, "og:site_name") && siteName.value) {
      baseMeta.push({ property: "og:site_name", content: siteName.value });
    }

    if (!hasMetaByProperty(baseMeta, "og:url") && canonicalUrl.value) {
      baseMeta.push({ property: "og:url", content: canonicalUrl.value });
    }

    if (!hasMetaByProperty(baseMeta, "og:locale") && locale) {
      baseMeta.push({ property: "og:locale", content: locale });
    }

    if (!hasMetaByName(baseMeta, "twitter:card")) {
      baseMeta.push({ name: "twitter:card", content: "summary_large_image" });
    }

    if (!hasMetaByName(baseMeta, "twitter:title") && resolvedTitle) {
      baseMeta.push({ name: "twitter:title", content: resolvedTitle });
    }

    if (!hasMetaByName(baseMeta, "twitter:description")) {
      baseMeta.push({ name: "twitter:description", content: description });
    }

    if (!hasMetaByName(baseMeta, "twitter:site") && publicConfig.twitterSite) {
      baseMeta.push({
        name: "twitter:site",
        content: publicConfig.twitterSite,
      });
    }

    if (!hasCanonical(baseLinks) && canonicalUrl.value) {
      baseLinks.push({ rel: "canonical", href: canonicalUrl.value });
    }

    if (isBreezyMeals.value && follow && !hasJsonLdScript(baseScripts)) {
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["LocalBusiness", "Restaurant", "ConvenienceStore"],
        name: businessName.value,
        description: DEFAULT_BREEZY_DESCRIPTION,
        url: canonicalUrl.value || siteUrl.value,
        image: publicConfig.business?.logoUrl,
        telephone: normalizePhone(publicConfig.business?.whatsappNumber),
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Carlos",
          addressRegion: "Sonora",
          addressCountry: "MX",
        },
        areaServed: {
          "@type": "City",
          name: "San Carlos",
        },
        servesCuisine: ["Mexicana", "Regional auténtica"],
        hasMenu: publicConfig.business?.menuUrl,
        potentialAction: {
          "@type": "OrderAction",
          target:
            publicConfig.business?.menuUrl ||
            canonicalUrl.value ||
            siteUrl.value,
        },
      };

      baseScripts.push({
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      });
    }

    return {
      title: resolvedTitle,

      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, viewport-fit=cover",
        },
        { name: "format-detection", content: "telephone=no" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        ...baseMeta,
      ],
      link: baseLinks,
      script: baseScripts,
    };
  });

  useHead(headConfig);

  return {
    headConfig,
    canonicalUrl,
  };
}
