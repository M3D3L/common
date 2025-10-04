import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  nitro: {
    preset: 'github-pages',
  },
  app: {
    baseURL: '/',
    buildAssetsDir: '/_nuxt/'
  },
  ssr: false,
  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: [],

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
    display: 'swap',
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
      pocketbaseUrl: process.env.POCKETBASE_URL || "http://64.23.150.184/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
    },
  },
});