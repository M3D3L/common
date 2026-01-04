import path from "path";
import { blogRoutes } from "./routes/blogRoutes";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  nitro: {
    preset: "github-pages",
    prerender: {
      routes: [...blogRoutes, "/sitemap.xml"],
      crawlLinks: true,
    },
  },
  app: {
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
  },
  ssr: false,
  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxtjs/i18n", "@nuxtjs/sitemap"],
  /* -----------------------------
   * I18N CONFIGURATION
   * ----------------------------- */
  i18n: {
    locales: [
      {
        code: "en",
        iso: "en-US",
        domains: ["guillermomedel.com", "www.guillermomedel.com"],
        name: "English",
      },
    ],
    defaultLocale: "en",
    strategy: "no_prefix",
    detectBrowserLanguage: false,
    differentDomains: true,
  },

  googleFonts: {
    families: {
      Inter: {
        wght: [400],
      },
      Orbitron: {
        wght: [400],
      },
      Poppins: {
        wght: [700],
      },
      Rubik: {
        wght: [500],
      },
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
    url: "https://guillermomedel.com",
    name: "Guillermo Medel",
  },

  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/_nuxt", "/blog/admin"],
      },
    ],
    sitemap: "https://guillermomedel.com/sitemap.xml",
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
      siteName: "GuillermoMedel.com",
      siteUrl: "https://www.guillermomedel.com",
      twitterSite: "@GM3D3L",
      blogType: "posts",
    },
  },
});
