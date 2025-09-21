<template>
  <header class="sticky top-0 z-50 w-full border-b md:text-xs lg:text-sm bg-background/80 backdrop-blur-md">
    <div class="container flex items-center justify-between w-full h-16 mx-auto">
      <NuxtLink to="/" class="mr-4 text-2xl font-bold text-primary logo-text">
        {{ siteName }}
      </NuxtLink>

      <nav class="items-center justify-end hidden w-full gap-6 md:flex">
        <NuxtLink to="/">
          <Home class="w-5 h-5 text-gray-500 hover:text-primary" />
        </NuxtLink>
        <NuxtLink v-for="link in links" :key="link.href" :to="link.href" active-class="font-medium text-primary">
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-6">
        <button @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden">
          <Menu v-if="!isMobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
      <div v-if="isMobileMenuOpen" class="absolute w-full border-b shadow-md bg-background md:hidden">
        <div class="container flex flex-col gap-1 px-4 py-3">
          <NuxtLink to="/" class="px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            active-class="font-medium text-primary" @click="isMobileMenuOpen = false">
            <div class="flex items-center gap-2">
              <Home class="w-5 h-5" />
              <span>Home</span>
            </div>
          </NuxtLink>
          <NuxtLink v-for="link in links" :key="link.href" :to="link.href"
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
import { Home, Menu, X } from 'lucide-vue-next'

interface Link {
  href: string
  label: string
}

const props = defineProps<{
  siteName: string
  links: Link[]
}>()

const isDark = useDark()
const toggleDark = useToggle(isDark)
const isMobileMenuOpen = ref(false)
const route = useRoute()

watch(route, () => {
  isMobileMenuOpen.value = false
})
</script>