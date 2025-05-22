<script setup>
import { Button } from '@/components/ui/button'
const isDark = useDark()
const toggleDark = useToggle(isDark)
const isMobileMenuOpen = ref(false)
const auth = useAuth()
const route = useRoute()

const getLoginHref = () => {
  // Only add source if we're not on the home page
  return route.path === '/' ? '/login' : `/login?source=${encodeURIComponent(route.path)}`
}

const getRegisterHref = () => {
  // Only add source if we're not on the home page
  return route.path === '/' ? '/register' : `/register?source=${encodeURIComponent(route.path)}`
}

// Links that always show
const mainLinks = computed(() => {
  const mainLinksArray = [
    { label: 'Portfolio', href: '/#portfolio' },
  ]

  // check if on the home '/' page
  if (route.path === '/') {
    mainLinksArray.push(
      { label: 'Skills', href: '#skills' },
      { label: 'Blog', href: '#blogs' },
      { label: 'Contact', href: '#contact' },
    )
  }

  if (!auth.isAuthenticated.value) {
    mainLinksArray.push(
      { label: 'Join Now', href: getRegisterHref() },
      { label: 'Sign in', href: getLoginHref() },
    )
  } else {
    mainLinksArray.push(
      { label: 'Dashboard', href: '/dashboard' },
    )
  }
  return mainLinksArray
})

// watch for route changes to update the mobile menu state
watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
    <div class="container flex items-center justify-between h-16 px-4">
      <NuxtLink to="/" class="flex items-center">
        <span class="flex flex-col logo-text">
          <span class="text-xl font-bold">GuillermoMedel</span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-6">
        <nav class="items-center hidden gap-6 text-sm font-medium md:flex">
          <NuxtLink v-for="link in mainLinks" :key="link.href" :to="link.href"
            class="transition-colors text-foreground/60 hover:text-foreground/80"
            active-class="font-medium text-foreground">
            {{ link.label }}
          </NuxtLink>

          <Button v-if="auth.isAuthenticated.value" @click="auth.logout()" variant="default">
            Logout
          </Button>
        </nav>

        <!-- Dark/Light Mode toggle. Disabling until I work on light mode styles -->
        <!-- <ClientOnly>
          <button @click="toggleDark()" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
            <svg v-if="isDark" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
        </ClientOnly> -->

        <Button v-if="auth.isAuthenticated.value" @click="auth.logout()" variant="default" class="px-3 text-xs md:hidden">
            Logout
        </Button>

        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              :d="isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="isMobileMenuOpen" class="absolute w-full border-b shadow-md bg-background md:hidden">
        <div class="container flex flex-col gap-1 px-4 py-3">
          <NuxtLink v-for="link in mainLinks" :key="link.href" :to="link.href"
            class="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="font-medium text-primary" @click="isMobileMenuOpen = false">
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </header>
</template>