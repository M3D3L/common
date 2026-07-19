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
          Comida corrida
        </p>
        <h1
          class="font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-foreground transition-all duration-200"
        >
          Breezy Meals
        </h1>
        <p class="text-sm font-medium truncate text-muted-foreground">
          Menú de hoy / Today's Menu
        </p>
      </div>

      <!-- Desktop nav with smooth interactive states -->
      <nav class="items-center hidden gap-1.5 ml-auto md:flex">
        <Button
          v-for="l in links"
          :key="l.to"
          as-child
          size="sm"
          :variant="isActive(l.to) ? 'secondary' : 'ghost'"
          class="transition-all duration-200 hover:scale-102 active:scale-98 font-medium px-4"
        >
          <NuxtLink :to="l.to">{{ l.label }}</NuxtLink>
        </Button>
      </nav>

      <!-- Mobile nav trigger -->
      <Sheet v-model:open="open">
        <SheetTrigger as-child>
          <Button
            variant="ghost"
            size="icon"
            class="ml-auto md:hidden shrink-0 transition-transform duration-200 active:scale-95"
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
            <SheetTitle class="font-heading text-xl"
              >Menú de Navegación</SheetTitle
            >
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
          </nav>
        </SheetContent>
      </Sheet>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Card, CardContent } from "@common/components/ui/card";
import { Button } from "@common/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@common/components/ui/sheet";
import { Menu } from "lucide-vue-next";

defineProps<{ logoSrc: string }>();

const route = useRoute();
const open = ref(false);

const links = [
  { to: "/menu", label: "Menú" },
  // { to: "/semana", label: "Semanal" },
];

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
