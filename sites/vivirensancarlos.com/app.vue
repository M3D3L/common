<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const route = useRoute()

// Check if the code is running in a browser environment
if (process.client) {
  watch(
    () => route.fullPath,
    () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  )
}
</script>
