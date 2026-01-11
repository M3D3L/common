<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container mx-auto flex h-20 items-center justify-between px-4">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 transition-transform hover:scale-[1.01] active:scale-95"
      >
        <img v-if="logo" :src="logo" alt="Logo" class="h-10 md:h-12 w-auto" />
        <div v-else class="flex flex-col leading-none">
          <span class="text-xl font-bold tracking-tight md:text-2xl">
            {{ siteName }}
          </span>
          <span
            v-if="slogan"
            class="text-[10px] font-semibold uppercase tracking-[0.3em] text-muted-foreground"
          >
            {{ slogan }}
          </span>
        </div>
      </NuxtLink>

      <nav class="hidden items-center gap-8 lg:flex ml-auto mr-6">
        <NuxtLink
          v-for="link in links"
          :key="link.href"
          :to="link.href"
          class="text-sm font-medium transition-colors hover:text-primary text-foreground/70"
          active-class="text-primary font-semibold"
        >
          {{ link.label }}
        </NuxtLink>
        <slot name="extra-links" />
      </nav>

      <div class="flex items-center gap-2">
        <ClientOnly>
          <button
            @click="toggleDark()"
            class="p-2.5 transition-all rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Toggle dark mode"
          >
            <Sun v-if="isDark" class="w-5 h-5" />
            <Moon v-else class="w-5 h-5" />
          </button>
        </ClientOnly>

        <div class="hidden items-center gap-2 md:flex">
          <template v-if="showAuthButtons">
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Sign In
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 active:scale-95"
              >
                Join Now
              </NuxtLink>
            </template>
            <Button
              v-else
              @click="auth.logout()"
              variant="outline"
              size="sm"
              class="rounded-full px-5"
            >
              Log out
            </Button>
          </template>
        </div>

        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="flex h-10 w-10 items-center justify-center rounded-full hover:bg-accent lg:hidden transition-colors"
          aria-label="Toggle menu"
        >
          <X v-if="isMobileMenuOpen" class="w-5 h-5" />
          <Menu v-else class="w-5 h-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div
        v-if="isMobileMenuOpen"
        class="absolute inset-x-0 top-full border-b border-border bg-background p-6 shadow-xl lg:hidden"
      >
        <div class="flex flex-col gap-2">
          <NuxtLink
            v-for="link in links"
            :key="link.href"
            :to="link.href"
            class="flex items-center px-4 py-3 text-lg font-medium rounded-lg hover:bg-accent transition-colors"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- <div
            v-if="showAuthButtons"
            class="mt-4 pt-4 border-t border-border flex flex-col gap-3"
          >
            <template v-if="!auth.isAuthenticated.value">
              <NuxtLink
                :to="getLoginHref()"
                class="px-4 py-2 font-medium"
                @click="isMobileMenuOpen = false"
              >
                Login
              </NuxtLink>
              <NuxtLink
                :to="getRegisterHref()"
                class="flex h-12 items-center justify-center rounded-full bg-primary px-6 font-bold text-primary-foreground shadow-lg shadow-primary/20"
                @click="isMobileMenuOpen = false"
              >
                Get Started
              </NuxtLink>
            </template>
            <Button
              v-else
              @click="
                auth.logout();
                isMobileMenuOpen = false;
              "
              variant="outline"
              class="w-full h-12 rounded-full"
            >
              Logout
            </Button>
          </div> -->
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import useAuth from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, ShoppingCart, Menu, X } from "lucide-vue-next";
import { Slot } from "reka-ui";

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
  slogan: {
    type: String,
    default: "",
  },
});

const auth = useAuth();
const route = useRoute();
const isMobileMenuOpen = ref(false);
const checkoutToggled = ref(false);

const isDark = useDark();
const toggleDark = useToggle(isDark);

const getLoginHref = () =>
  route.path === "/" ? "/login" : `/login?source=${route.path}`;

const getRegisterHref = () =>
  route.path === "/" ? "/register" : `/register?source=${route.path}`;

watch(route, () => {
  isMobileMenuOpen.value = false;
});
</script>
