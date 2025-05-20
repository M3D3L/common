<template>
    <header class="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div class="container flex items-center justify-between h-16">
        <NuxtLink to="/" class="flex items-center gap-2 font-medium">
          <span class="text-lg">{{ headerData.name }}</span>
          <span class="hidden text-sm sm:inline text-muted-foreground">{{ headerData.title }}</span>
        </NuxtLink>
  
        <nav class="items-center hidden gap-6 md:flex">
          <MiscLogo />
        </nav>
  
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon" class="md:hidden" as-child>
            <NuxtLink :to="headerData.cta.href">
              <span class="sr-only">{{ headerData.cta.title }}</span>
              <!-- <Icon name="lucide:mail" class="w-4 h-4" /> -->
            </NuxtLink>
          </Button>
  
          <Button variant="outline" size="sm" class="hidden md:inline-flex">
            <NuxtLink :to="headerData.cta.href" class="flex items-center gap-2">
              <!-- <Icon name="lucide:mail" class="w-4 h-4" /> -->
              <span>{{ headerData.cta.title }}</span>
            </NuxtLink>
          </Button>
  
          <Sheet>
            <SheetTrigger as-child>
              <Button variant="ghost" size="icon" class="md:hidden">
                <!-- <Icon name="lucide:menu" class="w-4 h-4" /> -->
                <span class="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div class="flex flex-col gap-6 mt-8">
                <NuxtLink 
                  v-for="link in headerData.links" 
                  :key="link.title"
                  :to="link.href"
                  class="text-lg font-medium transition-colors hover:text-primary"
                >
                  {{ link.title }}
                </NuxtLink>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  interface HeaderLink {
    title: string
    href: string
  }
  
  interface HeaderCta {
    title: string
    href: string
  }
  
  interface HeaderData {
    name: string
    title: string
    links: HeaderLink[]
    cta: HeaderCta
  }
  
  const headerData: HeaderData = {
    name: 'Guillermo Medel',
    title: 'Full Stack Developer',
    links: [
      { title: 'Home', href: '/' },
      { title: 'Projects', href: '#portfolio' },
      { title: 'Blog', href: '#blogs' },
      { title: 'About', href: '#about' },
      { title: 'Services', href: '#services' }
    ],
    cta: {
      title: 'Contact',
      href: '#contact'
    }
  }

  
  </script>
  
  <style scoped>
  .router-link-active {
    @apply text-primary;
  }
  </style>