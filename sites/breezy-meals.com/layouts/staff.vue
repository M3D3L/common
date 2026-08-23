<template>
  <div class="relative">
    <SeoMeta :follow="false" />
    <OrganismsBreezyHeader :logoSrc :links show-auth />
    <slot />
  </div>
</template>

<script lang="ts" setup>
type NavLink = { to: string; label: string };

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as {
  logoUrl?: string;
  nav?: { staffLinks?: NavLink[] };
};

const logoSrc = business.logoUrl || "";

const links: NavLink[] = business.nav?.staffLinks?.length
  ? business.nav.staffLinks
  : [
      { to: "/inicio", label: "🕒" },
      { to: "/checklists", label: "Checklists" },
      { to: "/socios", label: "Miembros" },
      { to: "/orders", label: "Órdenes" },
      { to: "/promos-dashboard", label: "Promos" },
      { to: "/menu-items", label: "Menu Items" },
      { to: "/store-items", label: "Store Items" },
      { to: "/semana/menu", label: "Menu Control" },
      { to: "/semana/calendario", label: "Calendario" },
      { to: "/labels", label: "Etiquetas" },
    ];
</script>

<style></style>
