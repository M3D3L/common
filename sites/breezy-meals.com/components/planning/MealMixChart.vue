<template>
  <section class="min-w-0 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6">
    <div class="flex items-start justify-between gap-3">
      <div>
        <h2 class="text-lg font-semibold">Distribución de comidas</h2>
        <p class="mt-1 text-sm text-muted-foreground">{{ editable ? "Ajusta un porcentaje y repartiremos el resto sin cambiar el total del día." : "Qué porcentaje de los platos de la semana corresponde a cada comida." }}</p>
      </div>
      <span class="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-medium">{{ total }} platos</span>
    </div>
    <div v-if="items.length && total > 0" class="space-y-5">
      <div
        role="img"
        :aria-label="chartLabel"
        class="relative mx-auto grid h-56 w-56 place-items-center rounded-full sm:h-64 sm:w-64"
        :style="{ background: gradient }"
      >
        <div class="grid h-36 w-36 content-center rounded-full bg-card text-center shadow-sm sm:h-44 sm:w-44">
          <span class="text-4xl font-bold tracking-tight">{{ total }}</span>
          <span class="mt-1 text-sm text-muted-foreground">platos {{ editable ? "del día" : "en la semana" }}</span>
        </div>
      </div>
      <ul class="max-h-80 space-y-1 overflow-y-auto pr-1" aria-label="Porcentajes por comida">
        <li v-for="item in items" :key="item.id" class="flex items-center gap-3 rounded-lg px-1 py-2">
          <span class="h-3 w-3 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" aria-hidden="true" />
          <div class="min-w-0 flex-1"><p class="text-sm font-medium">{{ item.name }}</p><p class="text-xs text-muted-foreground">{{ item.quantity }} platos</p></div>
          <label v-if="editable" class="flex shrink-0 items-center gap-1 text-sm">
            <span class="sr-only">Participación de {{ item.name }} (%)</span>
            <input :value="Number(item.percentage.toFixed(1))" type="number" min="0" max="100" step="1" class="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-right tabular-nums" @change="changeShare(item.id, $event)" />
            <span>%</span>
          </label>
          <span v-else class="text-sm font-semibold tabular-nums">{{ item.percentage.toFixed(1) }}%</span>
        </li>
      </ul>
      <p class="text-xs text-muted-foreground">{{ editable ? "Los platos se redondean a números enteros; el gráfico siempre muestra la distribución real." : "Selecciona un día para ajustar sus porcentajes y actualizar las compras." }}</p>
    </div>
    <div v-else class="grid min-h-64 place-content-center text-center text-sm text-muted-foreground">Prepara la semana para ver la distribución de comidas.</div>
  </section>
</template>

<script setup lang="ts">
import type { MealShare } from "~/lib/meal-planning-summary";
const props = defineProps<{ items: MealShare[]; editable: boolean }>();
const emit = defineEmits<{ share: [id: string, percentage: number] }>();
const total = computed(() => props.items.reduce((sum, item) => sum + item.quantity, 0));
const chartLabel = computed(() => `Distribución de ${total.value} platos: ${props.items.map((item) => `${item.name}, ${item.percentage.toFixed(1)}%`).join("; ")}`);
const gradient = computed(() => {
  let offset = 0;
  const stops = props.items.map((item) => {
    const start = offset;
    offset += item.percentage;
    return `${item.color} ${start}% ${offset}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
});
function changeShare(id: string, event: Event) {
  const input = event.target;
  if (!(input instanceof HTMLInputElement)) return;
  emit("share", id, input.valueAsNumber);
}
</script>
