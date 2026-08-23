import path from "path";
import { blogRoutes } from "./routes/blogRoutes";

export default defineNuxtConfig({
  compatibilityDate: "2025-08-30",
  nitro: {
    preset: "github-pages",
    prerender: {
      routes: [...blogRoutes, "/sitemap.xml"],
      crawlLinks: true,
    },
  },
  app: {
    baseURL: "/",
    buildAssetsDir: "/_nuxt/",
  },
  ssr: false,
  devtools: { enabled: true },
  extends: ["../../nuxt.config.ts"],
  css: ["@/assets/css/tailwind.css"],

  modules: ["@nuxtjs/sitemap"],

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
    display: "swap",
    preload: true,
    download: true,
  },

  build: {
    transpile: ["vueuc", "html-to-image"],
  },
  vite: {
    build: {
      rollupOptions: {
        // This ensures the library is available in your client-side bundles
        external: [],
      },
    },
    // Force optimization to prevent resolution errors
    optimizeDeps: {
      include: ["html-to-image"],
    },
  },
  alias: {
    "@common": path.resolve(__dirname, "../../"),
  },

  site: {
    url: "https://guillermomedel.com",
    name: "Guillermo Medel",
  },

  robots: {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/_nuxt", "/blog/admin"],
      },
    ],
    sitemap: "https://guillermomedel.com/sitemap.xml",
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl:
        process.env.POCKETBASE_URL || "https://api.sancarlosinsider.com/",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "6444444444",
      environment: process.env.NODE_ENV || "development",
      siteName: "GuillermoMedel.com",
      siteUrl: "https://www.guillermomedel.com",
      twitterSite: "@GM3D3L",
      blogType: "posts",
      business: {
        brandName: process.env.BUSINESS_BRAND_NAME || "Guillermo Medel",
        businessName: process.env.BUSINESS_NAME || "Guillermo Medel",
        logoUrl: process.env.BUSINESS_LOGO_URL || "/images/block-me.webp",
        whatsappNumber:
          process.env.BUSINESS_WHATSAPP_NUMBER ||
          process.env.WHATSAPP_NUMBER ||
          "6221523259",
        menuUrl: process.env.BUSINESS_MENU_URL || "https://guillermomedel.com",
        header: {
          eyebrow: process.env.BUSINESS_HEADER_EYEBROW || "Portfolio",
          subtitle: process.env.BUSINESS_HEADER_SUBTITLE || "",
          menuTitle: process.env.BUSINESS_HEADER_MENU_TITLE || "Navigation",
        },
        menuBroadcast: {
          greeting: process.env.BUSINESS_MENU_BROADCAST_GREETING || "Hola",
          priceOne: process.env.BUSINESS_MENU_BROADCAST_PRICE_ONE || "",
          priceTwo: process.env.BUSINESS_MENU_BROADCAST_PRICE_TWO || "",
          cta: process.env.BUSINESS_MENU_BROADCAST_CTA || "",
          cutoff: process.env.BUSINESS_MENU_BROADCAST_CUTOFF || "",
          footer: process.env.BUSINESS_MENU_BROADCAST_FOOTER || "",
        },
        nav: {
          publicLinks: [],
          staffLinks: [],
        },
      },
    },
  },
});
