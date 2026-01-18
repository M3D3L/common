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

  extends: ["../relocatetosancarlos.com/nuxt.config.ts"],

  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxtjs/sitemap", "nuxt-svgo", "@nuxtjs/leaflet", "nuxt-gtag"],

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
    // 1. Whitelist only Spanish paths (and the root)
    include: ["/", "/blog/**", "/bienes-raices/**"],
    // 2. Explicitly exclude English patterns as a backup
    exclude: ["/api/**", "/_nuxt/**", "/**/admin/**", "/real-estate/**"],
    // 3. Your static index URLs
    urls: [
      { loc: "/" },
      { loc: "/blog/" },
      { loc: "/bienes-raices/" },
      { loc: "/bienes-raices/terrenos/" },
      { loc: "/bienes-raices/rentas/" },
      { loc: "/bienes-raices/ventas/" },
      { loc: "/venda-su-propiedad/" },
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
    sitemap: "https://vivirensancarlos.com/sitemap.xml",
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
   * ANALYTICS
   * ----------------------------- */
  gtag: {
    id: "G-28H7W00MJK",
    debug: false,
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
    "@local": path.resolve(__dirname, "./"),
    "@relocatetosancarlos": path.resolve(
      __dirname,
      "../relocatetosancarlos.com/"
    ),
  },

  /* -----------------------------
   * SITE META
   * ----------------------------- */
  site: {
    url: "https://vivirensancarlos.com",
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
      environment: process.env.NODE_ENV || "development",
      siteName: "VivirEnSanCarlos.com",
      siteUrl: "https://www.vivirensancarlos.com",

      twitterSite: "@relocatetosc",
      blogType: "relocateBlog",
      chatgptProxyUrl:
        "https://chatgpt-proxy.guillermoantoniomedel.workers.dev",
    },
  },
});
