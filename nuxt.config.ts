import path from "path";
import { defineNuxtModule } from "@nuxt/kit";

const configureSharedComponents = defineNuxtModule({
  meta: { name: "configure-shared-components" },
  setup(_options, nuxt) {
    nuxt.hook("components:dirs", (dirs) => {
      const sharedComponentsDir = path.resolve(__dirname, "components");
      const sharedUiDir = path.resolve(sharedComponentsDir, "ui");

      dirs.forEach((dir) => {
        if (typeof dir === "string") return;

        const resolvedPath = path.resolve(dir.path);
        if (resolvedPath === sharedComponentsDir) dir.extensions = ["vue"];
        if (resolvedPath === sharedUiDir) dir.pattern = "__disabled__";
      });
    });
  },
});

export default defineNuxtConfig({
  srcDir: ".",
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
    configureSharedComponents,
  ],
  shadcn: {
    prefix: "",
    componentDir: path.resolve(__dirname, "components/ui"),
  },

  build: {
    transpile: ["vueuc"],
  },

  vite: {
    ssr: {
      // Shared UI packages must use the app's Vue instance, not the layer's.
      noExternal: ["reka-ui", "radix-vue", "@floating-ui/vue"],
    },
  },

  postcss: {
    plugins: {
      "tailwindcss/nesting": false,
      "tailwindcss/nesting/index.js": {},
    },
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
    },
  },
});
