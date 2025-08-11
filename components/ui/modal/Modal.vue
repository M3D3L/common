<template>
  <Dialog :open="isOpen" @update:open="isOpen = $event">
    <DialogTrigger as-child>
      <slot name="button"></slot>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ title }}</DialogTitle>
        <DialogDescription>{{ description }}</DialogDescription>
      </DialogHeader>

      <!-- Scrollable content container -->
      <div class="max-h-[60vh] overflow-y-auto px-1 mt-4">
        <div v-if="htmlContent" v-html="htmlContent" class="prose max-w-none"></div>
        <slot></slot>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const props = defineProps({
  htmlContent: { type: String, default: '' },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
})

const isOpen = ref(false)

const toggleModal = (value?: boolean) => {
  isOpen.value = value !== undefined ? value : !isOpen.value
}

defineExpose({ toggleModal })
</script>
