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
        brandName: process.env.BUSINESS_BRAND_NAME || "Breezy Meals",
        businessName: process.env.BUSINESS_NAME || "Breezy Market",
        logoUrl:
          process.env.BUSINESS_LOGO_URL ||
          "https://cdn.shopify.com/oxygen-v2/57245/154448/316060/3919871/assets/breezy-BBRcmAK6.png",
        whatsappNumber:
          process.env.BUSINESS_WHATSAPP_NUMBER ||
          process.env.WHATSAPP_NUMBER ||
          "6221523259",
        menuUrl:
          process.env.BUSINESS_MENU_URL || "https://breezy-meals.com/menu",
        header: {
          eyebrow: process.env.BUSINESS_HEADER_EYEBROW || "Comida corrida",
          subtitle: process.env.BUSINESS_HEADER_SUBTITLE || "",
          menuTitle:
            process.env.BUSINESS_HEADER_MENU_TITLE || "Menú de Navegación",
        },
        menuBroadcast: {
          greeting:
            process.env.BUSINESS_MENU_BROADCAST_GREETING ||
            "¡Hola! ¡Buen día! ☀️🌊\nAquí Breezy 🦭 compartiéndote el *Menú del Día* de *Breezy Market* 🌵🌮",
          priceOne: process.env.BUSINESS_MENU_BROADCAST_PRICE_ONE || "$120 MXN",
          priceTwo: process.env.BUSINESS_MENU_BROADCAST_PRICE_TWO || "$120 MXN",
          cta:
            process.env.BUSINESS_MENU_BROADCAST_CTA ||
            "🛒 *¡HAZ TU PEDIDO AQUÍ!*",
          cutoff:
            process.env.BUSINESS_MENU_BROADCAST_CUTOFF ||
            "⏰ _Ordena antes de las 4:00 PM para recibir tu comida calientita._",
          footer:
            process.env.BUSINESS_MENU_BROADCAST_FOOTER ||
            "🌊 ¡Buen provecho desde San Carlos! 🦭",
        },
        nav: {
          publicLinks: [
            { to: "/menu", label: "Menú" },
            { to: "/menu-semanal", label: "Calendario" },
            { to: "/promos", label: "Promos" },
            { to: "/tienda", label: "Tienda" },
          ],
          staffLinks: [
            { to: "/inicio", label: "🕒" },
            { to: "/checklists", label: "Checklists" },
            { to: "/socios", label: "Miembros" },
            { to: "/orders", label: "Órdenes" },
            { to: "/menu-items", label: "Menu Items" },
            { to: "/store-items", label: "Store Items" },
            { to: "/semana/menu", label: "Menu Control" },
            { to: "/semana/calendario", label: "Calendario" },
            { to: "/labels", label: "Etiquetas" },
          ],
        },
      },
    },
  },
});
