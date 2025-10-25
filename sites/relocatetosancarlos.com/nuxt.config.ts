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

  modules: [],

  googleFonts: {
    families: {
      Montserrat: { wght: [300, 400, 500, 700] },
      "Playfair Display": { wght: [400, 500, 700] },
      "Alegreya Sans SC": { wght: [400, 500, 700] },
      "Cormorant Garamond": { wght: [400, 500, 600, 700] },
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

  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
    },
  },
});
