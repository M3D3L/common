<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)
</script>
