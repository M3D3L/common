<template>
  <Button
    variant="ghost"
    size="icon"
    class="h-9 w-9"
    title="Día anterior"
    aria-label="Día anterior"
    @click="$emit('prev')"
  >
    <ClientOnly><ChevronLeft :size="18" /></ClientOnly>
  </Button>
  <div class="text-center">
    <p
      class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
    >
      Menú del día
    </p>
    <p class="text-sm font-bold capitalize">{{ label }}</p>
  </div>
  <Button
    variant="ghost"
    size="icon"
    class="h-9 w-9"
    title="Día siguiente"
    aria-label="Día siguiente"
    @click="$emit('next')"
  >
    <ClientOnly><ChevronRight :size="18" /></ClientOnly>
  </Button>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

defineProps<{ label: string }>();
defineEmits<{ prev: []; next: [] }>();
</script>
