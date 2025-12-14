export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  devtools: { enabled: true },
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "motion-v/nuxt",
    "@nuxtjs/google-fonts",
    "nuxt-swiper",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  build: {
    transpile: ["vueuc"],
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
    },
  },
});