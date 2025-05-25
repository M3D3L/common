export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // ✅ Tells Nitro to use static output (generates /dist/public)
  nitro: {
    preset: 'static',
  },

  // ✅ Correct base URL for GitHub Pages or subdirectory hosting
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? process.env.NUXT_APP_BASE_URL : '/',
    buildAssetsDir: '/_nuxt/'
  },

  ssr: false, // ✅ Required for full static output

  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'motion-v/nuxt',
  ],

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  build: {
    transpile: ['vueuc'], // ✅ Needed for Framer Motion
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL,
    },
  },
});
