<template>
  <div
    class="-mx-4 border-y border-border/70 bg-background/85 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6"
  >
    <div class="flex gap-2 overflow-x-auto pb-0.5">
      <Button
        type="button"
        size="sm"
        class="h-8 shrink-0 rounded-full border border-border/70 px-3 text-xs font-bold"
        :variant="allOpen ? 'default' : 'outline'"
        @click="$emit('toggle-all')"
      >
        Todo / All
      </Button>

      <Button
        v-for="group in groups"
        :key="`chip-${group.key}`"
        type="button"
        size="sm"
        class="h-8 shrink-0 rounded-full border border-border/70 px-3 text-xs font-bold"
        :variant="isGroupOpen(group.key) ? 'default' : 'outline'"
        @click="$emit('focus-group', group.key)"
      >
        {{ group.label }}
        <span v-if="groupCartCount(group.key)" class="ml-1 tabular-nums"
          >· {{ groupCartCount(group.key) }}</span
        >
      </Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Button } from "@common/components/ui/button";
import type { GroupKey } from "~/utils/comandas";

defineProps<{
  groups: { key: GroupKey; label: string }[];
  allOpen: boolean;
  isGroupOpen: (key: GroupKey) => boolean;
  groupCartCount: (key: GroupKey) => number;
}>();
defineEmits<{ "toggle-all": []; "focus-group": [key: GroupKey] }>();
</script>
