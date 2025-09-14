<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
    <div class="container flex items-center justify-between w-full h-16 px-4 mx-auto">
      <NuxtLink to="/" class="text-2xl font-bold text-primary logo-text">
        RelocateToSanCarlos.com
      </NuxtLink>

      <!-- Desktop nav links -->
      <nav class="items-center justify-end hidden w-full gap-6 md:flex">
        <NuxtLink v-for="link in mainLinks" :key="link.href" :to="link.href" active-class="font-medium text-primary">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-6">
        <!-- Mobile menu button -->
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="isMobileMenuOpen
              ? 'M6 18L18 6M6 6l12 12'
              : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
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

<script setup lang="ts">

const isDark = useDark()
const toggleDark = useToggle(isDark)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const mainLinks = computed(() => {
  const mainLinksArray = [
    { label: 'Blog', href: '/blog/' },
    { label: 'Properties', href: '/real-estate/properties/' },
    { label: 'Rentals', href: '/real-estate/rentals/' },
    { label: 'Lots', href: '/real-estate/lots/' },
    { label: 'Contact', href: '#contact' }
  ]

  return mainLinksArray
})

watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>