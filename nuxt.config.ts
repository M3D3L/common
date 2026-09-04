import path from "path";

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
    "@nuxtjs/sitemap",
  ],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  hooks: {
    "components:dirs"(dirs) {
      const sharedComponentsDir = path.resolve(__dirname, "components");
      const sharedDir = dirs.find(
        (dir) =>
          typeof dir !== "string" &&
          path.resolve(dir.path) === sharedComponentsDir,
      );

      if (sharedDir && typeof sharedDir !== "string") {
        sharedDir.extensions = ["vue"];
      }
    },
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
