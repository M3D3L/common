// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  app: {
    baseURL: '/',
    head: {
      meta: [
        {
          name: 'Content-Security-Policy',
          content: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self' https://m3del.github.io data:; connect-src 'self' ${process.env.POCKETBASE_URL ? process.env.POCKETBASE_URL : ''}; frame-src 'self';"
        }
      ]
    }
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
    prefix: '',
    componentDir: './components/ui'
  },
  build: {
    transpile: ['vueuc']
  },
  runtimeConfig: {
    public: {
      pocketbaseUrl: process.env.POCKETBASE_URL
    }
  },
  ssr: false,
  nitro: {
    preset: 'github-pages'
  }
})