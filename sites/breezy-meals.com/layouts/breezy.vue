<template>
  <div class="relative">
    <SeoMeta />
    <OrganismsBreezyHeader :logoSrc :links />

    <div
      v-if="showMenuStoreSwitcher"
      data-top-stack="switcher"
      class="sticky top-[76px] z-40 border-b border-border bg-background/95 px-4 py-2 backdrop-blur"
    >
      <div class="max-w-2xl mx-auto px-4 sm:px-6">
        <div class="mx-auto flex w-full rounded-lg border border-border p-1">
          <NuxtLink
            to="/menu"
            class="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
            :class="
              isMenuPage
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            "
          >
            Menú
          </NuxtLink>
          <NuxtLink
            to="/tienda"
            class="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold transition-colors"
            :class="
              isStorePage
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            "
          >
            Tienda
          </NuxtLink>
          <NuxtLink
            v-if="isStaff"
            to="/comandas"
            class="flex-1 rounded-md px-3 py-2 text-center text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted"
          >
            Comandas
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
import usePocketBase from "@common/composables/usePocketbase";

type NavLink = { to: string; label: string };

const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as unknown as {
  logoUrl?: string;
  nav?: { publicLinks?: Array<Partial<NavLink>> };
};

const logoSrc = business.logoUrl || "";

const fallbackLinks: NavLink[] = [
  { to: "/menu", label: "Menú" },
  { to: "/menu-semanal", label: "Calendario" },
  { to: "/promos", label: "Promos" },
  { to: "/tienda", label: "Tienda" },
];

const links: NavLink[] = (business.nav?.publicLinks ?? [])
  .filter((l): l is NavLink => !!l?.to && !!l?.label)
  .map((l) => ({ to: l.to, label: l.label }));

if (!links.length) {
  links.push(...fallbackLinks);
}

const route = useRoute();
const pb = usePocketBase();
const isStaff = ref(false);

onMounted(() => {
  isStaff.value = pb.authStore.isValid;
});

const canonicalPath = computed(() =>
  route.path.length > 1 ? route.path.replace(/\/+$/, "") : route.path,
);

const isMenuPage = computed(() => canonicalPath.value === "/menu");
const isStorePage = computed(() => canonicalPath.value === "/tienda");
const showMenuStoreSwitcher = computed(
  () => isMenuPage.value || isStorePage.value,
);
</script>

<style></style>
