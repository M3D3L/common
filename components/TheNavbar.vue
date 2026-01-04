<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div
      class="container relative flex items-center justify-between h-16 mx-auto"
    >
      <NuxtLink
        v-if="logo"
        to="/"
        class="flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <img :src="logo" alt="Logo" class="h-10 md:h-12" />
      </NuxtLink>
      <NuxtLink
        v-else
        to="/"
        class="flex items-center transition-colors hover:text-primary"
      >
        <span class="flex flex-col logo-text">
          <span class="text-lg font-bold md:text-xl">{{ siteName }}</span>
        </span>
      </NuxtLink>

      <div class="flex items-center gap-2 md:gap-4">
        <nav
          class="items-center pl-4 gap-4 hidden justify-between w-full md:flex"
        >
          <AtomsStyledLink
            v-for="(link, linkIndex) in links"
            :key="linkIndex"
            :to="link.href"
            :title="link.label"
          />

          <slot name="extra-links" />

          <!-- <ClientOnly>
            <template v-if="showAuthButtons">
              <template v-if="!auth.isAuthenticated.value">
                <AtomsStyledLink :to="getLoginHref()" title="Login" />
                <AtomsStyledLink :to="getRegisterHref()" title="Register" />
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
            <template #fallback>
              <div class="w-20 h-8 animate-pulse bg-muted rounded-md"></div>
            </template>
          </ClientOnly> -->
        </nav>

        <ClientOnly>
          <button
            @click="toggleDark()"
            class="p-2.5 transition-all rounded-lg hover:bg-accent/50 hover:scale-110 active:scale-95"
            aria-label="Toggle dark mode"
          >
            <Sun
              v-if="isDark"
              class="w-5 h-5 transition-transform duration-500 rotate-0 hover:rotate-180"
            />
            <Moon
              v-else
              class="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-12"
            />
          </button>
        </ClientOnly>

        <button
          @click="isMobileMenuOpen = !isMobileMenuOpen"
          class="p-2.5 transition-all rounded-lg hover:bg-accent/50 md:hidden hover:scale-110 active:scale-95"
          aria-label="Toggle menu"
        >
          <X
            v-if="isMobileMenuOpen"
            class="w-5 h-5 transition-transform duration-300 rotate-0 hover:rotate-90"
          />
          <Menu
            v-else
            class="w-5 h-5 transition-transform duration-200 rotate-0 hover:scale-110"
          />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform -translate-y-2 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform -translate-y-2 opacity-0"
    >
      <Card
        v-if="isMobileMenuOpen"
        class="absolute w-full md:hidden !rounded-t-none"
      >
        <CardContent class="container flex flex-col gap-1 px-4 py-4">
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

          <div v-if="showAuthButtons" class="h-px my-2 bg-border/40" />

          <ClientOnly>
            <template v-if="showAuthButtons">
              <template v-if="!auth.isAuthenticated.value">
                <NuxtLink
                  :to="getLoginHref()"
                  class="px-4 py-3 text-sm font-medium"
                  @click="isMobileMenuOpen = false"
                  >Login</NuxtLink
                >
                <NuxtLink
                  :to="getRegisterHref()"
                  class="px-4 py-3 text-sm font-semibold bg-primary text-primary-foreground text-center rounded-lg"
                  @click="isMobileMenuOpen = false"
                  >Register</NuxtLink
                >
              </template>
              <Button
                v-else
                class="w-full"
                @click="
                  () => {
                    auth.logout();
                    isMobileMenuOpen = false;
                  }
                "
                variant="default"
                size="sm"
                >Logout</Button
              >
            </template>
          </ClientOnly>
        </CardContent>
      </Card>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import useAuth from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  route.path === "/" ? "/login" : `/login?source=${route.path}`;

const getRegisterHref = () =>
  route.path === "/" ? "/register" : `/register?source=${route.path}`;

watch(route, () => {
  isMobileMenuOpen.value = false;
});
</script>
