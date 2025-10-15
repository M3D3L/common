<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container relative flex items-center justify-between h-16 px-4 mx-auto lg:px-6">
      <!-- Logo -->
      <nuxt-link 
        v-if="logo" 
        to="/" 
        class="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <img :src="logo" alt="Logo" class="h-10 md:h-12" />
      </nuxt-link>
      <NuxtLink 
        v-else 
        to="/" 
        class="flex items-center transition-colors hover:text-primary"
      >
        <span class="flex flex-col logo-text">
          <span class="text-lg font-bold md:text-xl">{{ siteName }}</span>
        </span>
      </NuxtLink>

      <!-- Right side buttons -->
      <div class="flex items-center gap-2 md:gap-4">
        <!-- Desktop nav -->
        <nav class="items-center hidden gap-1 md:flex">
          <!-- Main links -->
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="relative px-4 py-2 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:text-foreground group"
            active-class="font-semibold text-primary"
          >
            {{ link.label }}
            <!-- Active indicator -->
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
          </NuxtLink>

          <slot name="extra-links" />

          <!-- Auth buttons for desktop -->
          <template v-if="showAuthButtons">
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-4 py-2 text-sm font-medium transition-all rounded-lg hover:bg-accent/50"
              >
                Login
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="px-4 py-2 text-sm font-medium transition-all rounded-lg shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md"
              >
                Register
              </NuxtLink>
            </template>
            <Button
              v-else
              class="text-sm font-medium shadow-sm hover:shadow-md"
              @click="auth.logout()"
              variant="default"
              size="sm"
            >
              Logout
            </Button>
          </template>
        </nav>

        <!-- Dark mode toggle -->
        <ClientOnly>
          <button
            @click="toggleDark()"
            class="p-2.5 transition-all rounded-lg hover:bg-accent/50 hover:scale-110 active:scale-95"
            aria-label="Toggle dark mode"
          >
            <Sun v-if="isDark" class="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-180" />
            <Moon v-else class="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-12" />
          </button>

          <CheckoutView v-if="checkoutToggled" class="fixed right-0 top-32" />
        </ClientOnly>

        <!-- Mobile menu button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2.5 transition-all rounded-lg hover:bg-accent/50 md:hidden hover:scale-110 active:scale-95"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-90" />
          <Menu v-else class="w-5 h-5 transition-transform duration-200 rotate-0 hover:scale-110" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute w-full border-b shadow-lg border-border/40 bg-background/95 backdrop-blur md:hidden"
      >
        <div class="container flex flex-col gap-1 px-4 py-4">
          <!-- Main links -->
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:translate-x-1 active:scale-95"
            active-class="font-semibold text-primary bg-accent/30"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Divider -->
          <div v-if="showAuthButtons" class="h-px my-2 bg-border/40" />

          <!-- Auth buttons included in mobile list -->
          <template v-if="showAuthButtons">
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-4 py-3 text-sm font-medium transition-all rounded-lg hover:bg-accent/50 hover:translate-x-1 active:scale-95"
                @click="isMobileMenuOpen = false"
              >
                Login
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="px-4 py-3 text-sm font-semibold transition-all rounded-lg shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:translate-x-1 active:scale-95"
                @click="isMobileMenuOpen = false"
              >
                Register
              </NuxtLink>
            </template>
            <Button
              v-else
              class="w-full text-sm font-medium shadow-sm"
              @click="
                () => {
                  auth.logout();
                  isMobileMenuOpen = false;
                }
              "
              variant="default"
              size="sm"
            >
              Logout
            </Button>
          </template>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import useAuth from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import { Sun, Moon, ShoppingCart, Menu, X } from "lucide-vue-next";

interface NavLink {
  href: string;
  label: string;
}

const props = defineProps({
  links: {
    type: Array as () => NavLink[],
    default: () => [],
  },
  siteName: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: "",
  },
  showAuthButtons: {
    type: Boolean,
    default: true,
  },
});

const auth = useAuth();
const route = useRoute();
const isMobileMenuOpen = ref(false);
const checkoutToggled = ref(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);

const getLoginHref = () =>
  route.path === "/"
    ? "/login"
    : `/login?source=${encodeURIComponent(route.path)}`;

const getRegisterHref = () =>
  route.path === "/"
    ? "/register"
    : `/register?source=${encodeURIComponent(route.path)}`;

watch(route, () => {
  isMobileMenuOpen.value = false;
});
</script>