<template>
  <Card
    class="sticky top-0 z-50 rounded-none border-x-0 border-t-0 border-b/60 bg-background/95 backdrop-blur-md shadow-xs transition-all duration-300"
  >
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>
    <CardContent
      class="flex items-center gap-4 px-4 py-3 mx-auto sm:gap-5 sm:px-6 max-w-7xl"
    >
      <!-- Logo with smooth hover ring transition -->
      <div class="relative shrink-0 group">
        <img
          :src="logoSrc"
          alt="Logo del restaurante"
          class="object-cover border-2 rounded-full h-12 w-12 sm:h-14 sm:w-14 border-primary/20 shadow-xs transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div class="flex flex-col justify-center min-w-0">
        <p
          class="mb-0.5 text-xs font-bold uppercase tracking-widest text-primary transition-colors duration-200"
        >
          {{ headerCopy.eyebrow }}
        </p>
        <h1
          class="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-foreground transition-all duration-200"
        >
          {{ headerCopy.title }}
        </h1>
        <p class="text-sm font-medium truncate text-muted-foreground">
          {{ headerCopy.subtitle }}
        </p>
      </div>

      <!-- Navigation sheet used at every viewport size -->
      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="ml-auto shrink-0 transition-transform duration-200 active:scale-95"
          >
            <Menu
              class="w-5 h-5 transition-transform duration-300"
              :class="{ 'rotate-90': open }"
            />
            <span class="sr-only">Abrir menú</span>
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          class="w-72 sm:w-80 transition-transform duration-300"
        >
          <SheetHeader class="text-left border-b pb-4 mb-4">
            <SheetTitle class="font-heading text-xl">{{
              headerCopy.menuTitle
            }}</SheetTitle>
          </SheetHeader>
          <nav class="flex flex-col gap-2">
            <Button
              v-for="l in links"
              :key="l.to"
              as-child
              class="justify-start transition-all duration-200 h-11 text-base font-medium"
              :variant="isActive(l.to) ? 'secondary' : 'ghost'"
              @click="open = false"
            >
              <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
            </Button>

            <Button
              v-if="showAuth && isLoggedIn"
              variant="outline"
              class="justify-start h-11 mt-2 text-base font-medium"
              @click="handleSignOut"
            >
              <LogOut class="w-4 h-4 mr-2" />
              Cerrar sesión
            </Button>
          </nav>
        </SheetContent>
      </Sheet>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@common/components/ui/sheet";
import { Menu, LogOut } from "lucide-vue-next";
import usePocketBase from "@common/composables/usePocketbase";

interface NavLink {
  to: string;
  label: string;
}

withDefaults(
  defineProps<{
    logoSrc: string;
    links?: NavLink[];
    showAuth?: boolean;
  }>(),
  {
    links: () => [],
    showAuth: false,
  },
);

const route = useRoute();
const open = ref(false);

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as {
  brandName?: string;
  header?: { eyebrow?: string; subtitle?: string; menuTitle?: string };
};

const headerCopy = {
  eyebrow: business.header?.eyebrow || "Comida corrida",
  title: business.brandName || "Breezy Meals",
  subtitle: business.header?.subtitle || "Menú de hoy / Today's Menu",
  menuTitle: business.header?.menuTitle || "Menú de Navegación",
};

const pb = usePocketBase();

// Local login flag. authStore is client-only (localStorage), so start false to
// match SSR and set the real value after mount to avoid a hydration mismatch.
const isLoggedIn = ref(false);

const syncAuth = () => {
  isLoggedIn.value = pb.authStore.isValid;
};

let stopAuthListener: (() => void) | undefined;

onMounted(() => {
  syncAuth();
  // authStore.onChange fires on login/logout within this instance — enough to
  // flip the button live after a sign-out click here.
  stopAuthListener = pb.authStore.onChange(syncAuth);
});

onBeforeUnmount(() => {
  stopAuthListener?.();
});

const handleSignOut = async () => {
  pb.authStore.clear();
  syncAuth(); // update immediately, don't wait on the listener
  open.value = false;
  await navigateTo("/");
};

const isActive = (to: string) =>
  to === "/" ? route.path === "/" : route.path.startsWith(to);
</script>

<style>
.font-body {
  font-family: "Roboto", sans-serif;
}
.font-heading {
  font-family: "Alfa Slab One", cursive !important;
  font-weight: 300 !important;
  color: var(--primary) !important;
}
</style>
