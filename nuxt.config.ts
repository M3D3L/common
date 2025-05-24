// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/portfolio2025/',
  },
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
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  build: {
    // Needed for Framer Motion
    transpile: ['vueuc']
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL
    }
  },
  // Target static for GitHub Pages
  ssr: false,
})
