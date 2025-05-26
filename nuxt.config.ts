export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',

  // ✅ Tells Nitro to use static output (generates /dist/public)
  nitro: {
    preset: 'static',
  },

  // ✅ Correct base URL for GitHub Pages or subdirectory hosting
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    buildAssetsDir: '/_nuxt/'
  },

  // ✅ Required for full static output
  ssr: false,

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
    transpile: ['vueuc'],
  },

  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL || 'http://64.23.150.184/',
    },
  },
});
