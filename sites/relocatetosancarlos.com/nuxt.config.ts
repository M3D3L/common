import path from "path";
import { blogRoutes } from "./routes/blogRoutes";
import { propertyRoutes } from "./routes/propertyRoutes";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",

  /* -----------------------------
   * DEPLOYMENT
   * ----------------------------- */
  ssr: true,

  nitro: {
    preset: "netlify",
    prerender: {
      routes: [...blogRoutes, ...propertyRoutes, "/sitemap.xml"],
      crawlLinks: true,
    },
  },

  // Force route rules to override the Netlify/Nitro x-robots-tag
  routeRules: {
    "/**": {
      headers: { "x-robots-tag": "index, follow" },
    },
  },

  app: {
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
  },

  devtools: { enabled: true },

  extends: ["../../nuxt.config.ts"],

  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxtjs/i18n", "@nuxtjs/sitemap", "nuxt-svgo"],

  /* -----------------------------
   * I18N CONFIGURATION
   * ----------------------------- */
  i18n: {
    strategy: "no_prefix",
    differentDomains: true,
    detectBrowserLanguage: false,
    defaultLocale: "en",
    locales: [
      {
        code: "en",
        domain: "relocatetosancarlos.com",
      },
      {
        code: "es",
        domain: "vivirensancarlos.com",
      },
    ],
  },

  /* -----------------------------
   * ROUTING
   * ----------------------------- */
  router: {
    options: {
      trailingSlash: true,
    },
  },

  /* -----------------------------
   * SITEMAP
   * ----------------------------- */
  sitemap: {
    urls: [
      { loc: "/" },
      { loc: "/blog/" },
      { loc: "/real-estate/" },
      { loc: "/real-estate/lots/" },
      { loc: "/real-estate/rentals/" },
      { loc: "/real-estate/properties/" },
    ],
    exclude: [
      "/api/**",
      "/_nuxt/**",
      "/blog/admin/**",
      "/real-estate/admin/**",
    ],
  },

  /* -----------------------------
   * ROBOTS.TXT (CRAWL CONTROL ONLY)
   * ----------------------------- */
  robots: {
    // Prevents the module from forcing noindex on non-prod environments
    blockNonSeoBots: false,
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_nuxt/", "/blog/admin/", "/real-estate/admin/"],
      },
    ],
    sitemap: "https://relocatetosancarlos.com/sitemap.xml",
  },

  /* -----------------------------
   * SVG
   * ----------------------------- */
  svgo: {
    autoImportPath: "public/icons",
    componentPrefix: "i",
  },

  /* -----------------------------
   * FONTS
   * ----------------------------- */
  googleFonts: {
    families: {
      Montserrat: { wght: [300, 400, 500, 700] },
      Roboto: { wght: [400, 500, 700] },
    },
    display: "swap",
    preload: true,
    download: true,
  },

  /* -----------------------------
   * BUILD
   * ----------------------------- */
  build: {
    transpile: ["vueuc"],
  },

  /* -----------------------------
   * ALIASES
   * ----------------------------- */
  alias: {
    "@common": path.resolve(__dirname, "../../"),
  },

  /* -----------------------------
   * SITE META
   * ----------------------------- */
  site: {
    url: "https://relocatetosancarlos.com",
    name: "Relocate to San Carlos",
    indexable: true,
  },

  /* -----------------------------
   * RUNTIME CONFIG
   * ----------------------------- */
  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      // whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
      siteName: "RelocateToSanCarlos.com",
      siteUrl: "https://www.relocatetosancarlos.com",
      twitterSite: "@relocatetosc",
      blogType: "relocateBlog",
      chatgptProxyUrl:
        "https://chatgpt-proxy.guillermoantoniomedel.workers.dev",
    },
  },
});
