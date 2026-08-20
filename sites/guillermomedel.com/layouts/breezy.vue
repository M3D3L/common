<template>
  <div class="relative">
    <OrganismsBreezyHeader :logoSrc :links />
    <slot />
  </div>
</template>

<script lang="ts" setup>
type NavLink = { to: string; label: string };

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as {
  logoUrl?: string;
  nav?: { publicLinks?: NavLink[] };
};

const logoSrc = business.logoUrl || "";

const links: NavLink[] = business.nav?.publicLinks?.length
  ? business.nav.publicLinks
  : [
      { to: "/menu", label: "Menú" },
      { to: "/menu-semanal", label: "Calendario" },
      { to: "/promos", label: "Promos" },
    ];
</script>

<style></style>
