<template>
  <Card>
    <CardContent class="pt-4 pb-3 px-4 space-y-2">
      <label
        class="text-[10px] text-neutral-400 tracking-widest uppercase font-semibold flex items-center gap-1.5"
      >
        <CalendarClock class="w-3 h-3" />
        Fecha de Caducidad
        <span class="text-neutral-600 normal-case tracking-normal font-normal"
          >· opcional</span
        >
      </label>

      <div class="grid grid-cols-3 gap-1.5">
        <button
          v-for="opt in props.expirationOptions"
          :key="opt.value"
          @click="$emit('setPreset', opt.value)"
          :class="[
            'text-[11px] py-1.5 px-2 rounded-md border transition-colors text-center',
            props.preset === opt.value
              ? 'bg-amber-400/10 border-amber-500 text-amber-400 font-medium'
              : 'border-neutral-700 text-neutral-400',
          ]"
        >
          {{ opt.label }}
        </button>

        <button
          @click="$emit('setPreset', 'custom')"
          :class="[
            'text-[11px] py-1.5 px-2 rounded-md border transition-colors text-center',
            props.preset === 'custom'
              ? 'bg-amber-400/10 border-amber-500 text-amber-400 font-medium'
              : 'border-neutral-700 text-neutral-400',
          ]"
        >
          Personalizada…
        </button>
      </div>

      <div
        v-if="props.date && props.preset !== 'custom'"
        class="flex items-center gap-1.5"
      >
        <Badge
          variant="outline"
          class="border-amber-700 text-amber-400 bg-amber-400/5 text-[11px] px-2 py-0.5 font-normal"
        >
          <CalendarClock class="w-2.5 h-2.5 mr-1" />
          {{ props.date }}
        </Badge>
        <button @click="$emit('clear')" class="text-neutral-600">
          <X class="w-3 h-3" />
        </button>
      </div>

      <div v-if="props.preset === 'custom'" class="space-y-1">
        <div class="relative">
          <CalendarClock
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-500"
          />
          <Input
            :value="props.date"
            type="text"
            placeholder="DD/MM/AAAA"
            maxlength="10"
            @input="$emit('input', $event)"
            class="pl-7"
            :class="
              props.dateError ? 'border-red-700 focus:border-red-500' : ''
            "
          />
        </div>
        <p v-if="props.dateError" class="text-[9px] text-red-400">
          {{ props.dateError }}
        </p>
      </div>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Card, CardContent } from "@common/components/ui/card";
import { Input } from "@common/components/ui/input";
import { Badge } from "@common/components/ui/badge";
import { CalendarClock, X } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    preset: string;
    date: string;
    dateError: string | null;
    expirationOptions?: { value: string; label: string }[];
  }>(),
  {
    expirationOptions: () => [
      { value: "1w", label: "1 semana" },
      { value: "2w", label: "2 semanas" },
      { value: "1m", label: "1 mes" },
      { value: "3m", label: "3 meses" },
      { value: "6m", label: "6 meses" },
      { value: "1y", label: "1 año" },
    ],
  },
);

defineEmits<{
  setPreset: [value: string];
  clear: [];
  input: [event: Event];
}>();
</script>
