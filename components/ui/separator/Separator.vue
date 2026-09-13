<script setup lang="ts">
import { cn } from "~/lib/utils";
import { computed, type HTMLAttributes } from "vue";

type SeparatorProps = {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  asChild?: boolean;
  as?: any;
};

const props = defineProps<
  SeparatorProps & { class?: HTMLAttributes["class"]; label?: string }
>();

const orientation = computed(() => props.orientation || "horizontal");
</script>

<template>
  <div
    :role="props.decorative ? 'none' : 'separator'"
    :aria-orientation="orientation === 'vertical' ? 'vertical' : undefined"
    :class="
      cn(
        'shrink-0 bg-border relative',
        orientation === 'vertical' ? 'w-px h-full' : 'h-px w-full',
        props.class,
      )
    "
  >
    <span
      v-if="props.label"
      :class="
        cn(
          'text-xs text-muted-foreground bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center',
          orientation === 'vertical'
            ? 'w-[1px] px-1 py-2'
            : 'h-[1px] py-1 px-2',
        )
      "
      >{{ props.label }}</span
    >
  </div>
</template>
