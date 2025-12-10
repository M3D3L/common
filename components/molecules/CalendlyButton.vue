<template>
  <a
    :href="link"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
  >
    <div
      :class="iconStyles"
      class="rounded-full p-1 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <Calendar class="w-full h-full text-primary" />
    </div>
  </a>
</template>

<script setup lang="ts">
import { Calendar } from "lucide-vue-next";

const props = defineProps({
  link: {
    type: String,
    default: "https://calendly.com/brendaaigsc/30min",
  },
  iconStyles: {
    type: String,
    default: "w-8 h-8",
  },
});
</script>
