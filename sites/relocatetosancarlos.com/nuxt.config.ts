import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  extends: ["../../nuxt.config.ts"],

  app: {
    baseURL: "/",
    buildAssetsDir: "_nuxt/",
  },
  build: {
    publicPath: "_nuxt/",
    transpile: ["vueuc"],
  },

  nitro: {
    output: { dir: ".output-site" },
    prerender: { failOnError: false },
  },

  ssr: true,
  devtools: { enabled: true },

  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxt/image", "@pinia/nuxt", "@nuxtjs/google-fonts"],

  googleFonts: {
    families: {
      Montserrat: { wght: [300, 400, 500, 700] },
      "Playfair Display": { wght: [400, 500, 700] },
      Cinzel: { wght: [400, 500, 600, 700] },
      "Alegreya Sans SC": { wght: [400, 500, 700] },
      "Cormorant Garamond": { wght: [400, 500, 600, 700] },
    },
    display: "swap",
    preload: true,
    download: true,
  },

  alias: {
    "@common": path.resolve(__dirname, "../../"),
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: "http://64.23.150.184/",
      whatsappNumber: "6444444445",
    },
  },
});
