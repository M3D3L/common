<template>
  <NuxtLayout>
    <NuxtPage />
    <ChatButton class="fixed bottom-16 right-16" />
  </NuxtLayout>
</template>

<script setup>
import ChatButton from '@common/components/molecules/ChatButton.vue'
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
