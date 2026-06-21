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

  modules: ["@nuxtjs/sitemap"],

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
    transpile: ["vueuc", "html-to-image"],
  },
  vite: {
    build: {
      rollupOptions: {
        // This ensures the library is available in your client-side bundles
        external: [],
      },
    },
    // Force optimization to prevent resolution errors
    optimizeDeps: {
      include: ["html-to-image"],
    },
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
      environment: process.env.NODE_ENV || "development",
      siteName: "GuillermoMedel.com",
      siteUrl: "https://www.guillermomedel.com",
      twitterSite: "@GM3D3L",
      blogType: "posts",
    },
  },
});
