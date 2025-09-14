<template>
  <NuxtLayout>
    <NuxtPage />
    <ChatButton class="fixed bottom-16 right-16" />
  </NuxtLayout>
</template>

<script setup>
import ChatButton from '@common/components/molecules/ChatButton.vue'
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
)
</script>
