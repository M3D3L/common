<template>
  <div class="relative">
    <SeoMeta :follow="false" />
    <OrganismsBreezyHeader
      :logoSrc
      :links
      show-auth
      show-menu-broadcast
      @send-menu="sendTodayMenu"
    />
    <slot />
  </div>
</template>

<script lang="ts" setup>
type NavLink = { to: string; label: string };

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as unknown as {
  logoUrl?: string;
  nav?: { staffLinks?: NavLink[] };
};

const logoSrc = business.logoUrl || "";
const { sendTodayMenu } = provideComandas();

const links: NavLink[] = business.nav?.staffLinks?.length
  ? business.nav.staffLinks
  : [
      { to: "/inicio", label: "🕒" },
      { to: "/listas", label: "Listas" },
      { to: "/socios", label: "Miembros" },
      { to: "/menu", label: "Menú" },
      { to: "/comandas", label: "Comandas" },
      { to: "/promociones", label: "Promociones" },
      { to: "/platillos", label: "Platillos" },
      { to: "/productos", label: "Productos" },
      { to: "/recetas", label: "Recetas" },
      { to: "/semana/menu", label: "Menú semanal" },
      { to: "/semana/calendario", label: "Calendario" },
      { to: "/etiquetas", label: "Etiquetas" },
    ];
</script>

<style></style>
