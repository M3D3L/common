import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  nitro: {
    preset: "github-pages",
  },
  app: {
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
  },
  ssr: false,
  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxtjs/sitemap", "@nuxtjs/robots", "nuxt-svgo"],
  svgo: {
    autoImportPath: "public/icons",
    componentPrefix: "i",
  },

  googleFonts: {
    families: {
      Montserrat: { wght: [300, 400, 500, 700] },
      Roboto: { wght: [400, 500, 700] },
    },
    display: "swap",
    preload: true,
    download: true,
  },

  build: {
    transpile: ["vueuc"],
  },

  alias: {
    "@common": path.resolve(__dirname, "../../"),
  },

  site: {
    url: "https://relocatetosancarlos.com",
    name: "Relocate to San Carlos",
  },

  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/_nuxt", "/blog/admin", "/real-estate/admin"],
      },
    ],
    sitemap: "https://relocatetosancarlos.com/sitemap.xml",
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
      siteName: "RelocateToSanCarlos.com",
      twitterSite: "@relocatetosc",
      blogType: "relocateBlog",
      chatgptProxyUrl:
        "https://chatgpt-proxy.guillermoantoniomedel.workers.dev",
    },
  },
});
