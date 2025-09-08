<template>
  <section 
    v-if="isOpen"
    @click.self="closeModal"
    class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black/50"
  >
    <div class="relative p-6  rounded-lg max-w-[90vw] max-h-[90vh] overflow-auto">
      <Button 
        @click="closeModal"
        class="absolute text-gray-500 top-4 right-4 hover:text-gray-700"
      >
        &times;
      </Button>
      <slot></slot>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button';
const isOpen = ref(false);
const emit = defineEmits(['close']);

const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  emit('close');
};

// Expose methods to parent component
defineExpose({
  openModal,
  closeModal,
  isOpen
});
</script>