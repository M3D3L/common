<template>
  <header
    class="sticky top-0 z-40 border-b bg-background/80 backdrop-blur border-border"
  >
    <div class="flex items-center h-14 gap-1 px-4 mx-auto max-w-5xl">
      <NuxtLink to="/" class="mr-3 font-bold tracking-tight">Comandas</NuxtLink>
      <nav class="flex items-center gap-1">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          :class="
            isActive(l.to)
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          "
        >
          {{ l.label }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script lang="ts" setup>
const route = useRoute();

const links = [
  { to: "/", label: "Turno" },
  { to: "/semana", label: "Preórdenes" },
  { to: "/semana/menu", label: "Menú semanal" },
];

const isActive = (to: string) =>
  to === "/" ? route.path === "/" : route.path.startsWith(to);
</script>
