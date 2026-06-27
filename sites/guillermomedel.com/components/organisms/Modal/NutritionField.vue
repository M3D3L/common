<template>
  <div class="space-y-1">
    <label class="text-[9px] text-neutral-500 uppercase tracking-wider">{{
      label
    }}</label>
    <Input
      v-model.number="value"
      type="number"
      min="0"
      placeholder="Auto"
      class="h-7"
    />
  </div>
</template>

<script lang="ts" setup>
import { Input } from "@common/components/ui/input";

const props = defineProps<{ label: string; modelValue: number | null }>();
const emit = defineEmits<{ "update:modelValue": [v: number | null] }>();
const value = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>
