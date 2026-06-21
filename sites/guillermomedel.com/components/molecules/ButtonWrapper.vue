<template>
  <div class="grid content-center relative group">
    <slot />

    <div
      class="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 px-1.5 py-1 rounded-full bg-neutral-900 border border-neutral-700 shadow-lg opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 pointer-events-none group-hover:pointer-events-auto z-10 whitespace-nowrap"
    >
      <Button
        variant="ghost"
        size="sm"
        class="h-6 px-2 rounded-full text-[9px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-white hover:bg-neutral-700"
        @click.stop="$emit('edit')"
      >
        <Pencil class="w-2.5 h-2.5 mr-1" />
        Editar
      </Button>

      <Separator orientation="vertical" class="h-3 bg-neutral-700" />

      <Button
        variant="ghost"
        size="sm"
        class="h-6 px-2 rounded-full text-[9px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-amber-400 hover:bg-neutral-700"
        @click.stop="$emit('print')"
      >
        <Printer class="w-2.5 h-2.5 mr-1" />
        Imprimir
      </Button>

      <Separator orientation="vertical" class="h-3 bg-neutral-700" />

      <Button
        variant="ghost"
        size="sm"
        class="h-6 px-2 rounded-full text-[9px] font-semibold tracking-widest uppercase text-neutral-400 hover:text-emerald-400 hover:bg-neutral-700"
        @click.stop="$emit('download')"
      >
        <ImageDown class="w-2.5 h-2.5 mr-1" />
        PNG
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import { Separator } from "@common/components/ui/separator";
import { Pencil, Printer, ImageDown } from "lucide-vue-next";

defineEmits<{
  edit: [];
  print: [];
  download: [];
}>();
</script>
