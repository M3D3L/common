<template>
  <div
    class="error-shell min-h-screen min-h-[100svh] bg-background text-foreground"
  >
    <Head>
      <Title>{{ pageTitle }}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&family=Roboto:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
    </Head>

    <OrganismsBreezyHeader :logo-src="logoSrc" :links="links" />

    <main
      class="relative z-10 isolate mx-auto grid min-h-[calc(100svh-81px)] max-w-5xl content-center overflow-hidden px-5 py-12 sm:px-8 sm:py-16"
    >
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-8 -z-10 bg-contain bg-center bg-no-repeat opacity-[0.08] sm:inset-12"
        :style="{ backgroundImage: `url(${logoSrc})` }"
      />
      <section class="relative max-w-2xl" aria-labelledby="error-title">
        <Badge
          variant="outline"
          class="mb-4 gap-1.5 border-primary/30 bg-background/70 px-3 py-1 text-primary"
        >
          <CircleAlert class="h-3.5 w-3.5" aria-hidden="true" />
          Error {{ statusCode }}
        </Badge>
        <h1
          id="error-title"
          class="brand-wordmark text-4xl leading-tight text-primary sm:text-6xl"
        >
          {{ heading }}
        </h1>
        <p
          class="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
        >
          {{ description }}
        </p>

        <div class="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            class="min-h-11 gap-2 font-bold"
            @click="goTo('/menu')"
          >
            <UtensilsCrossed class="h-4 w-4" aria-hidden="true" />
            Volver al menú
          </Button>
          <Button
            v-if="!isNotFound"
            variant="outline"
            size="lg"
            class="min-h-11 gap-2 font-bold"
            @click="retry"
          >
            <RefreshCw class="h-4 w-4" aria-hidden="true" />
            Intentar de nuevo
          </Button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";
import { Badge } from "@common/components/ui/badge";
import { Button } from "@common/components/ui/button";
import { CircleAlert, RefreshCw, UtensilsCrossed } from "lucide-vue-next";

const props = defineProps<{ error: NuxtError }>();
const runtimeConfig = useRuntimeConfig();
type NavLink = { to: string; label: string };

const business = (runtimeConfig.public?.business ?? {}) as {
  brandName?: string;
  logoUrl?: string;
  nav?: { publicLinks?: Array<Partial<NavLink>> };
};

const brandName = business.brandName || "Breezy Meals";
const logoSrc = business.logoUrl || "";
const links: NavLink[] = (business.nav?.publicLinks ?? [])
  .filter((link): link is NavLink => !!link?.to && !!link?.label)
  .map((link) => ({ to: link.to, label: link.label }));

if (!links.length) {
  links.push(
    { to: "/menu", label: "Menú" },
    { to: "/menu-semanal", label: "Calendario" },
    { to: "/promos", label: "Promos" },
    { to: "/tienda", label: "Tienda" },
  );
}

const requestPath = useRequestURL().pathname || "/menu";
const statusCode = computed(() => props.error?.statusCode || 500);
const isNotFound = computed(() => statusCode.value === 404);
const heading = computed(() =>
  isNotFound.value ? "Esta página no está en el menú" : "Algo salió mal",
);
const description = computed(() =>
  isNotFound.value
    ? "La página que buscas cambió de lugar o ya no está disponible. Regresa al menú para seguir explorando Breezy."
    : "No pudimos completar esta solicitud. Puedes intentarlo de nuevo o volver al menú principal.",
);
const pageTitle = computed(() =>
  isNotFound.value
    ? `Página no encontrada | ${brandName}`
    : `Error | ${brandName}`,
);

const goTo = (path: string) => clearError({ redirect: path });
const retry = () => clearError({ redirect: requestPath });
</script>

<style scoped>
.error-shell {
  font-family: "Roboto", sans-serif;
  background-image:
    linear-gradient(135deg, hsl(197 82% 38% / 0.12), transparent 42%),
    linear-gradient(315deg, hsl(161 72% 40% / 0.1), transparent 38%),
    repeating-linear-gradient(
      120deg,
      transparent 0,
      transparent 28px,
      hsl(34 90% 65% / 0.05) 29px,
      hsl(34 90% 65% / 0.05) 30px
    );
}

.brand-wordmark {
  font-family: "Alfa Slab One", serif;
  font-weight: 400;
  letter-spacing: 0;
}
</style>
