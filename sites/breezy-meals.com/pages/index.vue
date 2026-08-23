<template>
  <div class="grid min-h-screen place-items-center p-6 text-center">
    <p class="text-sm text-muted-foreground">Abriendo menu...</p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: "breezy" });

await navigateTo("/menu", { replace: true });
</script>
