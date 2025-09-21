import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  extends: ["../../nuxt.config.ts"],

  app: {
    baseURL: "/guillermomedel.com/",
    buildAssetsDir: "_nuxt/",
  },

  build: {
    publicPath: "/guillermomedel.com/_nuxt/",
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
      Inter: { wght: [400] },
      Nunito: { wght: [400] },
      Orbitron: { wght: [400] },
      Poppins: { wght: [700] },
      Rubik: { wght: [500] },
      Sora: { wght: [300] },
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
