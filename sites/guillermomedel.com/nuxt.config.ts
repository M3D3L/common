import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  app: {
    baseURL: "/",
    buildAssetsDir: "_nuxt/",
  },
  nitro: {
    output: {
      dir: ".output-site",
    },
    prerender: { failOnError: false },
  },
  ssr: true,
  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      Inter: {
        wght: [400],
      },
      Nunito: {
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
      Sora: {
        wght: [300],
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

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || "http://64.23.150.184/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444445",
    },
  },
});