<template>
    <section @click="toggleModal" class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen bg-black/50">
        <slot id="modal" ref="modal" name="modal" />
    </section>
</template>

<script setup lang="ts">
const modal = ref<HTMLElement | null>(null);

const emit = defineEmits(['close-modal']);

const closeModal = () => {
    emit('close-modal');
};

const toggleModal = () => {
    // Check if the clicked target is the modal itself
    if (modal.value && modal.value.contains(event.target as Node)) {
        return;
    }
    // Emit the close-modal event
    closeModal();  
};
</script>