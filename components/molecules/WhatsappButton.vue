<template>
  <a
    :href="`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
      message
    )}`"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
  >
    <button @click="() => {}" size="lg" :variant class="w-full">
      <div class="flex flex-row gap-2 bg-opacity-0">
        <p>
          {{ text }}
        </p>
        <img
          src="/icons/whatsapp.svg"
          alt="WhatsApp Icon"
          :class="iconStyles"
        />
      </div>
    </button>
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
  text: {
    type: String,
    default: "Schedule a Call",
  },
  iconStyles: {
    type: String,
    default: "w-6 h-6",
  },
  variant: {
    type: String,
    default: "outline",
  },
});
</script>
