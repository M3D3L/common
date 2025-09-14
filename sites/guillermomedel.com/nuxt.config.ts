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
  css: ["../../assets/css/tailwind.css"],

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
      // You can also specify an array directly if you only need the default weight (400) or want all available
      // 'Open Sans': true, // Equivalent to { Open+Sans: { wght: [100,200,300,400,500,600,700,800,900] } }
      // 'Lato': [400, 700], // For specific weights
    },
    display: 'swap', // Recommended for performance (prevents FOIT/FOUT)
    preload: true, // Preload fonts for better performance, if needed
    download: true, // Download fonts and serve them locally (recommended for performance and GDPR)
    // base64: false, // Encode fonts as base64 (might not be ideal for all cases)
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
