<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md"
  >
    <div class="container relative flex items-center justify-between h-16 px-4 mx-auto">
      <!-- Logo -->
      <nuxt-link v-if="logo" to="/" class="flex items-center gap-2">
        <img :src="logo" alt="Logo" class="h-12" />
      </nuxt-link>
      <NuxtLink v-else to="/" class="flex items-center">
        <span class="flex flex-col logo-text">
          <span class="text-xl font-bold">{{ siteName }}</span>
        </span>
      </NuxtLink>

      <!-- Right side buttons -->
      <div class="flex items-center gap-4">
        <!-- Desktop nav -->
        <nav class="items-center hidden gap-4 md:flex">
          <!-- Main links -->
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
            active-class="text-primary"
          >
            {{ link.label }}
          </NuxtLink>

          <slot name="extra-links" />

          <!-- Auth buttons for desktop -->
          <template v-if="showAuthButtons">
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Login
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
              >
                Register
              </NuxtLink>
            </template>
            <Button
              v-else
              class="text-xs md:text-sm"
              @click="auth.logout()"
              variant="default"
            >
              Logout
            </Button>
          </template>
        </nav>

        <!-- Dark mode toggle -->
        <ClientOnly>
          <button
            @click="toggleDark()"
            class="p-2 transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
            aria-label="Toggle dark mode"
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>

          <CheckoutView v-if="checkoutToggled" class="fixed right-0 top-32" />
        </ClientOnly>

        <!-- Mobile menu button -->
        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2 transition-colors rounded-md hover:bg-accent hover:text-accent-foreground md:hidden"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute w-full border-b shadow-md bg-background md:hidden"
      >
        <div class="container flex flex-col gap-1 px-4 py-3">
          <!-- Main links -->
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
            active-class="text-primary"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Auth buttons included in mobile list -->
          <template v-if="showAuthButtons">
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
                @click="isMobileMenuOpen = false"
              >
                Login
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="px-3 py-2 text-sm transition-colors rounded-md hover:bg-accent hover:text-accent-foreground"
                @click="isMobileMenuOpen = false"
              >
                Register
              </NuxtLink>
            </template>
            <Button
              v-else
              class="text-xs md:text-sm"
              @click="
                () => {
                  auth.logout();
                  isMobileMenuOpen = false;
                }
              "
              variant="default"
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
