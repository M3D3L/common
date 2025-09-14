import path from "path";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",

  // ✅ Nitro preset (your comment said "static" but this is set to SSR)
  nitro: {
    preset: "ssr",
  },

  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || "/",
    buildAssetsDir: "/_nuxt/",
  },

  ssr: true,

  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxtjs/google-fonts",   // needed for the googleFonts{} block below
    // [
    //   "@nuxtjs/google-gtag",
    //   {
    //     id: process.env.NUXT_PUBLIC_GTAG_ID || "G-XXXXXXXXXX",
    //     config: {
    //       anonymize_ip: true,
    //       send_page_view: false,
    //       linker: {
    //         domains: ["relocatetosancarlos.com"],
    //       },
    //     },
    //     debug: process.env.NODE_ENV !== "production",
    //     disableAutoPageTrack: false,
    //   }
    // ],
  ],

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

  build: {
    transpile: ["vueuc"],
  },

  alias: {
    "@common": path.resolve(__dirname, "../../../common"),
    "@local": path.resolve(__dirname, "./"),
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || "http://64.23.150.184/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
    },
  },
});
