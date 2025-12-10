<template>
  <a
    :href="`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
      message
    )}`"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
  >
    <img src="/icons/whatsapp.svg" alt="WhatsApp Icon" :class="iconStyles" />
  </a>
</template>

<script setup lang="ts">
const props = defineProps({
  phone: {
    type: String,
    default: "1234567890",
  },
  message: {
    type: String,
    default: "Hello, I would like to schedule a call!",
  },
  iconStyles: {
    type: String,
    default: "w-8 h-8",
  },
  variant: {
    type: String,
    default: "outline",
  },
});
</script>
