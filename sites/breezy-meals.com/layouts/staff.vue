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
import usePocketBase from "@common/composables/usePocketbase";

type NavLink = { to: string; label: string };

const VERIFIED_ONLY_ROUTES = new Set([
  "/redenciones",
  "/promociones",
  "/promos-dashboard",
  "/semana/menu",
  "/semana/calendario",
]);

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as unknown as {
  logoUrl?: string;
  nav?: { staffLinks?: NavLink[]; publicLinks?: Array<Partial<NavLink>> };
};

const logoSrc = business.logoUrl || "";
const { sendTodayMenu } = provideComandas();

const staffLinks: NavLink[] = business.nav?.staffLinks?.length
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

const pb = usePocketBase();
const isVerified = ref(pb.authStore.model?.verified === true);
const links = computed(() =>
  isVerified.value
    ? staffLinks
    : staffLinks.filter((link) => !VERIFIED_ONLY_ROUTES.has(link.to)),
);

let stopAuthListener: (() => void) | undefined;
onMounted(() => {
  isVerified.value = pb.authStore.model?.verified === true;
  stopAuthListener = pb.authStore.onChange(() => {
    isVerified.value = pb.authStore.model?.verified === true;
  });
});
onBeforeUnmount(() => stopAuthListener?.());

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
