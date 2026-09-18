<template>
  <div class="relative">
    <SeoMeta :follow="false" />
    <OrganismsBreezyHeader
      :logoSrc
      :links
      :secondary-links="clientLinks"
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
  nav?: { staffLinks?: NavLink[]; publicLinks?: Array<Partial<NavLink>> };
};

const logoSrc = business.logoUrl || "";
const { sendTodayMenu } = provideComandas();

const links: NavLink[] = business.nav?.staffLinks?.length
  ? business.nav.staffLinks
  : [
      { to: "/inicio", label: "🕒" },
      { to: "/horarios", label: "Horarios" },
      { to: "/listas", label: "Listas" },
      { to: "/socios", label: "Miembros" },
      { to: "/redenciones", label: "Redenciones" },
      { to: "/comandas", label: "Comandas" },
      { to: "/promociones", label: "Promociones" },
      { to: "/platillos", label: "Platillos" },
      { to: "/productos", label: "Productos" },
      { to: "/recetas", label: "Recetas" },
      { to: "/semana/menu", label: "Menú semanal" },
      { to: "/semana/calendario", label: "Calendario" },
      { to: "/etiquetas", label: "Etiquetas" },
    ];

const fallbackClientLinks: NavLink[] = [
  { to: "/menu", label: "Menú" },
  { to: "/menu-semanal", label: "Calendario" },
  { to: "/promos", label: "Promos" },
  { to: "/membresia", label: "Membresía" },
  { to: "/tienda", label: "Tienda" },
  { to: "/catering", label: "Catering" },
];

const clientLinks: NavLink[] = (business.nav?.publicLinks ?? [])
  .filter((link): link is NavLink => !!link?.to && !!link?.label)
  .map((link) => ({ to: link.to, label: link.label }));

if (!clientLinks.length) clientLinks.push(...fallbackClientLinks);
</script>

<style></style>
