<template>
  <div
    class="login-shell relative isolate min-h-screen min-h-[100svh] overflow-hidden bg-background text-foreground"
  >
    <SeoMeta :follow="false" />
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
      <Link
        href="https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap"
        rel="stylesheet"
      />
    </Head>

    <header class="absolute inset-x-0 top-0 z-10 px-5 py-5 sm:px-8">
      <NuxtLink
        to="/menu"
        class="inline-flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
        aria-label="Ir al menú de Breezy Meals"
      >
        <img
          :src="logoSrc"
          alt=""
          class="h-11 w-11 rounded-full border-2 border-white/80 bg-white object-cover shadow-sm"
        />
        <span class="brand-wordmark text-lg text-foreground">
          {{ brandName }}
        </span>
      </NuxtLink>
    </header>

    <main
      class="relative z-0 grid min-h-screen min-h-[100svh] place-items-center px-5 pb-8 pt-24"
    >
      <slot />
    </main>
  </div>
</template>

<script lang="ts" setup>
const runtimeConfig = useRuntimeConfig();
const business = (runtimeConfig.public?.business ?? {}) as {
  brandName?: string;
  logoUrl?: string;
};

const brandName = business.brandName || "Breezy Meals";
const logoSrc = business.logoUrl || "";
</script>

<style scoped>
.login-shell {
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
}
</style>
